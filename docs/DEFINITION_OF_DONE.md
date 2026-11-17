# Definition of Done

Sebuah task ditutup hanya jika semua poin berikut terpenuhi.

## Fungsional

- [ ] Kriteria "Selesai ketika" di `docs/WBS.md` terpenuhi.
- [ ] Skenario utama dan skenario gagal diuji manual.
- [ ] Tidak ada perubahan perilaku di luar scope task tanpa catatan.

## Kualitas

- [ ] `npm run lint` lolos.
- [ ] `npm run typecheck` lolos.
- [ ] `npm run build` lolos.
- [ ] Test relevan ditambahkan atau diperbarui.

## Keamanan & Data

- [ ] Input divalidasi di server.
- [ ] Tidak ada secret hard-coded.
- [ ] Migrasi database dibuat bila schema berubah.
- [ ] Query tidak menimbulkan N+1 yang jelas.

## Kolaborasi

- [ ] PR memiliki deskripsi dan langkah uji.
- [ ] Review selesai dan comment diselesaikan.
- [ ] Dokumentasi terkait diperbarui.
- [ ] Board dan status proyek diperbarui.
