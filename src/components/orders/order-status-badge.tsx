const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Menunggu pembayaran", className: "bg-amber-100 text-amber-800" },
  PAID: { label: "Lunas", className: "bg-emerald-100 text-emerald-800" },
  PROCESSING: { label: "Diproses", className: "bg-sky-100 text-sky-800" },
  SHIPPED: { label: "Dikirim", className: "bg-indigo-100 text-indigo-800" },
  COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Dibatalkan", className: "bg-zinc-200 text-zinc-700" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, className: "bg-zinc-100 text-zinc-700" };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
