# PRD PanenLangsung

**Produk:** PanenLangsung, platform B2B agritech
**Asal:** studi kasus Kewirausahaan Digital, Kelompok 1
**Versi:** 1.1, beta tertutup, November 2026
**Sifat:** rencana produk untuk aplikasi beta empat peran. Seluruh angka berasal dari data contoh yang tersimpan di peramban.

---

## 1. Ringkasan Produk dan Visi

PanenLangsung mencocokkan panen petani dengan kebutuhan katering dan restoran kota lewat pre-order, sehingga sayur dipetik sesuai pesanan. Visinya: mengganti tiga sampai empat lapis tengkulak dengan data permintaan yang dipercaya kedua sisi.

Versi 1.1 adalah beta tertutup, bukan demo presentasi. Aplikasi memuat empat meja kerja yang saling terhubung: petani memasang panen, katering memesan, admin memverifikasi dan menugaskan, kurir menutup alur dengan bukti terima. Seluruh keadaan tersimpan di localStorage, tanpa backend, dan bisa direset ke data contoh.

## 2. Latar Belakang dan Masalah

Rantai pasok sayur terfragmentasi. Empat masalah menjelaskan biayanya.

**Tiga sampai empat lapis tengkulak.** Setiap lapis menambah biaya dan waktu; petani ditekan, restoran dibebani, dan selisihnya ongkos perpindahan barang.

**Petani buta harga pasar.** Tanpa data pembanding, petani menerima harga pengepul apa adanya.

**Sekitar 30% panen rusak di perjalanan.** Sayur dipanen tanpa tahu berapa yang dipesan, kelebihannya layu dan terbuang.

**Tiga sampai empat hari dari panen ke dapur.** Setiap hari dalam rantai itu mengurangi kesegaran.

Riset CB Insights mencatat 42% startup gagal karena tidak ada kebutuhan pasar, 29% kehabisan modal, 23% tim buruk, 6% faktor lain. Urutan kerja mengikuti tiga pilar: obsesi pada solusi, validasi berlapis, dan iterasi lincah. Validasi awal: wawancara 30 ketua kelompok tani dan 15 pengelola katering, MVP tanpa koding memakai WhatsApp Business dan Google Sheets, serta akuisisi 10 restoran pertama lewat free-shipping.

## 3. Tujuan Produk dan Metrik Keberhasilan

**Metrik bisnis (target, bukan hasil).** Take-rate 15% dari nilai transaksi selesai; margin bersih petani naik 20%; susut panen dari sekitar 30% menuju mendekati 0%; distribusi 1 hari, dari 3 sampai 4 hari; ekspansi 10 kota setelah product-market fit.

**Metrik produk (diukur di aplikasi).** Isi panen terserap, yaitu volume terpesan dibagi volume dipanen. Ketepatan waktu, yaitu pesanan tiba pada atau sebelum tanggal target. Waktu tunggu verifikasi. Muatan kurir terhadap kapasitas kendaraan. Limbah terhitung, yaitu volume tak terpesan ditambah volume gagal antar, dibagi volume dipanen.

Aplikasi tidak membuktikan take-rate atau margin di lapangan. Semua metrik bisnis di atas hanya target.

## 4. Persona dan Peran

**Petani.** Menjual panen beberapa anggota kelompok. Nyerinya: tidak tahu harga pasar, panen berdasarkan perkiraan, uang cair belakangan. Ia perlu harga pembanding, pesanan pasti sebelum memetik, dan sisa volume yang jelas.

**Katering dan restoran.** Membeli volume harian dengan menu berubah. Nyerinya: pasokan tidak konsisten, kualitas turun tanpa peringatan, harga berubah di tengah minggu. Ia perlu kepastian volume, grade yang terlihat, dan bukti terima.

**Admin operasi.** Menjembatani kedua sisi. Nyerinya: verifikasi manual, rute disusun dari nol, sengketa kualitas. Ia perlu antrean berusia waktu, penolakan beralasan, dan penugasan yang menghormati kapasitas kendaraan.

**Kurir.** Mengambil di kebun dan mengantar sesuai urutan. Nyerinya: alamat berubah, penerima tidak siap, bukti hanya berupa pesan pribadi. Ia perlu lembar tugas berurutan, empat langkah yang jelas, dan formulir bukti terima singkat.

## 5. Ruang Lingkup

