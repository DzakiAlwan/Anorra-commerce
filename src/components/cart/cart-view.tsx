"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatRupiah } from "@/lib/money";

export function CartView() {
  const { items, ready, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (!ready) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <p className="font-medium">Keranjang masih kosong</p>
        <p className="mt-1 text-sm text-zinc-600">Tambahkan produk dari katalog untuk mulai belanja.</p>
        <Link
          href="/produk"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Lihat katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        {items.map((item) => (
          <article
            key={item.variantId}
            className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <Link
              href={`/produk/${item.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/produk/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-zinc-500">
                    {item.size} · {item.color}
                  </p>
                </div>
                <p className="font-medium">{formatRupiah(item.price * item.quantity)}</p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-zinc-300">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-9 w-9 text-lg leading-none text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    className="h-9 w-9 text-lg leading-none text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm text-zinc-500 hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </article>
        ))}

        <div className="flex items-center justify-between text-sm">
          <Link href="/produk" className="font-medium underline">
            Lanjut belanja
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-zinc-500 hover:text-red-600"
          >
            Kosongkan keranjang
          </button>
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-medium">Ringkasan</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Jumlah item</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Subtotal</dt>
            <dd>{formatRupiah(subtotal)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Lanjut ke checkout
        </Link>
        <p className="mt-3 text-xs text-zinc-500">Ongkir dihitung di halaman checkout.</p>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <div className="h-24 w-20 animate-pulse rounded-xl bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
              <div className="h-8 w-28 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
    </div>
  );
}
