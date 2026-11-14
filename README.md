# PanenLangsung

Demo lokal untuk studi kasus **PanenLangsung**, platform B2B agritech yang mencocokkan panen petani dengan kebutuhan katering dan restoran lewat pre-order. Repo ini berisi landing page dan demo aplikasi tiga peran yang seluruhnya berjalan di peramban, tanpa backend.

**Ini simulasi. Seluruh nama, harga, dan pesanan adalah data dummy fiktif.** Tidak ada autentikasi, pembayaran, atau panggilan jaringan keluar.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang dicetak Vite (biasanya `http://127.0.0.1:5173`).

Versi produksi:

```bash
npm run build
npm run preview
```

Aplikasi memakai React + Vite dengan CSS biasa (tanpa framework UI, tanpa pustaka grafik). Grafik di landing page dibuat dari elemen HTML dan CSS.

## Halaman

- `#/` landing page: masalah, solusi, alur empat tahap, dampak, statistik kegagalan startup, tiga pilar.
- `#/demo` demo aplikasi: pemilih peran di setiap layar, tab sesuai peran, dan panel Pengaturan.

## Peta fitur ke PRD

| PRD | Fitur di aplikasi | Berkas utama |
| --- | --- | --- |
| F-1 | Katalog dengan harga platform, bagian petani setelah komisi 15%, harga tengkulak, dan selisih yang dihitung dari data | `src/views.jsx` (`Katalog`) |
| F-2 | Formulir pasang panen, validasi per kolom, panen baru langsung tampil di katalog katering | `src/views.jsx` (`PasangPanen`) |
| F-3 | Pre-order dengan batas sisa volume, total, komisi, bagian petani, perkiraan tiba satu hari setelah panen | `src/views.jsx` (`PreOrder`) |
| F-4 | Verifikasi sekali, penolakan mengembalikan volume, penetapan kurir dan jadwal, status tiba hanya setelah berangkat | `src/views.jsx` (`Verifikasi`) |
| F-5 | Rute kurir berurutan untuk pesanan yang berangkat di hari yang sama | `src/views.jsx` (`Rute`) |
| F-6 | Dashboard GMV, komisi 15%, margin petani dibanding tengkulak, sisa panen tak terpesan, dengan dasar perhitungan | `src/views.jsx` (`Dashboard`) |
| F-7 | Pemilih peran satu klik, tab per peran, data tidak hilang saat berganti peran, label simulasi | `src/App.jsx` |
| F-8 | Landing page dengan angka berlabel sumber, tanpa testimoni atau statistik karangan | `src/Landing.jsx` |

Status pesanan memakai enum tepat dari PRD: `menunggu_verifikasi`, `diverifikasi`, `berangkat`, `tiba`, `dibatalkan`. Status panen: `tersedia`, atau `habis` ketika seluruh volumenya sudah dipesan. Tidak ada status lain di luar daftar itu.

## Data dan reset

- Kunci penyimpanan: `localStorage` dengan nama `panenlangsung:v1`.
- Setiap perubahan langsung disimpan dan dipulihkan saat halaman dimuat ulang.
- Reset: buka **Pengaturan**, tekan **Reset data demo**, lalu konfirmasi. Data kembali ke enam komoditas contoh dengan nol pesanan.
- Data awal berisi enam komoditas dan belum ada pesanan. Tanggal panen dibuat relatif terhadap tanggal hari ini agar demo selalu terlihat berjalan.

## Catatan teknis

- Tanpa permintaan jaringan setelah halaman dimuat. Aset disajikan dari bundel lokal, tidak ada font atau gambar dari CDN.
- Tidak ada backend, API, autentikasi, pembayaran, atau layanan pihak ketiga.
- Tidak ada keadaan memuat karena seluruh data lokal dan sinkron. Keadaan kosong dan galat validasi tersedia di setiap layar yang menampilkan data.
- Alur petani dan katering diuji pada lebar 375 piksel tanpa gulir horizontal.
- Semua kontrol dapat dijangkau Tab dan diaktifkan dengan Enter atau Space, dengan indikator fokus yang terlihat.
- Label "Demo, data dummy" selalu terlihat di header demo, dan setiap panel data menyebut data simulasi.

## Struktur

```
src/
  data.js       data awal, enum status, format rupiah dan tanggal, hitungan
  store.js      penyimpanan localStorage dan seluruh aksi perubahan data
  App.jsx       shell demo, pemilih peran, tab, routing hash
  Landing.jsx   landing page
  views.jsx     tujuh tampilan demo
  styles.css    seluruh gaya, termasuk responsif dan fokus
```

Dokumen produk ada di `PRD-PanenLangsung.md` dan menjadi sumber kebenaran untuk angka serta perilaku di aplikasi ini.