**Masuk beta 0.9.** Landing page dengan angka studi kasus; empat peran simulasi; katalog dengan pencarian, filter grade, dan pengurutan; formulir pasang panen dengan grade, jendela panen, dan catatan; pre-order dengan batas sisa volume; verifikasi dan penolakan beralasan; penugasan kurir dengan pemeriksaan kapasitas; empat langkah kurir sampai bukti terima; laporan gagal antar; rute per kurir per hari; dashboard dengan GMV, komisi, margin, isi panen, ketepatan waktu, dan limbah; ekspor data JSON; reset data.

**Sengaja di luar beta.** Backend dan basis data; autentikasi nyata; pembayaran dan penagihan komisi; notifikasi, WhatsApp API, dan layanan pihak ketiga; multi-bahasa; aplikasi mobile native; peta dan optimasi rute nyata; rekomendasi harga otomatis; akuntansi dan faktur pajak.

## 6. Kebutuhan Fungsional

Tiap fitur mencantumkan angka studi kasus yang diujinya. Kriteria terima bisa lulus atau gagal.

### F-1 Katalog dengan pencarian dan filter

**User story:** Sebagai katering, saya ingin mencari panen dan menyaringnya, supaya saya tidak memesan dari daftar panjang tanpa konteks.
**Angka yang diuji:** tiga sampai empat lapis tengkulak, margin petani +20%.

1. Lulus bila setiap baris menampilkan harga platform, bagian petani setelah komisi 15%, harga tengkulak, dan selisih per kilogram yang dihitung dari data.
2. Lulus bila pencarian menyaring berdasarkan komoditas, petani, atau kebun, dan hasil kosong menjelaskan cara menghapus filter.
3. Lulus bila filter grade, filter hanya tersedia, dan empat pilihan urutan mengubah daftar tanpa memuat ulang halaman.
4. Lulus bila setiap baris menampilkan asal kebun, tanggal panen, jendela panen, grade, dan sisa volume.

### F-2 Petani memasang panen

**User story:** Sebagai petani, saya ingin memasang panen lengkap dengan grade dan jendela panen, supaya katering tahu apa yang akan diterima.
**Angka yang diuji:** susut 30%, pre-order panen.

1. Lulus bila formulir menerima komoditas, grade, volume, dua harga, tanggal dan jendela panen, asal kebun, petani, dan catatan.
2. Lulus bila kolom kosong atau bernilai nol ditolak dengan pesan yang menyebut kolom tersebut.
3. Lulus bila panen baru langsung tampil di katalog katering tanpa muat ulang.
4. Lulus bila sisa volume, potensi pendapatan petani, dan status tersedia atau habis dihitung ulang setiap kali pesanan berubah.

### F-3 Katering membuat pre-order

**User story:** Sebagai katering, saya ingin memesan dalam batas sisa panen dan melihat biayanya, supaya keputusan pembelian tidak mengejutkan.
**Angka yang diuji:** distribusi 1 hari, limbah mendekati 0%.

1. Lulus bila volume pesanan dibatasi sisa panen dan pesanan tanpa item ditolak.
2. Lulus bila ringkasan menampilkan nilai pesanan, komisi 15%, bagian petani, dan perkiraan tiba satu hari setelah panen.
3. Lulus bila catatan katering tersimpan bersama pesanan.
4. Lulus bila pesanan baru masuk dengan status menunggu verifikasi dan langsung mengurangi sisa panen.

### F-4 Admin memverifikasi atau menolak

**User story:** Sebagai admin, saya ingin melihat antrean berusia waktu dan menolak dengan alasan, supaya tidak ada pesanan yang menggantung tanpa keputusan.
**Angka yang diuji:** take-rate 15%, waktu tunggu verifikasi.

1. Lulus bila antrean menampilkan usia tunggu setiap pesanan dan tidak bisa diverifikasi dua kali.
2. Lulus bila tombol konfirmasi penolakan terkunci sampai alasan diisi, dan alasan tersimpan di riwayat.
3. Lulus bila pesanan yang ditolak mengembalikan volume ke panen dan berstatus dibatalkan.
4. Lulus bila verifikasi mencatat waktu dan memindahkan pesanan ke antrean penugasan.

### F-5 Penugasan kurir dengan kapasitas

**User story:** Sebagai admin, saya ingin memilih kurir dan tanggal, supaya muatan tidak melebihi kendaraan dan rute tetap masuk akal.
**Angka yang diuji:** distribusi 1 hari.

