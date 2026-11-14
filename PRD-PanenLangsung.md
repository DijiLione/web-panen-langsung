# PRD PanenLangsung

**Produk:** PanenLangsung, platform B2B agritech  
**Asal:** studi kasus Kewirausahaan Digital, Kelompok 1  
**Versi:** 1.0, November 2026  
**Sifat:** rencana landing page dan demo aplikasi, seluruh data dummy.

---

## 1. Ringkasan Produk dan Visi

PanenLangsung mencocokkan panen petani dengan kebutuhan katering dan restoran kota lewat data matching dan pre-order panen, sehingga sayur dipetik sesuai pesanan. Visinya: mengganti tiga sampai empat lapis tengkulak dengan data permintaan yang dipercaya kedua sisi. Kalau petani tahu apa yang dibeli besok pagi, ia memanen tepat jumlah, mengirim hari itu juga, dan menjual tanpa dipotong banyak tangan.

Bukan rencana produk produksi, melainkan landing page plus demo React lokal berisi data dummy yang harus dipahami dalam lima menit.

## 2. Latar Belakang dan Masalah

Rantai pasok sayur terfragmentasi. Empat masalah menjelaskan biayanya.

**Tiga sampai empat lapis tengkulak.** Setiap lapis menambah biaya dan waktu: petani ditekan, restoran dibebani, dan selisihnya ongkos perpindahan barang.

**Petani buta harga pasar.** Tanpa data pembanding, petani menerima harga pengepul apa adanya. Masalahnya bukan kelangkaan informasi, melainkan ketiadaan alat membacanya.

**Sekitar 30% panen rusak di perjalanan.** Sayur dipanen tanpa tahu berapa yang dipesan; kelebihannya layu dan terbuang padahal biayanya sudah keluar sejak benih ditanam.

**Tiga sampai empat hari dari panen ke dapur.** Setiap hari dalam rantai itu adalah hari kesegaran yang hilang.

Riset CB Insights mencatat 42% startup gagal karena tidak ada kebutuhan pasar, 29% kehabisan modal, 23% tim buruk, 6% faktor lain, dan angka terbesar bukan soal teknologi. Urutan kerja mengikuti tiga pilar: obsesi pada solusi, validasi berlapis, dan iterasi lincah dengan MVP semurah mungkin. Validasi awal: wawancara 30 ketua kelompok tani dan 15 pengelola katering, MVP tanpa koding memakai WhatsApp Business dan Google Sheets, serta akuisisi 10 restoran pertama lewat free-shipping.

## 3. Tujuan Produk dan Metrik Keberhasilan

Metrik bisnis adalah target lapangan, bukan klaim demo. Metrik produk adalah yang benar-benar diukur di demo lokal.

**Metrik bisnis (target, bukan hasil).** Take-rate 15% dari nilai transaksi selesai; margin bersih petani naik 20%; susut panen dari sekitar 30% menuju mendekati 0%; waktu distribusi 1 hari, dari 3 sampai 4 hari.

**Metrik produk (diinstrumentasi di demo).** Penyelesaian pre-order: persentase pesanan yang mencapai status tiba, bukan batal. Waktu status pengiriman: jarak antara verifikasi admin dan status berangkat. Kelengkapan katalog: persentase panen yang dipasang lengkap dengan komoditas, volume, harga, dan tanggal panen.

Demo tidak membuktikan take-rate, margin, atau pengurangan limbah.

## 4. Persona dan Peran

**Petani (ketua kelompok tani).** Menjual panen beberapa anggota. Nyerinya: tidak tahu harga pasar, panen berdasarkan perkiraan, uang cair belakangan. Butuhnya: harga pembanding, pesanan pasti sebelum memetik, kejelasan kapan dibayar. Ponselnya bersinyal pas-pasan, dan ia tidak punya waktu mempelajari antarmuka berlapis.

**Katering dan restoran.** Membeli volume harian dengan menu berubah. Nyerinya: pasokan tidak konsisten, kualitas turun tanpa peringatan, harga berubah di tengah minggu. Butuhnya: kepastian volume, standar kualitas yang disepakati di depan, jadwal kirim. Ia memutuskan pembelian tiap sore untuk kebutuhan besok.

