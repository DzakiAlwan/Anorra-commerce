import { getDb } from "@/lib/db";

export type CatalogCategory = {
  name: string;
  slug: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  fromPrice: number;
  category: CatalogCategory;
  image: { url: string; alt: string | null } | null;
  sizes: string[];
  colors: string[];
};

export type CatalogFilters = {
  query?: string;
  categorySlug?: string;
};

export type CatalogProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  priceOverride: number | null;
  stock: number;
};

export type CatalogProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: CatalogCategory;
  images: { id: string; url: string; alt: string | null }[];
  variants: CatalogProductVariant[];
};

export async function listCatalogCategories(): Promise<CatalogCategoryDetail[]> {
  const db = getDb();

  return db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export type CatalogCategoryDetail = {
  id: string;
  name: string;
  slug: string;
};


export async function listCatalogProducts(filters: CatalogFilters): Promise<CatalogProduct[]> {
  const db = getDb();
  const query = filters.query?.trim();

  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { position: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
      variants: { select: { size: true, color: true, priceOverride: true } },
    },
  });

  return products.map((product) => {
    const fromPrice = product.variants.reduce(
      (minimum, variant) => Math.min(minimum, variant.priceOverride ?? product.price),
      product.price,
    );

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      fromPrice,
      category: product.category,
      image: product.images[0] ?? null,
      sizes: [...new Set(product.variants.map((variant) => variant.size))],
      colors: [...new Set(product.variants.map((variant) => variant.color))],
    };
  });
}

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  const db = getDb();

  return db.product.findFirst({
    where: { slug, status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      category: { select: { name: true, slug: true } },
      images: {
        orderBy: { position: "asc" },
        select: { id: true, url: true, alt: true },
      },
      variants: {
        orderBy: [{ color: "asc" }, { size: "asc" }],
        select: {
          id: true,
          size: true,
          color: true,
          sku: true,
          priceOverride: true,
          stock: true,
        },
      },
    },
  });
}
