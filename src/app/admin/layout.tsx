import { requireAdmin } from "@/lib/session";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-gray-900">Anorra Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/produk" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Produk
              </Link>
              <Link href="/admin/pesanan" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Pesanan
              </Link>
              <form action={async () => {
                'use server'
                const { logoutAction } = await import('@/server/actions/auth')
                await logoutAction()
              }}>
                <button type="submit" className="text-sm font-medium text-red-500 hover:text-red-700">
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
