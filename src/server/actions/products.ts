import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { createSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga minimal 0"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export async function upsertProductAction(productId: string | null, formData: FormData) {
  await requireAdmin();

  const result = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    price: formData.get("price"),
    status: formData.get("status"),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const db = getDb();
  const slug = createSlug(result.data.name);

  if (productId) {
    await db.product.update({
      where: { id: productId },
      data: {
        name: result.data.name,
        slug,
        categoryId: result.data.categoryId,
        description: result.data.description,
        price: result.data.price,
        status: result.data.status,
      },
    });
  } else {
    await db.product.create({
      data: {
        name: result.data.name,
        slug,
        categoryId: result.data.categoryId,
        description: result.data.description,
        price: result.data.price,
        status: result.data.status,
      },
    });
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}
