# Product Requirements Document (PRD)

## Masalah

Proses jual baju masih tersebar di katalog manual dan chat, sehingga stok, pesanan, dan pembayaran sulit dipantau.

## Pengguna

- Pembeli: lihat katalog, filter ukuran/warna, keranjang, checkout, cek pesanan.
- Admin: kelola produk, varian, stok, kategori, dan pesanan.
- Owner: lihat ringkasan penjualan.

## Tujuan MVP

- Transaksi baju bisa selesai dari browser hingga pembayaran.
- Stok terjadi pembaruan otomatis setelah pembayaran valid.
- Admin mengelola katalog tanpa mengubah kode.
- Kode siap dikembangkan dan memiliki pemeriksaan otomatis.

## Bukan MVP

Aplikasi native, rekomendasi ML, multi-gudang, live chat, program loyalitas kompleks.

## Fitur P0

- F-01 Autentikasi: register, login, logout, reset password.
- F-02 Katalog: daftar, detail, pencarian, filter kategori/ukuran/warna.
- F-03 Varian: ukuran, warna, harga, stok per varian, gambar.
- F-04 Keranjang: tambah, ubah jumlah, hapus, subtotal.
- F-05 Checkout: alamat, kurir, ringkasan biaya.
- F-06 Pembayaran: gateway dengan webhook.
- F-07 Pesanan: riwayat dan status untuk pembeli.
- F-08 Admin: CRUD produk, kategori, stok, pesanan.
- F-09 Upload gambar produk.

## Fitur Lanjutan

- P1: ulasan, wishlist, kupon sederhana.
- P2: notifikasi WhatsApp/email, dashboard analitik.

## Kriteria Keberhasilan

- Pembeli baru bisa menyelesaikan checkout tanpa bantuan.
- Admin bisa menambah produk dan melihat pesanan dalam satu panel.
- Webhook pembayaran tidak menyebabkan stok negatif.
- Semua PR lolos CI sebelum merge.