1. Lulus bila pilihan kurir menampilkan nama, kendaraan, dan kapasitas.
2. Lulus bila penugasan ditolak ketika total muatan kurir pada tanggal itu melebihi kapasitas, dengan menyebut angka muatan dan kapasitasnya.
3. Lulus bila penugasan berhasil mengubah status menjadi berangkat, mencatat kurir, jadwal, dan tahap kurir ditugaskan.
4. Lulus bila pesanan yang belum diverifikasi tidak bisa ditugaskan.

### F-6 Kurir menutup serah terima

**User story:** Sebagai kurir, saya ingin mencatat setiap langkah dan bukti terima, supaya status tiba punya dasar yang bisa diperiksa.
**Angka yang diuji:** distribusi 1 hari, limbah mendekati 0%.

1. Lulus bila tahap berjalan berurutan: ditugaskan, diambil, di jalan, terkirim.
2. Lulus bila penyelesaian antar mewajibkan nama penerima dan menyimpan waktu serta catatan.
3. Lulus bila laporan gagal antar mewajibkan alasan dan pesanan tetap terlihat admin.
4. Lulus bila status pesanan menjadi tiba hanya setelah tahap terkirim, dan bukti tampil di riwayat katering maupun admin.

### F-7 Rute harian

**User story:** Sebagai admin atau kurir, saya ingin melihat urutan antar per hari, supaya tidak ada titik yang terlewat.
**Angka yang diuji:** distribusi 1 hari.

1. Lulus bila rute dikelompokkan per tanggal dan kurir, dengan nomor urut yang sama dengan urutan tampil.
2. Lulus bila setiap titik menampilkan katering, komoditas, volume, status pesanan, dan tahap kurir.
3. Lulus bila muatan total dan kapasitas kendaraan tampil sebagai perbandingan.
4. Lulus bila peran kurir hanya melihat rute milik kurir yang dipilih.

### F-8 Dashboard operasi

**User story:** Sebagai admin, saya ingin angka operasi dihitung dari data yang sama, supaya laporan tidak perlu disusun manual.
**Angka yang diuji:** GMV, komisi 15%, margin petani +20%, susut 30%, 1 hari.

1. Lulus bila GMV dihitung dari nilai pesanan tiba, dan komisi 15% ditampilkan terpisah.
2. Lulus bila margin petani dibandingkan dengan nilai tengkulak untuk volume yang sama, dengan dasar perhitungan terlihat.
3. Lulus bila isi panen terserap, ketepatan waktu, rata-rata pesanan, limbah, dan pengiriman aktif dihitung dari data.
4. Lulus bila dashboard menyatakan bahwa seluruh angka berasal dari data contoh.

### F-9 Landing page

**User story:** Sebagai pengunjung, saya ingin memahami masalah, alur, peran, dan angka dampaknya, supaya saya bisa menilai produk tanpa penjelasan tambahan.
**Angka yang diuji:** 30% susut, 1 hari, +20% margin, 15% komisi, 10 kota, 42/29/23/6, 30 petani, 15 katering, 10 restoran.

1. Lulus bila setiap angka bisnis punya label sumber, yaitu studi kasus PanenLangsung atau riset CB Insights.
2. Lulus bila pratinjau aplikasi bisa berpindah antara papan panen, rute, dan bukti terima tanpa memuat ulang.
3. Lulus bila tidak ada testimoni, logo klien, atau statistik pengguna tanpa sumber.
4. Lulus bila seluruh tautan navigasi menuju bagian yang ada, dan tombol aplikasi membuka aplikasi beta.

## 7. Alur Utama End-to-End

1. **Petani memasang panen.** Panen berstatus tersedia, dengan grade, volume, dua harga, tanggal dan jendela panen, asal kebun, petani, dan catatan.
2. **Katering membuat pre-order.** Pesanan berstatus menunggu verifikasi, sisa panen berkurang, nilai dan komisi dihitung.
3. **Admin memverifikasi atau menolak.** Verifikasi mencatat waktu. Penolakan mewajibkan alasan dan mengembalikan volume.
4. **Admin menugaskan kurir.** Sistem memeriksa muatan hari itu. Status berubah menjadi berangkat, tahap kurir menjadi ditugaskan.
5. **Kurir mengambil dan mengantar.** Tahap berjalan: diambil, di jalan, terkirim. Bukti terima berisi penerima, waktu, dan catatan.
6. **Pesanan tiba dan dashboard diperbarui.** GMV, komisi, isi panen, ketepatan waktu, dan limbah dihitung ulang.

