"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart, type CartItem } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/money";
import { saveOrderRef } from "@/lib/order-history";
import { SHIPPING_OPTIONS } from "@/lib/shipping";
import { useIsClient } from "@/lib/use-is-client";
import {
  addressInputSchema,
  emailInputSchema,
  type AddressInput,
} from "@/lib/validation";
import { createOrderAction } from "@/server/actions/orders";

type AddressField = keyof AddressInput;
type FieldErrors = Partial<Record<AddressField, string>>;

const ADDRESS_STORAGE_KEY = "anorra-address-v1";
const EMAIL_STORAGE_KEY = "anorra-email-v1";

const EMPTY_ADDRESS: AddressInput = {
  recipient: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  province: "",
  postalCode: "",
};

function loadAddress(): AddressInput {
  try {
    const raw = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!raw) return EMPTY_ADDRESS;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_ADDRESS;

    const next = { ...EMPTY_ADDRESS };

    for (const key of Object.keys(EMPTY_ADDRESS) as AddressField[]) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string") {
        next[key] = value;
      }
    }

    return next;
  } catch {
    return EMPTY_ADDRESS;
  }
}

function loadEmail(): string {
  try {
    return window.localStorage.getItem(EMAIL_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function CheckoutView() {
  const isClient = useIsClient();
  const { items, itemCount, subtotal } = useCart();

  if (!isClient) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <p className="font-medium">Keranjang masih kosong</p>
        <p className="mt-1 text-sm text-zinc-600">
          Tambahkan produk dulu sebelum melanjutkan ke checkout.
        </p>
        <Link
          href="/produk"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Lihat katalog
        </Link>
      </div>
    );
  }

  return <CheckoutForm items={items} itemCount={itemCount} subtotal={subtotal} />;
}

type CheckoutFormProps = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
};

