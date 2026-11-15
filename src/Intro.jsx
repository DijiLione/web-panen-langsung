import { KOMISI, formatTanggal, hargaPetani, hariIni, rupiah, selisihPetani } from './data.js';
import { Beta, Ikon } from './ui.jsx';

const bukti = [
  ['1 hari', 'dari petik ke dapur, bukan tiga sampai empat hari'],
  [`${Math.round(KOMISI * 100)}%`, 'komisi dari transaksi selesai, tanpa biaya pendaftaran'],
  ['0 kg', 'dipetik tanpa pesanan yang sudah masuk'],
];

const jalurFnb = [
  ['Cari di katalog', 'Komoditas, petani, atau asal kebun. Saring grade A atau B, urutkan menurut harga dan sisa volume.'],
  ['Baca harga sebenarnya', 'Harga platform per kg berdiri di samping harga tengkulak, jadi kamu tahu selisihnya sebelum memesan.'],
  ['Kirim pre-order', 'Volume dibatasi sisa panen. Yang kamu pesan memang sudah ada di kebun, bukan janji.'],
  ['Terima H+1', 'Kurir mencatat nama penerima, jumlah krat, kondisi barang, dan waktu. Bukti tersimpan di riwayat.'],
];

const jalurPetani = [
  ['Pasang panen', 'Komoditas, grade, volume, jendela petik, dan catatan pengemasan. Selesai dalam satu formulir.'],
  ['Lihat dua harga', 'Harga platform dan harga tengkulak tampil berdampingan. Bagian petani 85% dari nilai transaksi.'],
  ['Petik setelah ada pesanan', 'Sisa volume turun setiap kali pembeli memesan. Tidak ada lagi panen yang dipetik tanpa tujuan.'],
  ['Kurir ambil di kebun', 'Kamu tidak perlu mengantar ke pasar. Pendapatan tercatat per pesanan, bisa diperiksa kapan saja.'],
];

