# ADR-0001: Pemilihan Stack Awal

- Status: Diterima
- Tanggal: Phase 0
- Pengambil keputusan: Pemilik proyek

## Konteks

Proyek baru e-commerce baju membutuhkan fondasi yang cepat dibangun, ramah SEO, dan mudah dikembangkan satu developer.

## Keputusan

Gunakan Next.js App Router + TypeScript, Tailwind CSS, PostgreSQL, dan Prisma. Payment dan ongkir dipilih saat fase integrasi.

## Alternatif

- Laravel + Blade: matang, tapi pemisahan frontend dan API lebih banyak boilerplate untuk kebutuhan ini.
- React SPA + API terpisah: lebih fleksibel, tapi SEO katalog butuh penanganan tambahan.
- Shopify: cepat, tapi kustomisasi dan kepemilikan data lebih terbatas.

## Konsekuensi

- Positif: satu codebase untuk UI dan API, typing end-to-end, deploy sederhana.
- Negatif: terikat pada ekosistem Next.js; perubahan besar perlu ADR baru.
- Follow-up: evaluasi setelah M3 apakah perlu message queue untuk webhook.
