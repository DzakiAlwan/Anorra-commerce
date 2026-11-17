import Link from "next/link";
import { formatRupiah } from "@/lib/money";

const highlights = [
  {
    title: "Katalog rapi",
    description: "Produk dikelompokkan per kategori dengan varian ukuran dan warna.",
  },
  {
    title: "Checkout jelas",
    description: "Alamat, ongkir, dan ringkasan biaya tampil sebelum pembayaran.",
  },
  {
    title: "Stok terkendali",
    description: "Stok per varian mengikuti pesanan yang sudah dibayar.",
  },
];

const startingPrice = 99000;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
              Ready to wear
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Baju sederhana untuk hari yang sibuk.
            </h1>
            <p className="max-w-lg text-lg text-zinc-600">
              Anorra Commerce menyiapkan katalog, varian ukuran, keranjang, dan checkout dalam satu
              tempat agar transaksi berjalan lancar.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/produk"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Lihat katalog
              </Link>
              <span className="text-sm text-zinc-500">
                Mulai dari {formatRupiah(startingPrice)}
              </span>
            </div>
          </div>

          <div id="katalog" className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="aspect-4/5 rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-300" />
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">Kaos Anorra Basic</h2>
                <p className="text-sm text-zinc-500">Kaos · S - XXL · 4 warna</p>
              </div>
              <p className="font-medium">{formatRupiah(129000)}</p>
            </div>
          </div>
        </section>

        <section id="tentang" className="grid gap-6 border-t border-zinc-200 py-16 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500">
          Fondasi Anorra Commerce siap dikembangkan.
        </div>
      </footer>
    </div>
  );
}
