import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Checkout</p>
        <h1 className="text-3xl font-semibold tracking-tight">Alamat & pengiriman</h1>
        <p className="text-zinc-600">Lengkapi alamat, pilih kurir, lalu periksa ringkasan biaya.</p>
      </header>

      <div className="mt-8">
        <CheckoutView />
      </div>
    </div>
  );
}
