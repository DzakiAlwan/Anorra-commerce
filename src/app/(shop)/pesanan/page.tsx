import type { Metadata } from "next";
import { OrderHistoryList } from "@/components/orders/order-history-list";

export const metadata: Metadata = {
  title: "Pesanan saya",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Pesanan</p>
        <h1 className="text-3xl font-semibold tracking-tight">Pesanan saya</h1>
        <p className="text-zinc-600">
          Riwayat pesanan tersimpan di browser ini. Simpan nomor pesanan dan tautannya.
        </p>
      </header>

      <div className="mt-8">
        <OrderHistoryList />
      </div>
    </div>
  );
}
