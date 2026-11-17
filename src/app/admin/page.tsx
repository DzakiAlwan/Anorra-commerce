import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { formatMoney } from "@/lib/money";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const db = getDb();

  const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Pesanan" value={totalOrders.toString()} />
        <StatCard title="Total Pendapatan" value={formatMoney(totalRevenue._sum.total ?? 0)} />
        <StatCard title="Pesanan Pending" value={pendingOrders.toString()} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
      <p className="text-sm text-zinc-500 font-medium">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
