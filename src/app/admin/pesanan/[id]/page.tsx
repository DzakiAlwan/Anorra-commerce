import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/money";
import { updateOrderStatusAction } from "@/server/actions/orders";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const db = getDb();

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: true,
      payment: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pesanan {order.orderNumber}</h1>
          <p className="text-zinc-600">Dipesan pada {new Date(order.createdAt).toLocaleString("id-ID")}</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 font-medium">Item Pesanan</div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{item.nameSnapshot}</div>
                      <div className="text-zinc-500 text-xs">{item.variantSnapshot}</div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}x</td>
                    <td className="px-6 py-4 text-right">{formatMoney(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-50 border-t border-zinc-200">
                <tr>
                  <td colSpan={2} className="px-6 py-2 text-right text-zinc-500">Subtotal</td>
                  <td className="px-6 py-2 text-right">{formatMoney(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-6 py-2 text-right text-zinc-500">Ongkir</td>
                  <td className="px-6 py-2 text-right">{formatMoney(order.shippingCost)}</td>
                </tr>
                <tr className="font-bold text-base">
                  <td colSpan={2} className="px-6 py-4 text-right">Total</td>
                  <td className="px-6 py-4 text-right">{formatMoney(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h2 className="font-medium border-b pb-2">Informasi Pelanggan</h2>
            <div>
              <p className="text-xs text-zinc-500 uppercase">Nama</p>
              <p className="font-medium">{order.user.name ?? "Tamu"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase">Email</p>
              <p>{order.user.email}</p>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
            <h2 className="font-medium border-b pb-2">Alamat Pengiriman</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.address.recipient}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  // Ponytail: Direct server action on change for speed.
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-500 whitespace-nowrap">Status:</span>
      <form action={async (formData) => {
        "use server";
        const status = formData.get("status") as string;
        await updateOrderStatusAction(orderId, status);
      }}>
        <select 
          name="status"
          defaultValue={currentStatus}
          onChange={(e) => e.target.form?.requestSubmit()}
          className="rounded border border-zinc-300 text-sm px-3 py-1 bg-white"
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </form>
    </div>
  );
}