Enam status pesanan: menunggu verifikasi, terverifikasi, berangkat, tiba, dibatalkan, dan tersedia sebagai status panen. Lima tahap kurir disimpan terpisah: ditugaskan, diambil, di jalan, terkirim, gagal. Tidak ada status tersembunyi.

## 8. Persyaratan Non-Fungsional dan Data Lokal

- **Tanpa jaringan setelah dimuat.** Seluruh aset dari bundel lokal, tidak ada panggilan ke server.
- **Penyimpanan berversi.** Kunci `panenlangsung:v2` di localStorage, ditulis setiap perubahan dan dipulihkan saat halaman dimuat.
- **Data contoh awal.** Delapan baris panen dan dua belas pesanan, termasuk dua pengiriman aktif dan satu pesanan yang sudah tiba dengan bukti.
- **Reset dan ekspor.** Reset meminta konfirmasi dan mengembalikan data awal. Ekspor mengunduh JSON dari keadaan saat ini tanpa jaringan.
- **Penandaan beta.** Lencana beta terlihat di setiap layar, dan setiap panel data menyebut data contoh.
- **Tanpa data pribadi nyata.** Nama petani, katering, dan kurir fiktif; tidak ada kontak yang bisa dihubungi.
- **Responsif sampai 375 piksel.** Landing dan keempat peran selesai tanpa gulir horizontal.
- **Papan ketik.** Semua kontrol terjangkau Tab, aktif dengan Enter atau Space, dengan indikator fokus terlihat.
- **Kontras.** Seluruh pasangan teks memenuhi WCAG AA.
- **Kinerja.** Tidak ada klaim angka yang belum diukur. Aplikasi dirancang untuk puluhan pesanan.

## 9. Prioritas Rilis

**Now.** F-1 sampai F-9, reset, ekspor data, lencana beta, dan label data contoh.

**Next.** Riwayat perubahan yang bisa disaring, penerimaan bertahap per titik, penandaan grade dari foto, dan pencatatan suhu kotak.

**Later.** Login nyata dan peran terpisah per akun, penagihan komisi, integrasi WhatsApp, optimasi rute dengan peta, dan dashboard multi-kota untuk ekspansi 10 kota.

## 10. Risiko, Pertanyaan Terbuka, dan Asumsi

**Likuiditas petani versus tempo bayar katering.** Petani butuh uang cepat, katering membayar kemudian. Platform memotong 15% tanpa modal kerja; bila jeda bayar lebih lama dari siklus tanam, petani kembali ke tengkulak yang membayar tunai. Ini risiko terbesar.

**Konsistensi kualitas.** Pre-order menjanjikan volume dan grade, bukan jaminan mutu. Satu kiriman di bawah standar bisa menghapus kepercayaan dari 10 restoran pertama, dan sengketa masih ditangani admin.

**Kapasitas dan keandalan kurir.** Janji 1 hari bergantung pada rute padat, kendaraan yang cukup, dan kurir yang hadir. Pemeriksaan kapasitas membantu, tetapi tidak menjamin ketepatan waktu.

**Angka dampak dibaca sebagai hasil.** Susut mendekati 0% dan margin +20% adalah target model, bukan pengukuran lapangan. Aplikasi memakai data contoh.

**Asumsi belum terbukti.** Petani bersedia menunggu pesanan sebelum memanen. Katering bersedia merencanakan menu sehari lebih awal. Komisi 15% tetap menarik setelah dibandingkan potongan tengkulak. Satu kurir per rute cukup untuk skala awal.

**Pertanyaan terbuka.** Siapa menanggung kerugian bila sayur tiba tidak sesuai grade? Apakah petani mau memanen pagi dan mengirim siang bila uang belum diterima? Berapa volume minimum agar 15% komisi menutup biaya kurir? Apakah 10 restoran pertama membangun kebiasaan atau hanya menunda keputusan berhenti? Bagaimana memverifikasi harga tengkulak di katalog memang berlaku di desa itu? Kalau ekspansi ke 10 kota dijalankan, apakah model rute tunggal masih berlaku atau tiap kota butuh struktur sendiri?
