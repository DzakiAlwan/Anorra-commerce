"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getStorageStatus, uploadProductImageFile } from "@/lib/supabase-storage";
import { productImageSchema } from "@/lib/validation";

export type UploadImageState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function uploadProductImageAction(
  _prevState: UploadImageState,
  formData: FormData,
): Promise<UploadImageState> {
  if (process.env.NODE_ENV === "production") {
    return { status: "error", message: "Upload gambar dinonaktifkan di produksi." };
  }

  const slug = formData.get("slug");
  if (typeof slug !== "string" || slug.length === 0) {
    return { status: "error", message: "Produk tidak valid." };
  }

  const parsed = productImageSchema.safeParse({
    file: formData.get("file"),
    alt: formData.get("alt") ?? undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Input gambar tidak valid.",
    };
  }

  const storageStatus = getStorageStatus();
  if (!storageStatus.ready) {
    return { status: "error", message: storageStatus.reason ?? "Storage belum siap." };
  }

  const db = getDb();
  const product = await db.product.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (!product) {
    return { status: "error", message: "Produk tidak ditemukan." };
  }

  try {
    const url = await uploadProductImageFile({
      productId: product.id,
      file: parsed.data.file,
    });

    const imageCount = await db.productImage.count({ where: { productId: product.id } });

    await db.productImage.create({
      data: {
        productId: product.id,
        url,
        alt: parsed.data.alt && parsed.data.alt.length > 0 ? parsed.data.alt : product.name,
        position: imageCount,
      },
    });

    revalidatePath("/produk");
    revalidatePath(`/produk/${product.slug}`);
    revalidatePath(`/admin/produk/${product.slug}`);

    return { status: "success", message: "Gambar berhasil diunggah." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Gagal mengunggah gambar.",
    };
  }
}
