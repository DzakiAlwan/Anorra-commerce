import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { findShippingOption } from "@/lib/shipping";
import type { CheckoutInput } from "@/lib/validation";

export type CreatedOrder = {
  orderNumber: string;
  accessToken: string;
};

export type SettlePaymentResult = {
  status: "paid" | "already_paid";
};

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();

  return `ANR-${date}-${suffix}`;
}

export async function createOrder(input: CheckoutInput): Promise<CreatedOrder> {
  const shipping = findShippingOption(input.shippingId);

  if (!shipping) {
    throw new Error("Metode pengiriman tidak dikenal.");
  }

  const quantities = new Map<string, number>();

  for (const line of input.items) {
    quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.quantity);
  }

  const db = getDb();

  return db.$transaction(async (tx) => {
    const variants = await tx.variant.findMany({
      where: { id: { in: [...quantities.keys()] } },
      select: {
        id: true,
        size: true,
        color: true,
        stock: true,
        priceOverride: true,
        product: { select: { id: true, name: true, status: true, price: true } },
      },
    });

    if (variants.length !== quantities.size) {
      throw new Error("Sebagian produk di keranjang tidak ditemukan.");
    }

    const lines = variants.map((variant) => {
      const quantity = quantities.get(variant.id) ?? 0;

      if (variant.product.status !== "ACTIVE") {
        throw new Error(`Produk ${variant.product.name} sudah tidak dijual.`);
      }

      if (variant.stock < quantity) {
        throw new Error(
          `Stok ${variant.product.name} (${variant.color}/${variant.size}) tinggal ${variant.stock}.`,
        );
      }

      return {
        productId: variant.product.id,
        variantId: variant.id,
        nameSnapshot: variant.product.name,
        variantSnapshot: `${variant.color} / ${variant.size}`,
        unitPrice: variant.priceOverride ?? variant.product.price,
        quantity,
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const total = subtotal + shipping.cost;

    const user = await tx.user.upsert({
      where: { email: input.email },
      update: {},
      create: {
        email: input.email,
        name: input.address.recipient,
        passwordHash: `guest:${randomUUID()}`,
      },
      select: { id: true },
    });

    const address = await tx.address.create({
      data: {
        userId: user.id,
        label: "Alamat checkout",
        recipient: input.address.recipient,
        phone: input.address.phone,
        line1: input.address.line1,
        line2: input.address.line2 && input.address.line2.length > 0 ? input.address.line2 : null,
        city: input.address.city,
        province: input.address.province,
        postalCode: input.address.postalCode,
      },
      select: { id: true },
    });

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        accessToken: randomUUID(),
        userId: user.id,
        addressId: address.id,
        status: "PENDING",
        subtotal,
        shippingCost: shipping.cost,
        total,
        items: { create: lines },
        shipment: {
          create: {
            courier: shipping.courier,
            service: shipping.service,
            cost: shipping.cost,
          },
        },
        payment: {
          create: {
            provider: "mock",
            externalId: `MOCK-${randomUUID()}`,
            amount: total,
            status: "PENDING",
          },
        },
      },
      select: { orderNumber: true, accessToken: true },
    });
  });
}

export async function getOrderForCustomer(orderNumber: string, accessToken: string) {
  if (orderNumber.length === 0 || accessToken.length === 0) {
    return null;
  }

  const db = getDb();

  return db.order.findFirst({
    where: { orderNumber, accessToken },
    select: {
      orderNumber: true,
      status: true,
      subtotal: true,
      shippingCost: true,
      total: true,
      createdAt: true,
      address: {
        select: {
          recipient: true,
          phone: true,
          line1: true,
          line2: true,
          city: true,
          province: true,
          postalCode: true,
        },
      },
      items: {
        select: {
          id: true,
          nameSnapshot: true,
          variantSnapshot: true,
          unitPrice: true,
          quantity: true,
          product: {
            select: {
              slug: true,
              images: {
                orderBy: { position: "asc" },
                take: 1,
                select: { url: true, alt: true },
              },
            },
          },
        },
      },
      payment: {
        select: { provider: true, externalId: true, status: true, amount: true, paidAt: true },
      },
      shipment: {
        select: { courier: true, service: true, trackingNumber: true },
      },
    },
  });
}

export type CustomerOrder = NonNullable<Awaited<ReturnType<typeof getOrderForCustomer>>>;

export async function settleMockPayment(
  orderNumber: string,
  accessToken: string,
): Promise<SettlePaymentResult> {
  const db = getDb();

  return db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { orderNumber, accessToken },
      select: {
        id: true,
        status: true,
        items: { select: { variantId: true, quantity: true } },
        payment: { select: { id: true, status: true } },
      },
    });

    if (!order) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    if (!order.payment) {
      throw new Error("Pesanan belum memiliki tagihan.");
    }

    const claimed = await tx.payment.updateMany({
      where: { id: order.payment.id, status: "PENDING" },
      data: { status: "PAID", paidAt: new Date() },
    });

    if (claimed.count === 0) {
      if (order.payment.status === "PAID" && order.status === "PAID") {
        return { status: "already_paid" as const };
      }

      throw new Error(`Pembayaran tidak bisa diproses (status ${order.payment.status}).`);
    }

    for (const item of order.items) {
      const updated = await tx.variant.updateMany({
        where: { id: item.variantId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (updated.count === 0) {
        throw new Error("Stok tidak mencukupi untuk menyelesaikan pembayaran.");
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    return { status: "paid" as const };
  });
}
