import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CatalogCategory } from "@/server/queries/catalog";

type ProductFiltersProps = {
  categories: CatalogCategory[];
  query: string;
  categorySlug: string;
};

export function ProductFilters({ categories, query, categorySlug }: ProductFiltersProps) {
  const hasFilter = query.length > 0 || categorySlug.length > 0;

  return (
    <form
      action="/produk"
      method="get"
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">
          Cari produk
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Cari nama atau deskripsi produk..."
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label htmlFor="kategori" className="sr-only">
          Kategori
        </label>
        <select
          id="kategori"
          name="kategori"
          defaultValue={categorySlug}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-900 sm:w-48"
        >
          <option value="">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">Terapkan</Button>

      {hasFilter ? (
        <Link
          href="/produk"
          className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-600 hover:text-zinc-950"
        >
          Reset
        </Link>
      ) : null}
    </form>
  );
}
