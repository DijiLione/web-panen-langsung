import { KOMISI, rupiah } from '../data.js';
import { Ikon, Kepala, Panel } from '../ui.jsx';

const alur = [
  ['FnB', 'Pesan', 'Pilih komoditas dan volume dari panen yang sudah terpasang.'],
  ['Admin', 'Verifikasi', 'Cek ketersediaan dan kapasitas kurir pada tanggal berangkat.'],
  ['Petani', 'Petik', 'Panen dipetik pagi hari sesuai jendela yang dicantumkan.'],
  ['Kurir', 'Antar', 'Satu hari, urutan titik jelas, muatan dihitung.'],
  ['FnB', 'Terima', 'Bukti terima berisi nama, jumlah krat, kondisi, dan waktu.'],
];

const panduanFnb = [
  {
    judul: 'Mulai dari katalog',
    isi: 'Buka tab Katalog. Cari nama komoditas, petani, atau asal kebun. Saring grade A untuk menu yang butuh tampilan rapi, grade B untuk sup, saus, dan tumis.',
    catatan: 'Harga per kg dan harga tengkulak ditampilkan berdampingan. Selisih itu bukan promosi, itu angka yang bisa kamu cek sendiri.',
  },
  {
    judul: 'Tentukan volume sesuai sisa panen',
    isi: 'Di tab Pre-order, isi volume dalam kilogram. Kolom ini dibatasi sisa panen yang belum dipesan, jadi kamu tidak bisa memesan barang yang tidak ada.',
    catatan: 'Pesan untuk kebutuhan dua sampai tiga hari ke depan, bukan untuk stok seminggu. Sayur daun kehilangan mutu paling cepat.',
  },
  {
    judul: 'Kirim dan tunggu verifikasi',
    isi: 'Pesanan masuk antrean admin dengan status Menunggu verifikasi. Admin memeriksa lalu menugaskan kurir yang kapasitas kendaraannya cukup untuk total muatan hari itu.',
    catatan: 'Kalau ditolak, alasannya wajib ditulis dan tetap menempel di riwayat pesanan. Tidak ada penolakan tanpa keterangan.',
  },
  {
    judul: 'Terima dan periksa',
    isi: 'Status berubah menjadi Dalam pengiriman, lalu Tiba. Kurir mencatat nama penerima, jumlah krat, kondisi barang, dan waktu serah terima.',
    catatan: 'Bukti ini yang dipakai kalau ada selisih jumlah atau barang rusak. Bukan tangkapan layar chat.',
  },
  {
    judul: 'Ulangi dengan pola yang sama',
    isi: 'Pakai riwayat pesanan untuk menyusun jadwal belanja mingguan. Volume yang stabil membuat petani berani menanam lebih banyak untuk kamu.',
    catatan: 'Pesanan rutin dengan volume tetap adalah alasan terkuat bagi petani untuk melepas tengkulak.',
  },
];

const panduanPetani = [
  {
    judul: 'Pasang panen sebelum memetik',
    isi: 'Buka tab Panen saya, isi komoditas, grade, volume, harga platform, jendela petik, dan catatan pengemasan. Satu baris panen langsung muncul di katalog pembeli.',
    catatan: 'Tulis jendela petik yang benar-benar bisa kamu penuhi. Kurir datang berdasarkan jam itu, bukan berdasarkan perkiraan.',
  },
  {
    judul: 'Bandingkan dua harga',
    isi: 'Harga platform dan harga tengkulak tampil di baris yang sama. Bagian yang kamu terima adalah 85% dari nilai transaksi, karena komisi platform 15%.',
    catatan: `Contoh: 60 kg bayam dengan harga platform ${rupiah(7100)} per kg bernilai ${rupiah(60 * 7100)}, dan bagianmu ${rupiah(60 * 7100 * (1 - KOMISI))}.`,
  },
  {
    judul: 'Biarkan pesanan menentukan volume petik',
    isi: 'Setiap pre-order mengurangi sisa volume secara otomatis. Kamu memetik hanya sejumlah yang sudah dipesan, jadi tidak ada hasil panen yang berakhir dibuang.',
    catatan: 'Sisa volume di tab Panen saya adalah angka yang paling sering kamu buka. Itu jawaban atas pertanyaan "besok petik berapa".',
  },
  {
    judul: 'Serahkan ke kurir di kebun',
    isi: 'Kurir mengambil di titik kebun sesuai jadwal, lalu mencatat tahap Diambil di kebun. Kamu tidak perlu menyewa kendaraan atau menyetor ke pasar.',
    catatan: 'Siapkan krat atau keranjang sesuai catatan pengemasan. Barang yang tidak sesuai kemasan menahan proses serah terima.',
  },
  {
    judul: 'Periksa pendapatan per pesanan',
    isi: 'Setiap pesanan yang selesai tercatat di dashboard admin: nilai transaksi, komisi, dan bagian petani. Angkanya dihitung dari data yang sama, bukan rekap manual.',
    catatan: 'Simpan catatan panen mingguanmu. Volume yang konsisten membuka peluang kontrak rutin dengan dapur besar.',
  },
];

