# Roadmap

Estimasi menggunakan minggu kerja relatif, bukan tanggal tetap.

| Milestone                 | Fokus             | Deliverable                                                          | Kriteria Keluar                                                |
| ------------------------- | ----------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| M0 - Fondasi              | Setup proyek      | Repo, stack, CI, lint,Env contoh, struktur folder                    | `npm run lint`, `npm run typecheck`, `npm run build` lolos     |
| M1 - Katalog              | Produk & varian   | Entity Product/Category/Variant, list, detail, filter, upload gambar | Admin bisa tambah produk; pembeli bisa filter dan lihat detail |
| M2 - Keranjang & Checkout | Transaksi         | Cart, alamat, ongkir, checkout                                       | Subtotal dan ongkir sesuai, pesanan terbentuk                  |
| M3 - Pembayaran & Pesanan | Operasional       | Gateway, webhook, status pesanan, riwayat                            | Webhook valid mengubah status dan stok sekali saja             |
| M4 - Panel Admin          | Manajemen         | CRUD produk, stok, pesanan, dasbor ringkas                           | Admin menyelesaikan alur kelola tanpa bantuan developer        |
| M5 - Rilis                | Kualitas & launch | Testing, performa, SEO dasar, monitoring, deploy                     | Smoke test produksi lolos dan rollback siap                    |

## Aturan Milestone

- Task tidak boleh masuk milestone berikutnya jika kriteria keluar belum terpenuhi.
- Perubahan scope masuk ke `docs/adr/` atau catatan meeting, bukan diam-diam.
- Setiap milestone ditutup dengan update `project/STATUS.md`.
