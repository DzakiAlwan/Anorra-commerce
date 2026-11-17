import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MockPaymentButton } from "@/components/orders/mock-payment-button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatRupiah } from "@/lib/money";
import { getOrderForCustomer } from "@/server/services/orders";

export const metadata: Metadata = {
  title: "Detail pesanan",
  robots: { index: false, follow: false },
};

type OrderPageProps = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

export default function OrderDetailPage(props: OrderPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetail {...props} />
      </Suspense>
    </div>
  );
}

async function OrderDetail({ params, searchParams }: OrderPageProps) {
  const { orderNumber } = await params;
  const query = await searchParams;
  const token = Array.isArray(query.token) ? (query.token[0] ?? "") : (query.token ?? "");

  const order = await getOrderForCustomer(orderNumber, token);

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <p className="text-lg font-medium">Pesanan tidak ditemukan</p>
        <p className="mt-1 text-sm text-zinc-600">
          Periksa kembali nomor pesanan dan tautan yang kamu simpan. Tautan tanpa token akses tidak
          bisa membuka pesanan.
        </p>
        <Link
          href="/pesanan"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Lihat riwayat pesanan
        </Link>
      </div>
    );
  }

  const paymentPending = order.payment?.status === "PENDING" && order.status === "PENDING";
  const virtualAccount = `8808 ${orderNumber.replaceAll("-", "").slice(-8)}`;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
        <Link href="/pesanan" className="hover:text-zinc-950">
          Pesanan saya
        </Link>
        <span aria-hidden="true" className="px-2">
          /
        </span>
        <span className="text-zinc-900">{order.orderNumber}</span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-zinc-500">
          Dibuat{" "}
          {order.createdAt.toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      </header>

      {paymentPending && order.payment ? (
        <section className="space-y-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="space-y-1">
            <h2 className="font-medium text-amber-900">Menunggu pembayaran</h2>
            <p className="text-sm text-amber-800">
              Gateway pembayaran masih mock. Transfer ke virtual account di bawah, lalu tekan tombol
              simulasi untuk menandai lunas.
            </p>
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-amber-700">Virtual account (mock)</dt>
              <dd className="font-mono text-base font-semibold text-amber-950">{virtualAccount}</dd>
            </div>
            <div>
              <dt className="text-amber-700">Jumlah tagihan</dt>
              <dd className="text-base font-semibold text-amber-950">
                {formatRupiah(order.payment.amount)}
              </dd>
            </div>
          </dl>

          <MockPaymentButton orderNumber={order.orderNumber} accessToken={token} />
        </section>
      ) : null}

      {order.status === "PAID" && order.payment?.paidAt ? (
        <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">
          Pembayaran diterima{" "}
          {order.payment.paidAt.toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          })}
          . Stok sudah dikurangi dan pesanan siap diproses.
        </section>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-medium">Item pesanan</h2>

        <ul className="divide-y divide-zinc-200">
          {order.items.map((item) => {
            const image = item.product.images[0];

            return (
              <li key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? item.nameSnapshot}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/produk/${item.product.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.nameSnapshot}
                    </Link>
                    <p className="text-sm text-zinc-500">
                      {item.variantSnapshot} · {item.quantity}x
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-5 text-sm">
          <h2 className="font-medium">Alamat pengiriman</h2>
          <p className="font-medium">{order.address.recipient}</p>
          <p className="text-zinc-600">{order.address.phone}</p>
          <p className="text-zinc-600">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
          </p>
          <p className="text-zinc-600">
            {order.address.city}, {order.address.province} {order.address.postalCode}
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-5 text-sm">
          <h2 className="font-medium">Pengiriman</h2>
          <p className="text-zinc-600">
            {order.shipment
              ? `${order.shipment.courier} ${order.shipment.service}`
              : "Belum ditentukan"}
          </p>
          <p className="text-zinc-600">
            {order.shipment?.trackingNumber
              ? `Resi ${order.shipment.trackingNumber}`
              : "Nomor resi belum tersedia"}
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Jumlah item</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Subtotal</dt>
            <dd>{formatRupiah(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Ongkos kirim</dt>
            <dd>{formatRupiah(order.shippingCost)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatRupiah(order.total)}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
      <div className="h-8 w-64 animate-pulse rounded bg-zinc-100" />
      <div className="h-40 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
      <div className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
    </div>
  );
}
