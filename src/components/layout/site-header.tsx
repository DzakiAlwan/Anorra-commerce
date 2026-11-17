"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function SiteHeader() {
  const { itemCount, ready } = useCart();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Anorra
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/produk" className="hover:text-zinc-950">
            Katalog
          </Link>
          <Link href="/pesanan" className="hover:text-zinc-950">
            Pesanan
          </Link>
          <Link href="/#tentang" className="hover:text-zinc-950">
            Tentang
          </Link>
          <Link
            href="/keranjang"
            className="inline-flex items-center gap-2 hover:text-zinc-950"
            aria-label="Keranjang belanja"
          >
            Keranjang
            {ready && itemCount > 0 ? (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
