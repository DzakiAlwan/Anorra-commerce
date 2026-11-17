export type OrderRef = {
  orderNumber: string;
  accessToken: string;
  createdAt: string;
};

const STORAGE_KEY = "anorra-orders-v1";
const MAX_ENTRIES = 25;

function isOrderRef(value: unknown): value is OrderRef {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.orderNumber === "string" &&
    typeof record.accessToken === "string" &&
    typeof record.createdAt === "string"
  );
}

export function readOrderRefs(): OrderRef[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isOrderRef);
  } catch {
    return [];
  }
}

export function saveOrderRef(ref: OrderRef) {
  if (typeof window === "undefined") return;

  try {
    const next = [ref, ...readOrderRefs().filter((entry) => entry.orderNumber !== ref.orderNumber)];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_ENTRIES)));
  } catch {
    // Riwayat lokal opsional; kegagalan storage tidak menghalangi pesanan.
  }
}
