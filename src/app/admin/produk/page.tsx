import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin - Produk",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  // Ponytail: Allow admin access in production for management
  // if (process.env.NODE_ENV === "production") {
  //   notFound();
  // }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Produk</h1>
          <p className="text-zinc-600">Daftar semua produk di toko Anda.</p>
        </div>
        <Link
          href="/admin/produk/baru"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Tambah Produk
        </Link>
      </header>

      <div>
        <Suspense fallback={<p className="text-sm text-zinc-500">Memuat produk...</p>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductList() {
  const db = getDb();
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      _count: { select: { images: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-600">
        Belum ada produk. Jalankan seed terlebih dahulu.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {products.map((product) => (
        <li key={product.id}>
          <div className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50">
            <span>
              <span className="block font-medium">{product.name}</span>
              <span className="block text-sm text-zinc-500">
                {product.status} · {product._count.images} gambar
              </span>
            </span>
            <div className="flex gap-3">
              <Link
                href={`/admin/produk/${product.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
