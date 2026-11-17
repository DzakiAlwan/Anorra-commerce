"use client";

import Link from "next/link";
import { useState } from "react";
import { readOrderRefs, type OrderRef } from "@/lib/order-history";
import { useIsClient } from "@/lib/use-is-client";

export function OrderHistoryList() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="space-y-3">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl border border-zinc-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return <OrderHistoryContent />;
}

function OrderHistoryContent() {
  const [refs] = useState<OrderRef[]>(readOrderRefs);

  if (refs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <p className="font-medium">Belum ada pesanan di browser ini</p>
        <p className="mt-1 text-sm text-zinc-600">
          Pesanan yang dibuat dari perangkat ini akan muncul di sini. Riwayat lintas perangkat
          butuh login (M4).
        </p>
        <Link
          href="/produk"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Mulai belanja
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {refs.map((ref) => (
        <li key={ref.orderNumber}>
          <Link
            href={`/pesanan/${ref.orderNumber}?token=${encodeURIComponent(ref.accessToken)}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
          >
            <span>
              <span className="block font-medium">{ref.orderNumber}</span>
              <span className="block text-sm text-zinc-500">
                Dibuat{" "}
                {new Date(ref.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </span>
            <span className="text-sm text-zinc-500">Lihat detail</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