export default function Intro({ state, onMasuk, onPanduan }) {
  const pesanan = state.pesanan.length;
  const panen = state.tanaman.length;

  return (
    <div className="pintu">
      <header className="pintu-atas">
        <div className="wrap pintu-baris">
          <a className="merek merek-terang" href="#/">
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M12 21c0-6 3-9.5 8-10-0.5 6-3.5 9.5-8 10Z"
                fill="#34d3a3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M12 21C12 14 9 10.5 4 10c0.5 6 3.5 10 8 11Z"
                fill="#f3f0df"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span>PanenLangsung</span>
          </a>
          <div className="pintu-atas-kanan">
            <Beta kecil />
          </div>
        </div>
      </header>

      <section className="pintu-hero">
        <div className="wrap pintu-hero-isi">
          <div className="pintu-hero-teks">
          <p className="pintu-tanda">
            <span className="pintu-titik" aria-hidden="true" />
            Jual beli hasil panen langsung ke dapur
          </p>
          <h1 className="pintu-judul">
            Dipetik setelah <em>pesanan</em> masuk, bukan setelah harga ditawar.
          </h1>
          <p className="pintu-ringkas">
            PanenLangsung memotong tiga sampai empat lapis tengkulak antara kebun dan dapur.
            Bisnis FnB memesan lebih awal, petani memetik sesuai pesanan, kurir mengantar di hari
            yang sama. Satu data, dua sisi yang bisa saling memeriksa.
          </p>
          <div className="pintu-aksi">
            <button
              type="button"
              className="tombol tombol-teal tombol-besar"
              onClick={() => onMasuk({ peran: 'admin', tab: 'dashboard' })}
            >
              Masuk ke dashboard
              <Ikon nama="panah" ukuran={16} />
            </button>
            <button type="button" className="tombol tombol-garis-terang tombol-besar" onClick={onPanduan}>
              Panduan FnB dan petani
            </button>
            <a className="tombol tombol-garis-terang pintu-pilihan" href="#/">
              Halaman produk
              <Ikon nama="panah" ukuran={15} />
            </a>
          </div>

          </div>

          <aside className="pintu-papan" aria-label="Cuplikan katalog hari ini">
            <div className="pintu-papan-kepala">
              <span className="pintu-papan-judul">Cuplikan katalog</span>
              <span className="pintu-papan-tanggal">{formatTanggal(hariIni())}</span>
            </div>
            {state.tanaman.slice(0, 4).map((t) => (
              <div className="pintu-papan-baris" key={t.id}>
                <div>
                  <strong>{t.komoditas}</strong>
                  <span className="pintu-papan-asal">
                    {t.asalKebun} · grade {t.grade}
                  </span>
                </div>
                <div className="pintu-papan-angka">
                  <strong>{rupiah(hargaPetani(t.hargaPlatform))}</strong>
                  <span>tengkulak {rupiah(t.hargaTengkulak)}</span>
                </div>
                <span className="pintu-papan-selisih">+{rupiah(selisihPetani(t))}</span>
              </div>
            ))}
            <p className="pintu-papan-kaki">
              Bagian petani = harga platform x 85%. Selisih dihitung terhadap harga tengkulak.
            </p>
            <p className="pintu-papan-kaki">{state.tanaman.length} baris panen aktif di katalog.</p>
          </aside>
        </div>

        <div className="wrap">
          <dl className="pintu-angka">
            {bukti.map(([angka, label]) => (
              <div key={angka}>
                <dt>{angka}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pintu-jalur">
        <div className="wrap">
          <div className="pintu-jalur-kepala">
            <h2>Dua pintu masuk, satu alur kerja.</h2>
            <p>
              Semua angka di aplikasi ini dihitung dari {panen} baris panen dan {pesanan} pesanan
              contoh. Kamu bisa mengubahnya dan melihat dampaknya di dashboard.
            </p>
          </div>

          <div className="pintu-daftar">
            <article className="pintu-kartu">
              <header>
                <span className="pintu-kartu-tanda">Untuk bisnis FnB</span>
                <h3>Restoran, kafe, katering, dan dapur produksi.</h3>
                <p>
                  Menu sudah ditulis tiga hari lalu, belanja sayur masih tawar-menawar pagi ini.
                  Di sini harganya terbaca sebelum kamu memesan.
                </p>
              </header>
              <ol className="pintu-langkah">
                {jalurFnb.map(([judul, isi], i) => (
                  <li key={judul}>
                    <span className="pintu-nomor">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{judul}</strong>
                      <p>{isi}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="tombol tombol-utama pintu-kartu-aksi"
                onClick={() => onMasuk({ peran: 'fnb', tab: 'katalog' })}
              >
                Coba sebagai FnB
                <Ikon nama="panah" ukuran={16} />
              </button>
            </article>

            <article className="pintu-kartu">
              <header>
                <span className="pintu-kartu-tanda">Untuk petani</span>
                <h3>Kelompok tani, gapoktan, dan kebun keluarga.</h3>
                <p>
                  Kamu sudah tahu berapa yang akan dipetik besok, dan untuk siapa. Sisanya tinggal
                  diantar.
                </p>
              </header>
              <ol className="pintu-langkah">
                {jalurPetani.map(([judul, isi], i) => (
                  <li key={judul}>
                    <span className="pintu-nomor">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{judul}</strong>
                      <p>{isi}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="tombol tombol-utama pintu-kartu-aksi"
                onClick={() => onMasuk({ peran: 'petani', tab: 'panen' })}
              >
                Coba sebagai Petani
                <Ikon nama="panah" ukuran={16} />
              </button>
            </article>
          </div>

          <p className="pintu-catatan">
            Ada juga meja admin dan aplikasi kurir di dalam. Admin memverifikasi pesanan dan
            menugaskan kendaraan, kurir mencatat empat langkah sampai bukti terima.
          </p>
        </div>
      </section>

      <footer className="pintu-kaki">
        <div className="wrap pintu-kaki-baris">
          <span>
            Tanpa login, tanpa server. Data contoh tersimpan di peramban ini dan bisa direset dari
            Pengaturan.
          </span>
          <span>Beta 0.9 · {formatTanggal(hariIni())}</span>
        </div>
      </footer>
    </div>
  );
}
