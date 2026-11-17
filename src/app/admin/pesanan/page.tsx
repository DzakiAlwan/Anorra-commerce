import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { formatMoney } from "@/lib/money";
import Link from "next/link";


export default async function AdminOrdersPage() {
  await requireAdmin();
  const db = getDb();
  
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Pesanan</h1>
        <p className="text-zinc-600">Pantau dan kelola pesanan masuk.</p>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 font-medium">No. Pesanan</th>
              <th className="px-6 py-3 font-medium">Pelanggan</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Tanggal</th>
              <th className="px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4 font-mono">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{order.user.name ?? "Tamu"}</div>
                  <div className="text-zinc-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{formatMoney(order.total)}</td>
                <td className="px-6 py-4 text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/pesanan/${order.id}`} className="text-blue-600 hover:underline">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PAID": return "bg-green-100 text-green-700";
    case "PENDING": return "bg-yellow-100 text-yellow-700";
    case "CANCELLED": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
}
