import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Keranjang",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Keranjang</p>
        <h1 className="text-3xl font-semibold tracking-tight">Keranjang belanja</h1>
        <p className="text-zinc-600">Periksa item dan jumlah sebelum checkout.</p>
      </header>

      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
