# Project Board

Board berbasis markdown ini menjadi sumber alur kerja. Jika memakai GitHub Projects, buat field `Status` dengan nilai yang sama dan jaga sinkronisasi.

## Aturan

- WIP limit: `In Progress` maksimal 2 kartu.
- Kartu pindah ke `Review` hanya jika Definition of Done terpenuhi.
- Kartu di `Done` harus sudah di-merge ke `main`.
- Kartu baru wajib punya ID WBS atau diajukan sebagai issue dulu.

## Backlog

- ANR-051 Optimasi gambar & SEO dasar
- ANR-052 Monitoring error
- ANR-053 Deploy produksi + rollback

## To Do

- Belum ada. Database Supabase sudah terhubung; lanjut review M1.

## In Progress

- Belum ada

## Review

- ANR-012 Halaman daftar produk + filter — `/produk` dengan pencarian + filter kategori, data dari Supabase
- ANR-013 Halaman detail produk + pilih varian — `/produk/[slug]`, pilih warna/ukuran, harga & stok per varian
- ANR-014 Upload gambar produk — Supabase Storage, halaman `/admin/produk`, upload + tampil terverifikasi
- ANR-020 Keranjang client-side — `/keranjang`, tambah/ubah/hapus, tersimpan di localStorage
- ANR-021 Form alamat pengiriman — `/checkout`, validasi zod + alamat tersimpan
- ANR-022 Integrasi ongkir — pilihan kurir & biaya (tarif mock, RajaOngkir menyusul)
- ANR-023 Halaman checkout & ringkasan — ringkasan item + ongkir + total
- ANR-030 Buat order & order item — order tersimpan PENDING, harga/stok divalidasi server
- ANR-031 Gateway pembayaran — mock VA + instruksi bayar (Midtrans/Xendit butuh API key)
- ANR-032 Settlement pembayaran idempoten — status PAID sekali, stok tidak negatif (teruji)
- ANR-033 Riwayat & detail pesanan — `/pesanan` + `/pesanan/[orderNumber]?token=...`
- ANR-001 Inisialisasi Next.js + TypeScript + Tailwind — siap commit
- ANR-002 Konfigurasi ESLint, Prettier, TypeScript strict — lint/typecheck/format lolos
- ANR-003 Struktur folder dan alias import — struktur dibuat
- ANR-004 Prisma + PostgreSQL + migrasi awal — schema valid, generate sukses; migrasi menunggu DB
- ANR-005 Env template dan validasi env — `.env.example` dan `getEnv()` siap
- ANR-006 CI workflow aktif — file siap, aktif setelah push ke GitHub

## Done

- Belum ada. Belum ada commit/merge ke `main`.

## Legend

`P0` wajib MVP · `P1` setelah rilis · `P2` eksperimen · `blocked` menunggu pihak eksternal.
