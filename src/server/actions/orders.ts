"use server";

import { revalidatePath } from "next/cache";
import { checkoutInputSchema } from "@/lib/validation";
import { createOrder, settleMockPayment } from "@/server/services/orders";
import { requireAdmin } from "@/lib/session";
import { getDb } from "@/lib/db";

export type CreateOrderResult =
  | { ok: true; orderNumber: string; accessToken: string }
  | { ok: false; message: string };

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

export async function createOrderAction(formData: FormData): Promise<CreateOrderResult> {
  let items: unknown;

  try {
    items = JSON.parse(readField(formData, "items") || "[]");
  } catch {
    return { ok: false, message: "Data keranjang tidak valid." };
  }

  const parsed = checkoutInputSchema.safeParse({
    email: readField(formData, "email"),
    shippingId: readField(formData, "shippingId"),
    items,
    address: {
      recipient: readField(formData, "recipient"),
      phone: readField(formData, "phone"),
      line1: readField(formData, "line1"),
      line2: readField(formData, "line2"),
      city: readField(formData, "city"),
      province: readField(formData, "province"),
      postalCode: readField(formData, "postalCode"),
    },
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Data checkout tidak valid.",
    };
  }

  try {
    const order = await createOrder(parsed.data);

    revalidatePath("/pesanan");

    return { ok: true, orderNumber: order.orderNumber, accessToken: order.accessToken };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal membuat pesanan.",
    };
  }
}

export type PaymentActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin();
  const db = getDb();
  
  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath("/admin/pesanan");
}

export async function payOrderAction(
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const orderNumber = readField(formData, "orderNumber");
  const accessToken = readField(formData, "accessToken");

  if (orderNumber.length === 0 || accessToken.length === 0) {
    return { status: "error", message: "Pesanan tidak valid." };
  }

  try {
    const result = await settleMockPayment(orderNumber, accessToken);

    revalidatePath(`/pesanan/${orderNumber}`);
    revalidatePath("/pesanan");

    return {
      status: "success",
      message:
        result.status === "already_paid"
          ? "Pesanan ini sudah lunas sebelumnya."
          : "Pembayaran berhasil disimulasikan. Stok sudah dikurangi.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Pembayaran gagal diproses.",
    };
  }
}