**Admin operasi.** Menjembatani kedua sisi. Nyerinya: verifikasi manual, rute disusun dari nol tiap hari, dan menjadi titik sengketa kualitas. Butuhnya satu layar untuk verifikasi, kurir, dan status.

## 5. Ruang Lingkup

**Masuk rilis pertama.** Landing page dengan angka studi kasus; demo React lokal tanpa backend; tiga peran simulasi; katalog sayur dengan perbandingan harga petani dan tengkulak; alur pre-order panen; verifikasi pesanan dan penetapan kurir; simulasi rute dan status pengiriman; dashboard traksi berisi GMV, komisi 15%, margin petani, dan sisa limbah; seluruh keadaan di localStorage, bisa direset.

**Sengaja di luar rilis pertama.**

- **Backend dan basis data.** Tidak ada server, API, atau penyimpanan di luar peramban pengguna.
- **Autentikasi nyata.** Pemilihan peran adalah simulasi, bukan login. Tidak ada kata sandi, sesi, atau otorisasi.
- **Pembayaran dan penagihan.** Komisi 15% hanya dihitung di dashboard, tidak pernah ditagihkan.
- **Notifikasi dan integrasi pihak ketiga.** Tidak ada WhatsApp API atau layanan luar.
- **Multi-bahasa.** Antarmuka hanya Bahasa Indonesia.
- **Aplikasi mobile native.** Berjalan di peramban dan harus enak dipakai di ponsel, tetapi tidak dirilis sebagai aplikasi.
- **Integrasi peta dan logistik nyata.** Rute kurir adalah representasi sederhana, bukan perhitungan jarak sesungguhnya.
- **Rekomendasi harga dan penjadwalan panen otomatis.** Keduanya butuh data historis yang belum ada.

## 6. Kebutuhan Fungsional

Tiap fitur mencantumkan angka studi kasus yang diujinya; kriteria terima bisa lulus atau gagal.

### F-1 Katalog sayur dan perbandingan harga

**User story:** Sebagai petani, saya ingin melihat harga tengkulak dan harga platform berdampingan sebelum menjual.
**Angka yang diuji:** tiga sampai empat lapis tengkulak, margin petani +20%.

1. Lulus bila setiap komoditas menampilkan harga petani, harga tengkulak, dan selisih rupiah per kilogram.
2. Lulus bila selisih dihitung dari data yang ditampilkan, bukan angka yang ditulis manual.
3. Lulus bila katalog menampilkan asal kebun dan tanggal panen, dan keadaan kosongnya menjelaskan belum ada panen terpasang.
4. Lulus bila semua harga diberi label data simulasi.

### F-2 Petani memasang panen

**User story:** Sebagai petani, saya ingin memasang panen dengan volume dan tanggal, supaya katering memesan sebelum saya memetik.
**Angka yang diuji:** susut 30%, pre-order panen.

1. Lulus bila formulir menerima komoditas, volume kilogram, harga per kilogram, dan tanggal panen.
2. Lulus bila volume nol, harga nol, atau tanggal kosong ditolak dengan pesan yang menyebut kolom salah.
3. Lulus bila panen baru muncul di katalog katering tanpa muat ulang, dan datanya bertahan setelah halaman dimuat ulang.
4. Lulus bila panen yang sudah dipesan penuh tidak bisa dipesan melebihi sisa volume.

### F-3 Katering membuat pre-order

**User story:** Sebagai pengelola katering, saya ingin memesan sebagian atau seluruh panen untuk tanggal tertentu, supaya dapur tahu pasti apa yang datang besok.
**Angka yang diuji:** distribusi 1 hari, limbah mendekati 0%.

1. Lulus bila katering bisa memesan volume kurang dari atau sama dengan sisa panen, dan pesanan tanpa item ditolak.
2. Lulus bila pesanan menampilkan tanggal panen dan perkiraan tiba dengan selisih satu hari.
3. Lulus bila total nilai pesanan dihitung dari volume dikali harga, dan komisi 15% tampil terpisah dari nilai untuk petani.
4. Lulus bila pesanan mengubah sisa volume panen dan perubahannya terlihat di peran petani.

### F-4 Admin memverifikasi pesanan

