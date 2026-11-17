# Status Proyek

| Field            | Nilai                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| Fase saat ini    | M3 - Pembayaran & Pesanan                                               |
| Update terakhir  | ANR-030 s/d ANR-033 selesai (order, pembayaran mock, idempoten, riwayat) |
| Branch utama     | `main`                                                                  |
| Commit           | Belum ada                                                               |
| Blocker          | Gateway asli (Midtrans/Xendit) butuh API key; auth baru di M4           |
| Verifikasi lokal | lint, typecheck, build, page utama 200, order + stok + idempotensi lolos |

## Progres Milestone

- M0 - Fondasi: 0/6 di-merge, 6/6 implementasi lokal siap review
- M1 - Katalog: 0/5 di-merge, 5/5 implementasi lokal (schema, seed, ANR-012, ANR-013, ANR-014)
- M2 - Keranjang & Checkout: 0/4 di-merge, 4/4 implementasi lokal (cart, alamat, ongkir mock, ringkasan)
- M3 - Pembayaran & Pesanan: 0/4 di-merge, 4/4 implementasi lokal (order, bayar mock, idempoten, riwayat)
- M4 - Panel Admin: 0/5 task selesai
- M5 - Rilis: 0/4 task selesai

## Yang Sudah Dibuat

- Next.js 16 App Router, TypeScript strict, Tailwind 4, ESLint 9, Prettier.
- Prisma 7 dengan adapter PostgreSQL, schema lengkap, dan client ter-generate.
- Supabase (Postgres) terhubung lewat session pooler; migrasi `20261117000000_init` sudah di-baseline.
- Halaman awal toko, katalog `/produk` (pencarian + filter kategori), detail `/produk/[slug]` (pilih warna/ukuran, harga & stok per varian), endpoint `GET /api/health`, seed produk contoh.
- Supabase Storage bucket `product-images` (publik, maks 5 MB) + halaman admin `/admin/produk` untuk unggah gambar (khusus development); upload + tampil terverifikasi.
- Keranjang client-side `/keranjang` (localStorage, badge jumlah di header) dan checkout `/checkout` (validasi alamat, ongkir mock, ringkasan total).
- Checkout tamu membuat order nyata di DB (status PENDING, harga & stok dicek server), pembayaran mock dengan instruksi VA + tombol simulasi; settlement idempoten mengurangi stok sekali.
- Riwayat `/pesanan` (tersimpan di browser) dan detail `/pesanan/[orderNumber]?token=...` dengan status, item, alamat, pengiriman, dan total.
- Migrasi `20261117120000_add_order_access_token` (token akses pesanan tamu).
- CI workflow, template issue/PR, dan board manajemen.

## 3 Aksi Berikutnya

1. Coba alur: tambah ke keranjang -> checkout -> buat pesanan -> simulasi bayar -> cek stok di `/produk`.
2. Commit per task lalu push untuk cek CI.
3. Lanjut M4 auth + panel admin (ANR-040), lalu ganti pembayaran mock dengan gateway asli.

## Cara Update

Ubah file ini setiap akhir milestone atau saat ada blocker. Cantumkan bukti berupa link PR/commit bila tersedia.
