import { dataAwal, formatTanggal, hargaPetani, rupiah, selisihPetani } from './data.js';

const contoh = dataAwal().tanaman.slice(0, 3);

function Merek() {
  return (
    <a className="merek" href="#/">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 21c0-6 3-9.5 8-10-0.5 6-3.5 9.5-8 10Z"
          fill="#11caa0"
          stroke="#0f172a"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M12 21C12 14 9 10.5 4 10c0.5 6 3.5 10 8 11Z"
          fill="#f3f0df"
          stroke="#0f172a"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      PanenLangsung
    </a>
  );
}

export default function Landing() {
  return (
    <>
      <header className="situs">
        <div className="wrap situs-baris">
          <Merek />
          <nav className="situs-nav" aria-label="Navigasi halaman">
            <a href="#masalah">Masalah</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#dampak">Dampak</a>
            <a href="#pilar">Pilar</a>
            <a className="tombol tombol-utama tombol-kecil" href="#/demo">
              Buka demo
            </a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <section className="hero" aria-labelledby="judul-hero">
          <div>
            <h1 id="judul-hero">Sayur dipetik setelah pesanan masuk.</h1>
            <p className="pimpin">
              PanenLangsung mempertemukan kelompok tani dengan katering dan restoran lewat
              pre-order panen. Tiga sampai empat lapis tengkulak diganti satu alur yang bisa
              dilihat kedua sisi.
            </p>
            <div className="hero-aksi">
              <a className="tombol tombol-utama" href="#/demo">
                Buka demo tiga peran
              </a>
              <a className="tombol" href="#cara-kerja">
                Lihat cara kerjanya
              </a>
            </div>
            <p className="catatan-kecil">
              Demo berjalan tanpa login. Seluruh angka dan nama di dalamnya adalah data dummy.
            </p>
          </div>

          <aside className="papan" aria-labelledby="judul-papan">
            <div className="papan-kepala">
              <h2 className="papan-judul" id="judul-papan">
                Papan panen hari ini
              </h2>
              <span className="tag-contoh">Data contoh</span>
            </div>
            {contoh.map((t) => (
              <div className="papan-baris" key={t.id}>
                <span className="papan-nama">{t.komoditas}</span>
                <span className="papan-harga">
                  <b>{rupiah(hargaPetani(t.hargaPlatform))}/kg</b>
                  <span>tengkulak {rupiah(t.hargaTengkulak)}</span>
                </span>
                <span className="papan-sub">
                  {t.asalKebun} · panen {formatTanggal(t.tanggalPanen)} · selisih{' '}
                  {rupiah(selisihPetani(t))}/kg
                </span>
              </div>
            ))}
            <p className="papan-kaki">
              Angka di papan ini dihitung dari harga platform setelah komisi 15%, bukan ditulis
              manual. Di dalam demo, semua baris seperti ini lahir dari data yang kamu buat sendiri.
            </p>
          </aside>
        </section>

        <section className="sec" id="masalah" aria-labelledby="judul-masalah">
          <div className="sec-kepala">
            <h2 id="judul-masalah">Rantai pasok yang mahal di dua ujung.</h2>
            <p>
              Petani menerima sedikit, dapur membayar banyak, dan selisihnya habis di perjalanan.
            </p>
          </div>
          <dl className="angka-grid">
            <div className="angka-butir">
              <dt className="angka-besar">3 sampai 4</dt>
              <dd>
                <p>lapis tengkulak antara kebun dan dapur. Setiap lapis menambah biaya dan waktu.</p>
              </dd>
            </div>
            <div className="angka-butir">
              <dt className="angka-besar">30%</dt>
              <dd>
                <p>
                  hasil panen rusak di perjalanan karena dipanen tanpa tahu berapa yang sudah
                  dipesan.
                </p>
              </dd>
            </div>
            <div className="angka-butir">
              <dt className="angka-besar">3 sampai 4 hari</dt>
              <dd>
                <p>dari panen sampai dapur. Setiap hari di rantai itu mengurangi kesegaran.</p>
              </dd>
            </div>
            <div className="angka-butir">
              <dt className="angka-besar">Tanpa pembanding</dt>
              <dd>
                <p>
                  petani menerima harga pengepul apa adanya, karena tidak ada angka lain yang bisa
                  dibaca.
                </p>
              </dd>
            </div>
          </dl>
          <p className="sumber">
            Sumber: studi kasus PanenLangsung, Kewirausahaan Digital Kelompok 1.
          </p>
        </section>

        <section className="sec" id="cara-kerja" aria-labelledby="judul-cara">
          <div className="sec-kepala">
            <h2 id="judul-cara">Satu alur, dua sisi.</h2>
            <p>
              Petani memasang panen, katering memesan sebelum petik, admin menjaga rute tetap satu
              hari.
            </p>
          </div>

          <div className="pilar" style={{ marginBottom: '34px' }}>
            <div>
              <h3>Pre-order sebelum petik</h3>
              <p>
                Panen dipasang dengan volume dan tanggal. Katering memesan lebih dulu, jadi yang
                dipetik adalah yang sudah dibeli.
              </p>
            </div>
            <div>
              <h3>Harga terbuka</h3>
              <p>
                Harga platform dan harga tengkulak tampil berdampingan. Komisi 15% dipisah dari
                bagian petani, bukan disembunyikan di dalam harga.
              </p>
            </div>
            <div>
              <h3>Rute harian</h3>
              <p>
                Pesanan yang berangkat di hari yang sama disusun jadi urutan antar. Sayur pagi,
                tiba siang.
              </p>
            </div>
          </div>

          <h3 style={{ marginBottom: '14px' }}>Empat tahap yang sudah dijalani</h3>
          <ol className="alur">
            <li>
              <span className="alur-nomor">Tahap 1</span>
              <h3>Validasi asumsi</h3>
              <p>
                Wawancara dengan 30 ketua kelompok tani dan 15 pengelola katering untuk mengukur
                kesediaan mencoba dan membayar.
              </p>
            </li>
            <li>
              <span className="alur-nomor">Tahap 2</span>
              <h3>MVP tanpa koding</h3>
              <p>
                Transaksi awal lewat WhatsApp Business, basis data dan rute kurir dikelola di
                Google Sheets. Tanpa aplikasi mahal.
              </p>
            </li>
            <li>
              <span className="alur-nomor">Tahap 3</span>
              <h3>Akuisisi pengguna</h3>
              <p>
                Free-shipping dan potongan harga perdana untuk 10 restoran pertama, untuk
                menurunkan keraguan dan mengumpulkan testimoni nyata.
              </p>
            </li>
            <li>
              <span className="alur-nomor">Tahap 4</span>
              <h3>Skala setelah product-market fit</h3>
              <p>
                Data traksi dipakai untuk mengajukan seed funding, membangun logistik cerdas, lalu
                ekspansi ke 10 kota.
              </p>
            </li>
          </ol>
          <p className="sumber">Sumber: studi kasus PanenLangsung, tahap MVP sampai rencana ekspansi.</p>
        </section>

        <section className="sec" id="dampak" aria-labelledby="judul-dampak">
          <div className="sec-kepala">
            <h2 id="judul-dampak">Yang berubah kalau panen mengikuti pesanan.</h2>
            <p>Empat target yang dipakai sebagai dasar model bisnis, bukan hasil pengukuran lapangan.</p>
          </div>
          <dl className="dampak">
            <div>
              <dt>1 hari</dt>
              <dd>
                dari panen ke dapur
                <em>Sumber: studi kasus PanenLangsung</em>
              </dd>
            </div>
            <div>
              <dt>+20%</dt>
              <dd>
                margin bersih petani
                <em>Sumber: studi kasus PanenLangsung</em>
              </dd>
            </div>
            <div>
              <dt>Mendekati 0%</dt>
              <dd>
                limbah, dari sebelumnya 30%
                <em>Sumber: studi kasus PanenLangsung</em>
              </dd>
            </div>
            <div>
              <dt>15%</dt>
              <dd>
                komisi dari nilai transaksi
                <em>Sumber: studi kasus PanenLangsung</em>
              </dd>
            </div>
          </dl>
        </section>

        <section className="sec" aria-labelledby="judul-gagal">
          <div className="sec-kepala">
            <h2 id="judul-gagal">Kegagalan startup jarang soal kode.</h2>
            <p>Empat penyebab yang paling sering dicatat, dan yang terbesar bukan soal teknologi.</p>
          </div>
          <div className="gagal">
            <div className="gagal-baris">
              <span className="gagal-label">Tidak ada kebutuhan pasar</span>
              <span className="gagal-angka">42%</span>
              <span className="gagal-rel" aria-hidden="true">
                <span style={{ width: '42%' }} />
              </span>
            </div>
            <div className="gagal-baris">
              <span className="gagal-label">Kehabisan modal</span>
              <span className="gagal-angka">29%</span>
              <span className="gagal-rel" aria-hidden="true">
                <span style={{ width: '29%' }} />
              </span>
            </div>
            <div className="gagal-baris">
              <span className="gagal-label">Tim yang buruk</span>
              <span className="gagal-angka">23%</span>
              <span className="gagal-rel" aria-hidden="true">
                <span style={{ width: '23%' }} />
              </span>
            </div>
            <div className="gagal-baris">
              <span className="gagal-label">Faktor lain</span>
              <span className="gagal-angka">6%</span>
              <span className="gagal-rel" aria-hidden="true">
                <span style={{ width: '6%' }} />
              </span>
            </div>
          </div>
          <p className="sumber">Sumber: riset CB Insights, dikutip dalam studi kasus PanenLangsung.</p>
        </section>

        <section className="sec" id="pilar" aria-labelledby="judul-pilar">
          <div className="sec-kepala">
            <h2 id="judul-pilar">Tiga pilar yang menjaga urutan kerja.</h2>
            <p>Bukan prinsip di slide pembuka, melainkan alasan kenapa demo ini kecil dan bisa diuji.</p>
          </div>
          <div className="pilar">
            <div>
              <h3>Obsesi pada solusi</h3>
              <p>
                Masalahnya bukan aplikasi yang belum ada, melainkan panen yang tidak cocok dengan
                permintaan. Teknologi hanya alat bantu.
              </p>
            </div>
            <div>
              <h3>Validasi berlapis</h3>
              <p>
                Setiap asumsi diuji di lapangan sebelum dibangun. Salah membaca pasar lebih mahal
                daripada salah di tahap rancangan.
              </p>
            </div>
            <div>
              <h3>Iterasi lincah</h3>
              <p>
                MVP dijalankan lebih dulu, metrik dibaca, kritik dikumpulkan, lalu diperbaiki di
                putaran berikutnya.
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="penutup" aria-labelledby="judul-demo">
        <div className="wrap">
          <h2 id="judul-demo">Jalankan alurnya sendiri.</h2>
          <p>
            Demo memuat tiga peran: petani memasang panen, katering memesan, admin memverifikasi
            dan menutup pengiriman. Semua angka di dashboard dihitung dari pesanan yang kamu buat,
            bukan dari angka yang ditempel.
          </p>
          <a className="tombol tombol-teal" href="#/demo">
            Masuk ke demo
          </a>
          <p className="kaki">
            PanenLangsung adalah studi kasus akademik Kewirausahaan Digital Kelompok 1. Nama petani,
            katering, dan kurir fiktif. Tidak ada pembayaran, autentikasi, atau server. Data hanya
            tersimpan di peramban ini dan bisa direset dari menu Pengaturan.
          </p>
        </div>
      </section>
    </>
  );
}
