import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/money";
import type { CatalogProduct } from "@/server/queries/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const variantSummary = [
    product.colors.length > 0 ? `${product.colors.length} warna` : null,
    product.sizes.length > 0 ? `ukuran ${product.sizes.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/produk/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-4/5 bg-linear-to-br from-zinc-100 to-zinc-300">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt ?? product.name}
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {product.category.name}
          </p>
          <h2 className="font-medium">{product.name}</h2>
          {variantSummary ? <p className="text-sm text-zinc-500">{variantSummary}</p> : null}
          <p className="mt-auto pt-2 text-lg font-semibold">
            {product.fromPrice < product.price
              ? `Mulai ${formatRupiah(product.fromPrice)}`
              : formatRupiah(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
