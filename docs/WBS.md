# Work Breakdown Structure (WBS)

Estimasi dalam jam. `S` = 2-4 jam, `M` = 1 hari, `L` = 2-3 hari.

## M0 - Fondasi

| ID      | Task                                            | Est | Dependensi | Selesai ketika                                          |
| ------- | ----------------------------------------------- | --- | ---------- | ------------------------------------------------------- |
| ANR-001 | Inisialisasi Next.js + TypeScript + Tailwind    | M   | -          | App kosong bisa dijalankan lokal                        |
| ANR-002 | Konfigurasi ESLint, Prettier, TypeScript strict | S   | ANR-001    | `lint` dan `typecheck` lolos                            |
| ANR-003 | Struktur folder dan alias import                | S   | ANR-001    | Folder sesuai `ARCHITECTURE.md`                         |
| ANR-004 | Prisma + PostgreSQL + migrasi awal              | M   | ANR-001    | `prisma migrate dev` sukses                             |
| ANR-005 | Env template dan validasi env                   | S   | ANR-001    | `.env.example` lengkap, app gagal jelas jika env kurang |
| ANR-006 | CI workflow aktif                               | S   | ANR-002    | PR menjalankan lint/typecheck/build                     |

## M1 - Katalog

| ID      | Task                                  | Est | Dependensi | Selesai ketika                    |
| ------- | ------------------------------------- | --- | ---------- | --------------------------------- |
| ANR-010 | Model data Product, Category, Variant | M   | ANR-004    | Migrasi dan relasi tersimpan      |
| ANR-011 | Seed kategori dan produk contoh       | S   | ANR-010    | Data dummy tampil di UI           |
| ANR-012 | Halaman daftar produk + filter        | L   | ANR-010    | Pencarian dan filter berfungsi    |
| ANR-013 | Halaman detail produk + pilih varian  | M   | ANR-012    | Ukuran/warna dipilih sebelum beli |
| ANR-014 | Upload gambar produk                  | M   | ANR-010    | Gambar tersimpan dan tampil       |

## M2 - Keranjang & Checkout

| ID      | Task                         | Est | Dependensi | Selesai ketika                      |
| ------- | ---------------------------- | --- | ---------- | ----------------------------------- |
| ANR-020 | Keranjang client-side        | M   | ANR-013    | Tambah/ubah/hapus bekerja           |
| ANR-021 | Form alamat pengiriman       | M   | ANR-020    | Validasi alamat lengkap             |
| ANR-022 | Integrasi ongkir             | L   | ANR-021    | Pilihan kurir dan biaya tampil      |
| ANR-023 | Halaman checkout & ringkasan | M   | ANR-022    | Ringkasan sesuai keranjang + ongkir |

## M3 - Pembayaran & Pesanan

| ID      | Task                         | Est | Dependensi | Selesai ketika                            |
| ------- | ---------------------------- | --- | ---------- | ----------------------------------------- |
| ANR-030 | Buat order dan order item    | L   | ANR-023    | Order tersimpan dengan status PENDING     |
| ANR-031 | Integrasi gateway pembayaran | L   | ANR-030    | Pembeli mendapat instruksi bayar          |
| ANR-032 | Webhook pembayaran idempoten | L   | ANR-031    | Status berubah sekali, stok tidak negatif |
| ANR-033 | Riwayat & detail pesanan     | M   | ANR-030    | Pembeli melihat status terbaru            |

## M4 - Panel Admin

| ID      | Task                        | Est | Dependensi       | Selesai ketika                          |
| ------- | --------------------------- | --- | ---------------- | --------------------------------------- |
| ANR-040 | Role & proteksi route admin | M   | ANR-001          | Non-admin ditolak                       |
| ANR-041 | CRUD produk & kategori      | L   | ANR-010, ANR-040 | Admin mengelola katalog                 |
| ANR-042 | Kelola stok per varian      | M   | ANR-041          | Stok bisa disesuaikan dan tercatat      |
| ANR-043 | Kelola pesanan              | M   | ANR-033          | Admin mengubah status pesanan           |
| ANR-044 | Dasbor ringkas              | S   | ANR-043          | Total order, omzet, stok menipis tampil |

## M5 - Rilis

| ID      | Task                       | Est | Dependensi | Selesai ketika                          |
| ------- | -------------------------- | --- | ---------- | --------------------------------------- |
| ANR-050 | Testing alur checkout      | L   | ANR-032    | Skenario sukses/gagal teruji            |
| ANR-051 | Optimasi gambar &SEO dasar | M   | ANR-014    | Lighthouse sesuai target                |
| ANR-052 | Monitoring error           | M   | ANR-001    | Error produksi tercatat                 |
| ANR-053 | Deploy produksi + rollback | M   | ANR-050    | Deploy sukses dan prosedur rollback ada |

## Prioritas

`P0` = wajib MVP, `P1` = penting setelah rilis, `P2` = eksperimen.
Semua task di atas `P0` kecuali ditandai lain di issue GitHub.
