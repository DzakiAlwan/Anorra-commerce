# Konvensi Proyek

## Branch

- `main`: kode siap rilis, tidak di-commit langsung.
- `feature/ANR-001-slug`: fitur baru.
- `fix/ANR-032-slug`: perbaikan bug.
- `chore/slug`: konfigurasi, dependency, dokumen.
- `docs/slug`: perubahan dokumen saja.

Branch dibuat dari `main` yang terbaru dan dihapus setelah merge.

## Commit

Format: `tipe(scope): pesan singkat`

Tipe: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`.

Contoh: `feat(ANR-012): tambah filter ukuran pada katalog`

Aturan:

- Satu commit untuk satu perubahan logis.
- Pesan imperatif, bukan lampau.
- Tidak ada API key, token, atau data pribadi di commit.

## Issue & Label

- Judul issue mengikuti format: `[ANR-012] Tambah filter ukuran`.
- Label wajib: `p0` / `p1` / `p2` dan `milestone-m1` (dst).
- Label tambahan: `bug`, `feature`, `chore`, `blocked`, `needs-review`.

## Pull Request

- Satu PR untuk satu task WBS.
- Deskripsi menjelaskan apa, mengapa, dan cara menguji.
- Centang semua checklist di template PR.
- Minimal satu approval sebelum merge, atau self-review untuk proyek solo dengan catatan di PR.
- Squash merge ke `main`.

## Penamaan Kode

- Komponen: `PascalCase` (`ProductCard`).
- Hook/fungsi: `camelCase` (`useCart`).
- Tipe/interface: `PascalCase` (`ProductVariant`).
- File komponen: `kebab-case.tsx` (`product-card.tsx`).
- Konstanta: `UPPER_SNAKE_CASE`.
- Test: `nama-file.test.ts` atau `nama-file.e2e.ts`.

## Updates Manajemen

- Pindahkan kartu di `project/BOARD.md` saat status berubah.
- Update `project/STATUS.md` setiap akhir milestone atau ada blocker.
- Catat keputusan baru di `docs/adr/` dengan nomor urut.
