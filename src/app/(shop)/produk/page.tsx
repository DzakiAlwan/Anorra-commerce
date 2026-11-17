import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { listCatalogCategories, listCatalogProducts } from "@/server/queries/catalog";

export const metadata: Metadata = {
  title: "Katalog",
  description: "Jelajahi katalog produk Anorra Commerce dan temukan ukuran yang pas.",
};

type CatalogSearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim().slice(0, 100) ?? "";
}

export default function CatalogPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Katalog</p>
        <h1 className="text-3xl font-semibold tracking-tight">Semua produk</h1>
        <p className="text-zinc-600">Cari dan filter produk sesuai kebutuhan.</p>
      </header>

      <div className="mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function CatalogContent({ searchParams }: { searchParams: CatalogSearchParams }) {
  const params = await searchParams;
  const query = readParam(params.q);
  const categorySlug = readParam(params.kategori);

  const [categories, products] = await Promise.all([
    listCatalogCategories(),
    listCatalogProducts({ query, categorySlug }),
  ]);

  return (
    <>
      <ProductFilters categories={categories} query={query} categorySlug={categorySlug} />

      <p className="mt-6 text-sm text-zinc-500">
        {products.length > 0 ? `${products.length} produk ditemukan` : "Belum ada produk yang cocok"}
      </p>

      {products.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="font-medium">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-zinc-600">Coba kata kunci lain atau reset filter.</p>
          <Link href="/produk" className="mt-4 inline-block text-sm font-medium underline">
            Lihat semua produk
          </Link>
        </div>
      )}
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[74px] animate-pulse rounded-2xl border border-zinc-200 bg-white" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="aspect-4/5 animate-pulse bg-zinc-100" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
