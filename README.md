# PanenLangsung

Aplikasi beta tertutup untuk **PanenLangsung**, platform B2B yang mencocokkan panen petani dengan kebutuhan katering dan restoran lewat pre-order. Empat peran berjalan di satu aplikasi: petani, katering, admin, dan kurir.

**Beta 0.9. Seluruh nama, harga, dan pesanan adalah data contoh fiktif.** Tidak ada autentikasi, pembayaran, atau panggilan jaringan keluar.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang dicetak Vite (biasanya `http://localhost:5173`).

Versi produksi:

```bash
npm run build
npm run preview
```

React + Vite dengan CSS biasa. Tanpa framework UI, tanpa pustaka grafik; grafik dashboard dibuat dari elemen HTML dan CSS.

## Halaman

- `#/` landing page: masalah, alur lima langkah, detail peran termasuk kurir, dampak, statistik kegagalan startup, tiga pilar.
- `#/app` aplikasi beta. Peran aktif tersimpan di localStorage; tab kembali ke tab awal peran saat halaman dimuat.

## Peran dan fitur

| Peran | Tab | Isi |
| --- | --- | --- |
| Petani | Panen saya, Katalog | Pasang panen dengan grade dan jendela panen, potensi pendapatan, sisa volume, harga pembanding |
| Katering | Katalog, Pre-order, Pesanan | Cari dan filter panen, pesan dalam batas sisa, lacak status, kurir, dan bukti terima |
| Admin | Dashboard, Verifikasi, Rute | Antrean berusia waktu, penolakan beralasan, penugasan dengan cek kapasitas, rute per hari, angka operasi |
| Kurir | Tugas, Rute | Empat langkah antar, bukti terima, laporan gagal, muatan dan urutan titik |

Pemilih peran ada di sidebar. Untuk peran kurir, pilih juga kurir aktif (Asep, Rina, atau Dadang).

## Peta fitur ke PRD

| PRD | Fitur | Berkas |
| --- | --- | --- |
| F-1 | Katalog: pencarian, filter grade, urutan, harga dan selisih terhitung | `src/views/Katalog.jsx` |
| F-2 | Pasang panen: validasi kolom, grade, jendela panen, potensi | `src/views/Panen.jsx` |
| F-3 | Pre-order: batas sisa, nilai, komisi, bagian petani, catatan | `src/views/PreOrder.jsx` |
| F-4 | Verifikasi dan penolakan beralasan | `src/views/Verifikasi.jsx` |
| F-5 | Penugasan kurir dengan pemeriksaan kapasitas | `src/views/Verifikasi.jsx` |
| F-6 | Empat langkah kurir, bukti terima, laporan gagal | `src/views/Kurir.jsx` |
| F-7 | Rute per tanggal dan kurir, muatan, urutan titik | `src/views/Rute.jsx` |
| F-8 | Dashboard: GMV, komisi, margin, isi panen, ketepatan waktu, limbah | `src/views/Dashboard.jsx` |
| F-9 | Landing page dengan angka berlabel sumber dan pratinjau interaktif | `src/Landing.jsx` |

## Data

- Kunci penyimpanan: `panenlangsung:v2`.
- Data awal: 8 baris panen, 12 pesanan, 3 kurir. Dua pengiriman aktif dan satu bukti terima sudah terisi agar dashboard langsung punya isi.
- Reset: **Pengaturan**, tekan **Reset data**, konfirmasi. Kembali ke data contoh awal.
- Ekspor: **Pengaturan**, tekan **Unduh data JSON**. Berkas diunduh dari peramban, tanpa server.
- Semua perubahan langsung ditulis ke localStorage dan dipulihkan saat halaman dimuat ulang.

Enam status pesanan: `menunggu_verifikasi`, `diverifikasi`, `berangkat`, `tiba`, `dibatalkan`, ditambah status panen `tersedia` dan `habis`. Lima tahap kurir disimpan terpisah: `ditugaskan`, `diambil`, `dalam_perjalanan`, `terkirim`, `gagal`.

## Struktur

```
src/
  data.js          data contoh, enum status, hitungan, format
  store.js         localStorage dan seluruh aksi
  App.jsx          shell, pemilih peran, tab, routing hash
  Landing.jsx      landing page
  ui.jsx           komponen bersama, ikon, status, garis waktu
  styles.css       seluruh gaya
  views/           sembilan tampilan aplikasi
```

Dokumen produk ada di `PRD-PanenLangsung.md` (versi 1.1, beta tertutup).

## Batasan

- Tanpa backend, login, pembayaran, notifikasi, atau peta.
- Angka di aplikasi berasal dari data contoh, bukan transaksi lapangan.
- Tidak ada keadaan memuat karena seluruh data lokal dan sinkron. Keadaan kosong dan galat validasi tersedia.
- Dirancang untuk puluhan pesanan, bukan ribuan.
