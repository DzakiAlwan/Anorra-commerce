import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { listCatalogCategories } from "@/server/queries/catalog";
import { upsertProductAction } from "@/server/actions/products";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  await requireAdmin();
  const db = getDb();
  
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { slug: params.slug },
    }),
    listCatalogCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Produk</h1>
        <a href={`/admin/produk/${product.slug}/gambar`} className="text-sm text-blue-600 hover:underline">Kelola Gambar</a>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}

function ProductForm({ categories, product }: { categories: { id: string, name: string }[], product?: { id: string, name: string, categoryId: string, price: number, status: string, description: string | null } }) {
  return (
    <form action={upsertProductAction.bind(null, product?.id ?? null)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Nama Produk</label>
        <input name="name" defaultValue={product?.name} required className="mt-1 block w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Kategori</label>
        <select name="categoryId" defaultValue={product?.categoryId} required className="mt-1 block w-full border rounded px-3 py-2">
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Harga</label>
        <input name="price" type="number" defaultValue={product?.price} required className="mt-1 block w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select name="status" defaultValue={product?.status ?? "DRAFT"} className="mt-1 block w-full border rounded px-3 py-2">
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Aktif</option>
          <option value="ARCHIVED">Arsip</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Deskripsi</label>
        <textarea name="description" defaultValue={product?.description} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
      </div>
      <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
        Simpan Perubahan
      </button>
    </form>
  );
}