function CheckoutForm({ items, itemCount, subtotal }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [form, setForm] = useState<AddressInput>(loadAddress);
  const [email, setEmail] = useState(loadEmail);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [emailError, setEmailError] = useState<string | undefined>();
  const [shippingId, setShippingId] = useState(SHIPPING_OPTIONS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedShipping =
    SHIPPING_OPTIONS.find((option) => option.id === shippingId) ?? SHIPPING_OPTIONS[0];
  const total = subtotal + selectedShipping.cost;

  function setField(field: AddressField, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const parsedAddress = addressInputSchema.safeParse(form);
    const parsedEmail = emailInputSchema.safeParse(email);

    if (!parsedAddress.success || !parsedEmail.success) {
      const nextErrors: FieldErrors = {};

      if (!parsedAddress.success) {
        for (const issue of parsedAddress.error.issues) {
          const field = issue.path[0];
          if (typeof field === "string" && nextErrors[field as AddressField] === undefined) {
            nextErrors[field as AddressField] = issue.message;
          }
        }
      }

      setErrors(nextErrors);
      setEmailError(parsedEmail.success ? undefined : parsedEmail.error.issues[0]?.message);
      return;
    }

    setErrors({});
    setEmailError(undefined);

    const payload = new FormData();
    payload.set("email", parsedEmail.data);
    payload.set("shippingId", shippingId);
    payload.set("recipient", parsedAddress.data.recipient);
    payload.set("phone", parsedAddress.data.phone);
    payload.set("line1", parsedAddress.data.line1);
    payload.set("line2", parsedAddress.data.line2 ?? "");
    payload.set("city", parsedAddress.data.city);
    payload.set("province", parsedAddress.data.province);
    payload.set("postalCode", parsedAddress.data.postalCode);
    payload.set(
      "items",
      JSON.stringify(items.map((item) => ({ variantId: item.variantId, quantity: item.quantity }))),
    );

    setSubmitting(true);

    try {
      const result = await createOrderAction(payload);

      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }

      window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(parsedAddress.data));
      window.localStorage.setItem(EMAIL_STORAGE_KEY, parsedEmail.data);
      saveOrderRef({
        orderNumber: result.orderNumber,
        accessToken: result.accessToken,
        createdAt: new Date().toISOString(),
      });
      clearCart();

      router.push(`/pesanan/${result.orderNumber}?token=${encodeURIComponent(result.accessToken)}`);
    } catch {
      setSubmitError("Gagal menghubungi server. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]" noValidate>
      <div className="space-y-6">
        {submitError ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-medium">Kontak & alamat pengiriman</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email (untuk pesanan tamu)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                placeholder="nama@email.com"
                aria-invalid={emailError ? true : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError(undefined);
                  setSubmitError(null);
                }}
                className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${
                  emailError
                    ? "border-red-400 focus:border-red-500"
                    : "border-zinc-300 focus:border-zinc-900"
                }`}
              />
              {emailError ? <p className="text-xs text-red-600">{emailError}</p> : null}
            </div>

            <Field
              id="recipient"
              label="Nama penerima"
              value={form.recipient}
              error={errors.recipient}
              placeholder="Nama lengkap"
              onChange={setField}
            />
            <Field
              id="phone"
              label="Nomor telepon"
              value={form.phone}
              error={errors.phone}
              placeholder="08xxxxxxxxxx"
              onChange={setField}
            />
            <Field
              id="line1"
              label="Alamat lengkap"
              value={form.line1}
              error={errors.line1}
              placeholder="Jalan, nomor rumah, RT/RW"
              onChange={setField}
              className="sm:col-span-2"
            />
            <Field
              id="line2"
              label="Detail tambahan (opsional)"
              value={form.line2 ?? ""}
              error={errors.line2}
              placeholder="Patokan, lantai, atau catatan kurir"
              onChange={setField}
              className="sm:col-span-2"
            />
            <Field
              id="city"
              label="Kota / Kabupaten"
              value={form.city}
              error={errors.city}
              placeholder="Contoh: Bandung"
              onChange={setField}
            />
            <Field
              id="province"
              label="Provinsi"
              value={form.province}
              error={errors.province}
              placeholder="Contoh: Jawa Barat"
              onChange={setField}
            />
            <Field
              id="postalCode"
              label="Kode pos"
              value={form.postalCode}
              error={errors.postalCode}
              placeholder="40123"
              onChange={setField}
            />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-medium">Ongkos kirim</h2>
          <p className="text-sm text-zinc-500">Tarif contoh (mock). Integrasi RajaOngkir menyusul.</p>

          <div className="space-y-2">
            {SHIPPING_OPTIONS.map((option) => {
              const active = shippingId === option.id;

              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-colors ${
                    active ? "border-zinc-900 bg-zinc-50" : "border-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={active}
                      onChange={() => {
                        setShippingId(option.id);
                        setSubmitError(null);
                      }}
                      className="h-4 w-4"
                    />
                    <span>
                      <span className="block font-medium">
                        {option.courier} {option.service}
                      </span>
                      <span className="block text-zinc-500">Estimasi {option.eta}</span>
                    </span>
                  </span>
                  <span className="font-medium">{formatRupiah(option.cost)}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-6">
        <h2 className="font-medium">Ringkasan pesanan</h2>

        <ul className="space-y-3 border-b border-zinc-200 pb-4 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-3">
              <span>
                <span className="block font-medium">{item.name}</span>
                <span className="block text-zinc-500">
                  {item.size} · {item.color} · {item.quantity}x
                </span>
              </span>
              <span className="shrink-0">{formatRupiah(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Jumlah item</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Subtotal</dt>
            <dd>{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">
              Ongkir ({selectedShipping.courier} {selectedShipping.service})
            </dt>
            <dd>{formatRupiah(selectedShipping.cost)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatRupiah(total)}</dd>
          </div>
        </dl>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Membuat pesanan..." : "Buat pesanan"}
        </Button>

        <p className="text-xs text-zinc-500">
          Dengan membuat pesanan, kamu setuju harga dan stok dicek ulang di server. Stok baru
          dikurangi setelah pembayaran terkonfirmasi.
        </p>

        <Link href="/keranjang" className="block text-center text-sm text-zinc-500 underline">
          Kembali ke keranjang
        </Link>
      </aside>
    </form>
  );
}

type FieldProps = {
  id: AddressField;
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (field: AddressField, value: string) => void;
};

function Field({ id, label, value, placeholder, error, className = "", onChange }: FieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(id, event.target.value)}
        className={`h-10 w-full rounded-lg border px-3 text-sm outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-zinc-300 focus:border-zinc-900"
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
        <div className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
    </div>
  );
}
