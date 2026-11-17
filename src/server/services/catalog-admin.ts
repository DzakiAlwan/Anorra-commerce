import { getDb } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { AdminProductInput, VariantInput } from "@/lib/validation";

export async function createProduct(input: AdminProductInput): Promise<{ slug: string }> {
  const db = getDb();

  return db.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      description: input.description && input.description.length > 0 ? input.description : null,
      price: input.price,
      status: input.status,
    },
    select: { slug: true },
  });
}

export async function updateProduct(slug: string, input: AdminProductInput): Promise<void> {
  const db = getDb();

  await db.product.update({
    where: { slug },
    data: {
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      description: input.description && input.description.length > 0 ? input.description : null,
      price: input.price,
      status: input.status,
    },
  });
}

export async function setProductStatus(
  slug: string,
  status: "DRAFT" | "ACTIVE" | "ARCHIVED",
): Promise<void> {
  const db = getDb();

  await db.product.update({ where: { slug }, data: { status } });
}

export async function createVariant(productId: string, input: VariantInput): Promise<void> {
  const db = getDb();

  await db.variant.create({
    data: {
      productId,
      size: input.size,
      color: input.color,
      sku: input.sku,
      priceOverride: input.priceOverride ?? null,
      stock: input.stock,
    },
  });
}

export async function updateVariant(variantId: string, input: VariantInput): Promise<void> {
  const db = getDb();

  await db.variant.update({
    where: { id: variantId },
    data: {
      size: input.size,
      color: input.color,
      sku: input.sku,
      priceOverride: input.priceOverride ?? null,
      stock: input.stock,
    },
  });
}

export async function deleteVariant(variantId: string): Promise<void> {
  const db = getDb();

  const used = await db.orderItem.count({ where: { variantId } });

  if (used > 0) {
    throw new Error("Varian sudah dipakai di pesanan, tidak bisa dihapus. Set stok 0 saja.");
  }

  await db.variant.delete({ where: { id: variantId } });
}

export async function createCategory(name: string): Promise<void> {
  const db = getDb();
  const slug = slugify(name);

  if (slug.length < 2) {
    throw new Error("Nama kategori tidak valid.");
  }

  await db.category.create({ data: { name, slug } });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const db = getDb();

  const used = await db.product.count({ where: { categoryId } });

  if (used > 0) {
    throw new Error("Kategori masih dipakai produk, pindahkan produknya dulu.");
  }

  await db.category.delete({ where: { id: categoryId } });
}