**User story:** Sebagai admin, saya ingin memverifikasi pre-order dan menetapkan kurir, supaya pesanan tidak menggantung tanpa kejelasan.
**Angka yang diuji:** take-rate 15%, waktu distribusi 1 hari.

1. Lulus bila daftar pesanan bisa difilter berdasarkan status, dan pesanan tidak bisa diverifikasi dua kali.
2. Lulus bila verifikasi mengubah status dan mencatat waktunya.
3. Lulus bila admin menetapkan nama kurir dan jadwal berangkat pada pesanan terverifikasi.
4. Lulus bila penolakan pesanan mengembalikan volume panen ke status tersedia.

### F-5 Simulasi rute kurir dan status pengiriman

**User story:** Sebagai admin, saya ingin melihat urutan antar dan memperbarui status, supaya katering tahu barang di jalan atau tiba.
**Angka yang diuji:** 1 hari dari panen ke dapur.

1. Lulus bila rute menampilkan urutan titik antar untuk pesanan yang berangkat hari sama.
2. Lulus bila status berpindah dari berangkat ke tiba dan perpindahannya tercatat lengkap dengan waktu.
3. Lulus bila status tiba tidak bisa ditetapkan pada pesanan yang belum berangkat.
4. Lulus bila halaman status punya keadaan kosong, dan warna status selalu disertai teks.

### F-6 Dashboard traksi

**User story:** Sebagai pemilik produk, saya ingin GMV, komisi, margin petani, dan sisa limbah dihitung otomatis, supaya presentasi tidak perlu hitung manual.
**Angka yang diuji:** GMV, komisi 15%, margin petani +20%, susut 30%.

1. Lulus bila GMV dihitung dari nilai seluruh pesanan berstatus tiba.
2. Lulus bila komisi dihitung 15% dari GMV, ditampilkan terpisah, dan dashboard menyatakan semua angka berasal dari data simulasi.
3. Lulus bila margin petani dibandingkan dengan skenario tengkulak, dengan dasar perhitungan terlihat.
4. Lulus bila sisa limbah dihitung dari volume dipesan dibanding volume dipanen, bukan angka tetap.

### F-7 Simulasi tiga peran

**User story:** Sebagai pembaca demo, saya ingin berpindah peran dengan satu klik untuk mengikuti alur ketiga sisi tanpa membuat akun.
**Angka yang diuji:** 30 ketua kelompok tani, 15 pengelola katering, 10 restoran pertama, yaitu ketiga peran saat demo.

1. Lulus bila pemilih peran muncul di setiap layar dan peran aktif terlihat jelas.
2. Lulus bila berpindah peran tidak menghapus data yang sudah dibuat.
3. Lulus bila setiap peran hanya menampilkan aksi relevan, dan pemilih peran punya label teks, bukan hanya ikon.
4. Lulus bila halaman menyatakan perpindahan peran adalah simulasi, bukan autentikasi.

### F-8 Landing page

**User story:** Sebagai pengunjung, saya ingin paham masalah, solusi, dan angka dampaknya dalam satu kali gulir, tanpa penjelasan tambahan.
**Angka yang diuji:** 30% susut, 1 hari, +20% margin, 15% komisi, 10 kota, 42/29/23/6.

1. Lulus bila setiap angka bisnis punya label sumbernya, yaitu studi kasus PanenLangsung atau riset CB Insights.
2. Lulus bila tombol menuju demo mengarah ke demo yang ada, dan tidak ada tautan navigasi ke halaman yang belum dibuat.
3. Lulus bila tidak ada testimoni, logo klien, atau statistik pengguna tanpa sumber.
4. Lulus bila landing page menyatakan produk ini demo dengan data dummy.

## 7. Alur Utama End-to-End

Alur ini tulang punggung demo: setiap langkah mengubah localStorage dan langsung terlihat peran lain.

1. **Petani memasang panen.** Status panen `tersedia`, menyimpan komoditas, volume, harga per kilogram, tanggal panen, dan asal kebun.
2. **Katering membuat pre-order.** Status pesanan `menunggu_verifikasi`. Sisa volume panen berkurang sesuai jumlah dipesan.
3. **Admin memverifikasi.** Status `diverifikasi`, waktu verifikasi dicatat. Bila ditolak, status `dibatalkan` dan volume kembali `tersedia`.
4. **Admin menetapkan kurir dan jadwal.** Status `berangkat`. Rute hari itu menampilkan titik antar sesuai urutan.
5. **Status tiba.** Status `tiba`. Nilai pesanan masuk ke GMV, komisi 15% dihitung, dashboard diperbarui.