const istilah = [
  ['GMV', 'Total nilai pesanan yang sudah tiba. Dasar semua angka di dashboard.'],
  ['Komisi 15%', 'Bagian platform dari setiap transaksi selesai. Tidak ada biaya pendaftaran atau biaya bulanan.'],
  ['Grade A / B', 'A untuk tampilan dan menu utama, B untuk olahan seperti sup, saus, dan tumis. Harga mengikuti grade.'],
  ['Selisih', 'Beda antara harga platform dan harga tengkulak untuk volume yang sama.'],
  ['Limbah', 'Volume tak terpesan ditambah volume gagal antar, dibagi volume dipanen.'],
  ['Tepat waktu', 'Pesanan yang tiba pada atau sebelum tanggal perkiraan tiba.'],
];

export default function Panduan({ onKe }) {
  return (
    <>
      <Kepala
        judul="Cara pakai"
        keterangan="Dua panduan utama: satu untuk bisnis FnB yang memesan, satu untuk petani yang memasang panen. Semuanya bisa dicoba langsung di aplikasi ini."
      />

      <Panel judul="Alur satu pesanan" keterangan="Lima titik, semuanya memakai data yang sama.">
        <ol className="panduan-alur">
          {alur.map(([peran, judul, isi], i) => (
            <li key={judul}>
              <span className="panduan-alur-nomor">{String(i + 1).padStart(2, '0')}</span>
              <span className="panduan-alur-peran">{peran}</span>
              <strong>{judul}</strong>
              <p>{isi}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="panduan-grid">
        <Panel
          judul="Untuk bisnis FnB"
          keterangan="Restoran, kafe, katering, dan dapur produksi."
          aksi={
            <button
              type="button"
              className="tombol tombol-kecil tombol-utama"
              onClick={() => onKe('fnb', 'katalog')}
            >
              Buka katalog
              <Ikon nama="panah" ukuran={16} />
            </button>
          }
        >
          <ol className="panduan-langkah">
            {panduanFnb.map((l, i) => (
              <li key={l.judul}>
                <span className="panduan-nomor">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{l.judul}</h3>
                  <p>{l.isi}</p>
                  <p className="panduan-catatan">{l.catatan}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          judul="Untuk petani"
          keterangan="Kelompok tani, gapoktan, dan kebun keluarga."
          aksi={
            <button
              type="button"
              className="tombol tombol-kecil tombol-utama"
              onClick={() => onKe('petani', 'panen')}
            >
              Pasang panen
              <Ikon nama="panah" ukuran={16} />
            </button>
          }
        >
          <ol className="panduan-langkah">
            {panduanPetani.map((l, i) => (
              <li key={l.judul}>
                <span className="panduan-nomor">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{l.judul}</h3>
                  <p>{l.isi}</p>
                  <p className="panduan-catatan">{l.catatan}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="dua-kolom dua-kolom-dash">
        <Panel judul="Arti angka di dashboard" keterangan="Istilah yang muncul di ringkasan operasi.">
          <dl className="panduan-istilah">
            {istilah.map(([nama, arti]) => (
              <div key={nama}>
                <dt>{nama}</dt>
                <dd>{arti}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel judul="Meja admin dan kurir" keterangan="Dua peran yang menjaga alur tetap jalan.">
          <div className="panduan-peran">
            <div>
              <h3>Admin</h3>
              <p>
                Memeriksa antrean pesanan menurut usia tunggu, menolak dengan alasan tertulis,
                menugaskan kurir sesuai kapasitas kendaraan, dan membaca rute harian per kurir.
              </p>
              <button
                type="button"
                className="tombol tombol-garis tombol-kecil"
                onClick={() => onKe('admin', 'verifikasi')}
              >
                Buka verifikasi
              </button>
            </div>
            <div>
              <h3>Kurir</h3>
              <p>
                Mencatat empat langkah: ditugaskan, diambil di kebun, di jalan, terkirim. Serah
                terima mengisi nama penerima, jumlah krat, dan kondisi barang.
              </p>
              <button
                type="button"
                className="tombol tombol-garis tombol-kecil"
                onClick={() => onKe('kurir', 'tugas')}
              >
                Buka tugas kurir
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        judul="Yang perlu disiapkan sebelum mulai"
        keterangan="Supaya uji coba pertama tidak berhenti di tengah jalan."
      >
        <ul className="centang-daftar panduan-siap">
          <li>
            <Ikon nama="tanda" ukuran={16} />
            <span>
              <strong>Bisnis FnB:</strong> daftar menu tiga hari ke depan, perkiraan kebutuhan per
              komoditas dalam kilogram, dan nama penanggung jawab penerima barang.
            </span>
          </li>
          <li>
            <Ikon nama="tanda" ukuran={16} />
            <span>
              <strong>Petani:</strong> jadwal petik yang realistis, grade yang bisa kamu jaga,
              jumlah krat atau keranjang, dan titik kebun yang mudah dijangkau kendaraan.
            </span>
          </li>
          <li>
            <Ikon nama="tanda" ukuran={16} />
            <span>
              <strong>Bersama:</strong> satu nomor WhatsApp aktif untuk konfirmasi hari pengiriman.
              Aplikasi ini mencatat data, bukan menggantikan percakapan terakhir sebelum berangkat.
            </span>
          </li>
        </ul>
      </Panel>
    </>
  );
}
