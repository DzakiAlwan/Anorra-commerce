import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VariantPicker } from "@/components/product/variant-picker";
import { getCatalogProductBySlug } from "@/server/queries/catalog";

type ProductParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: ProductParams }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return { title: "Produk tidak ditemukan" };
  }

  return {
    title: product.name,
    description: product.description ?? `${product.name} dari kategori ${product.category.name}.`,
  };
}

export default function ProductDetailPage({ params }: { params: ProductParams }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: { params: ProductParams }) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [cover, ...gallery] = product.images;

  return (
    <article className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/produk" className="hover:text-zinc-950">
              Katalog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/produk?kategori=${product.category.slug}`}
              className="hover:text-zinc-950"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-zinc-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-zinc-200 bg-linear-to-br from-zinc-100 to-zinc-300">
            {cover ? (
              <Image
                src={cover.url}
                alt={cover.alt ?? product.name}
                fill
                unoptimized
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          {gallery.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? product.name}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 16vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          </div>

          {product.description ? (
            <p className="text-zinc-600">{product.description}</p>
          ) : null}

          <VariantPicker
            key={product.id}
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            basePrice={product.price}
            imageUrl={cover?.url ?? null}
            variants={product.variants}
          />

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Nominal mengikuti harga varian terpilih. Stok dihitung per varian setelah pembayaran
            terkonfirmasi.
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="aspect-4/5 animate-pulse rounded-3xl border border-zinc-200 bg-zinc-100" />
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100" />
        <div className="h-10 w-40 animate-pulse rounded bg-zinc-100" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}