Enam status yang disimpan: `tersedia`, `menunggu_verifikasi`, `diverifikasi`, `berangkat`, `tiba`, `dibatalkan`. Tanpa status tersembunyi, angka dashboard bisa diperiksa dari riwayat pesanan.

## 8. Persyaratan Non-Fungsional dan Data Lokal

- **Jalan tanpa jaringan setelah dimuat.** Seluruh aset dari berkas lokal, tanpa permintaan ke server; demo bisa dipresentasikan tanpa internet.
- **Keadaan bertahan setelah refresh.** Setiap perubahan langsung ditulis ke localStorage dan dipulihkan saat halaman dimuat ulang. Demo dirancang untuk puluhan pesanan, bukan ribuan.
- **Tombol reset data.** Di area pengaturan, meminta konfirmasi, dan mengembalikan demo ke data dummy awal. Wajib, karena penguji akan mengacak data.
- **Penandaan simulasi.** Label tetap menyatakan ini demo dengan data dummy dan tidak bisa ditutup permanen. Nama petani, katering, dan kurir fiktif, tanpa kontak nyata.
- **Responsif dan bisa dioperasikan papan ketik.** Alur petani dan katering selesai di layar 375 piksel tanpa gulir horizontal; semua kontrol terjangkau Tab dan aktif dengan Enter atau Space.

## 9. Prioritas Rilis

**Now (wajib agar demo bisa dinilai).** F-1, F-2, F-3, F-4, F-5, F-6, F-7, F-8, tombol reset data, dan label simulasi.

**Next (menambah kredibilitas setelah alur inti jalan).** Rincian waktu tiap perpindahan status, keadaan kosong dan galat yang informatif, serta riwayat pesanan per peran.

**Later (di luar cakupan demo).** WhatsApp Business, penagihan komisi otomatis, logistik cerdas, dan dashboard multi-kota untuk ekspansi 10 kota, didanai seed funding setelah product-market fit.

## 10. Risiko, Pertanyaan Terbuka, dan Asumsi

**Likuiditas petani versus tempo bayar katering.** Petani butuh uang cepat, katering membayar kemudian. Platform memotong 15% tanpa modal kerja; bila jeda bayar lebih lama dari siklus tanam, petani kembali ke tengkulak yang membayar tunai. Ini risiko terbesar, belum ada jawabannya.

**Konsistensi kualitas.** Pre-order menjanjikan volume, bukan grade. Satu kiriman di bawah standar bisa menghapus kepercayaan dari free-shipping untuk 10 restoran pertama, dan sengketa masih ditangani admin.

**Ketergantungan pada rute kurir.** Janji 1 hari hanya berlaku bila rute padat dan kurir tersedia. Di luar itu janji menjadi klaim yang tak bisa ditepati, dan itu lebih buruk daripada tidak menjanjikan apa pun.

**Angka dampak dibaca sebagai hasil.** Susut mendekati 0% dan margin +20% adalah target model, bukan hasil lapangan.

**Asumsi belum terbukti.** Petani bersedia menunggu pesanan sebelum memanen. Katering bersedia merencanakan menu sehari lebih awal. Komisi 15% tetap menarik setelah dibandingkan potongan tengkulak. Satu kurir per rute cukup untuk skala awal.

**Pertanyaan terbuka.** Siapa menanggung kerugian bila sayur tiba tidak sesuai grade? Apakah petani mau memanen pagi dan mengirim siang bila uang belum diterima? Berapa volume minimum agar 15% komisi menutup biaya kurir, dan apakah itu realistis untuk restoran tunggal? Apakah free-shipping untuk 10 restoran pertama membangun kebiasaan atau hanya menunda keputusan berhenti? Bagaimana memverifikasi harga tengkulak di katalog memang berlaku di desa itu? Kalau ekspansi ke 10 kota dijalankan, apakah model rute tunggal masih berlaku atau tiap kota butuh struktur sendiri?
