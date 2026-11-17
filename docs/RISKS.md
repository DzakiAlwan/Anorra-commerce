# Risiko & Mitigasi

| Risiko                              | Probabilitas | Dampak | Mitigasi                                                           |
| ----------------------------------- | ------------ | ------ | ------------------------------------------------------------------ |
| Akun payment gateway lama disetujui | Tinggi       | Tinggi | Siapkan mode sandbox dan fallback transfer/COD sejak M2            |
| API ongkir berubah atau limit       | Sedang       | Sedang | Cache ongkir, batas retry, pesan error yang jelas                  |
| Stok dobel saat webhook bersamaan   | Sedang       | Tinggi | Webhook idempoten + transaksi DB + unique externalId               |
| Gambar produk berat                 | Tinggi       | Sedang | Upload ke CDN, kompresi, lazy loading                              |
| Scope berkembang terus              | Tinggi       | Sedang | Semua perubahan masuk ADR/meeting dan ditimbang terhadap milestone |
| Waktu terbagi dengan pekerjaan lain | Sedang       | Tinggi | Task dipecah ke ukuran maksimal 1 hari di board                    |
| Kehilangan akses env produksi       | Rendah       | Tinggi | Simpan di password manager tim, rotasi berkala                     |
| Data produk awal belum siap         | Sedang       | Sedang | Seed dummy agar UI tetap bisa diuji                                |

## Tindakan Pencegahan Rutin

- Tinjau risiko ini setiap awal milestone.
- Tandai issue dengan `blocked` bila risiko benar-benar menghentikan pekerjaan.
- Catat keputusan mitigasi di `docs/adr/`.
