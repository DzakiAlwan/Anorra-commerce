# Arsitektur & Stack

## Keputusan Stack

| Lapisan   | Pilihan                          | Catatan                             |
| --------- | -------------------------------- | ----------------------------------- |
| Framework | Next.js App Router + TypeScript  | Full-stack, cocok untuk SEO katalog |
| UI        | Tailwind CSS + komponen lokal    | Tanpa UI library besar di awal      |
| Database  | PostgreSQL                       | Relasi produk-varian-order jelas    |
| ORM       | Prisma                           | Migrasi dan typed client            |
| Auth      | NextAuth atau session cookie     | Sesuaikan ADR jika diubah           |
| Payment   | Midtrans / Xendit                | Pilih satu saat integrasi           |
| Ongkir    | RajaOngkir atau penyedia sejenis | Cache hasil ongkir                  |
| Upload    | Cloudinary / S3-compatible       | Jangan simpan gambar di repo        |
| Deploy    | Vercel + DB managed              | Environment preview per PR          |

## Struktur Folder Rencana

```
src/
  app/                 # route App Router
    (shop)/            # halaman pembeli
    admin/             # halaman admin
    api/               # route handler & webhook
  components/
    ui/                # primitive button, input, card
    product/           # product card, variant picker
    cart/
    checkout/
    admin/
  lib/
    db.ts              # Prisma client
    auth.ts
    money.ts
    validation.ts      # schema zod
  server/
    services/          # logika bisnis
    queries/           # akses data
  types/
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  e2e/
  unit/
```

## Model Data Inti

- `User` -> `Order`, `Address`
- `Category` -> `Product`
- `Product` -> `Variant`, `Image`
- `Variant` -> `OrderItem`, stok per varian
- `Order` -> `OrderItem`, `Payment`, `Shipment`
- `Payment` menyimpan `provider`, `externalId`, `status`
- `Shipment` menyimpan `courier`, `trackingNumber`, `cost`

## Aturan Integrasi

- Semua webhook harus terverifikasi signature dan idempoten.
- Perubahan stok terjadi di satu transaksi database bersama perubahan status order.
- Nominal uang disimpan sebagai integer sen/rupiah, bukan float.
- Env sensitif hanya di server; tidak boleh masuk `NEXT_PUBLIC_*`.

## Non-Fungsional

- Target Lighthouse performa >= 85 untuk halaman katalog.
- Halaman katalog server-rendered agar bisa di-index.
- Error terpusat dengan request id untuk memudahkan debugging.
