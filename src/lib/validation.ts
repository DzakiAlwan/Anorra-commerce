import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().positive(),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export const productImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File gambar kosong." })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, { message: "Ukuran gambar maksimal 5 MB." })
    .refine((file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type), {
      message: "Format gambar harus JPG, PNG, WEBP, atau AVIF.",
    }),
  alt: z.string().trim().max(120).optional(),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

export const addressInputSchema = z.object({
  recipient: z.string().trim().min(3, "Nama penerima minimal 3 karakter."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Nomor telepon tidak valid (8-20 digit)."),
  line1: z.string().trim().min(5, "Alamat minimal 5 karakter."),
  line2: z.string().trim().max(120, "Detail alamat maksimal 120 karakter.").optional(),
  city: z.string().trim().min(2, "Kota wajib diisi."),
  province: z.string().trim().min(2, "Provinsi wajib diisi."),
  postalCode: z.string().trim().regex(/^[0-9]{4,6}$/, "Kode pos harus 4-6 digit."),
});

export type AddressInput = z.infer<typeof addressInputSchema>;

export const emailInputSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email wajib diisi.")
  .max(254, "Email terlalu panjang.")
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), "Email tidak valid.");

export const cartLineInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1, "Jumlah minimal 1.").max(99, "Jumlah maksimal 99."),
});

export const checkoutInputSchema = z.object({
  email: emailInputSchema,
  shippingId: z.string().min(1, "Pilih metode pengiriman."),
  address: addressInputSchema,
  items: z.array(cartLineInputSchema).min(1, "Keranjang kosong.").max(50, "Terlalu banyak item."),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const adminProductInputSchema = z.object({
  name: z.string().trim().min(3, "Nama produk minimal 3 karakter.").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug wajib diisi.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  categoryId: z.string().min(1, "Kategori wajib dipilih."),
  description: z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter.").optional(),
  price: z.coerce.number().int().positive("Harga harus lebih dari 0."),
  status: productStatusSchema,
});

export type AdminProductInput = z.infer<typeof adminProductInputSchema>;

export const variantInputSchema = z.object({
  size: z.string().trim().min(1, "Ukuran wajib diisi.").max(20),
  color: z.string().trim().min(1, "Warna wajib diisi.").max(30),
  sku: z.string().trim().min(3, "SKU minimal 3 karakter.").max(60),
  priceOverride: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.coerce.number().int().positive("Harga varian harus lebih dari 0.").optional(),
  ),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif.").max(100000),
});

export type VariantInput = z.infer<typeof variantInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter.").max(60),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);

export const trackingNumberSchema = z
  .string()
  .trim()
  .max(60, "Nomor resi maksimal 60 karakter.");
