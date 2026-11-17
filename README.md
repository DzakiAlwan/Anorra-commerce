# Anorra Commerce

Manajemen proyek untuk website e-commerce penjualan baju.

## Ringkasan

| Item            | Nilai                                                                            |
| --------------- | -------------------------------------------------------------------------------- |
| Nama proyek     | Anorra Commerce                                                                  |
| Tujuan          | TokoOnline baju dengan katalog, keranjang, checkout, pembayaran, dan panel admin |
| Branch utama    | `main`                                                                           |
| Remote          | `https://github.com/DzakiAlwan/Anorra-commerce.git`                              |
| Bahasa dokumen  | Indonesia                                                                        |
| Status saat ini | Phase 0 - Fondasi (implementasi lokal siap review)                               |

## Peta Dokumen

| File                         | Fungsi                                              |
| ---------------------------- | --------------------------------------------------- |
| `docs/PRD.md`                | Requirement produk dan batasan MVP                  |
| `docs/ROADMAP.md`            | Milestone dan kriteria keluar tiap fase             |
| `docs/WBS.md`                | Daftar task, estimasi, dependensi, kriteria selesai |
| `docs/ARCHITECTURE.md`       | Stack, struktur folder, model data, integrasi       |
| `docs/CONVENTIONS.md`        | Aturan branch, commit, PR, dan naming               |
| `docs/DEFINITION_OF_DONE.md` | Checklist wajib sebelum task ditutup                |
| `docs/RISKS.md`              | Risiko dan mitigasi                                 |
| `docs/adr/`                  | Arsitektur Decision Records                         |
| `docs/meetings/`             | Catatan pertemuan                                   |
| `project/BOARD.md`           | Papan Kanban dan aturan alur kerja                  |
| `project/STATUS.md`          | Ringkasan progres terkini                           |

## Alur Kerja Singkat

1. Baca `docs/PRD.md` dan `docs/ROADMAP.md`.
2. Pilih task di `project/BOARD.md` atau buat issue baru dari template.
3. Buat branch dari `main`: `feature/ANR-001-slug-singkat`.
4. Kerjakan task, lalu buat PR ke `main` dengan template.
5. Pastikan `Definition of Done` terpenuhi sebelum merge.
6. Update `project/BOARD.md` dan `project/STATUS.md`.

## Menjalankan Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:3000`. Endpoint pemeriksaan: `http://localhost:3000/api/health`.

Sebelum memakai database, siapkan PostgreSQL lalu jalankan:

```bash
npm run db:migrate
npm run db:seed
```

Pemeriksaan yang tersedia:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

## Catatan

Workflow CI di `.github/workflows/ci.yml` aktif setelah perubahan di-push ke GitHub.
