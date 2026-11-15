import { useState } from 'react';
import { PASAR, formatTanggal, hargaPetani, rupiah, selisihPetani, tambahHari, hariIni } from './data.js';
import { Beta, Ikon } from './ui.jsx';
import Kalkulator from './Kalkulator.jsx';

const contoh = [
  {
    komoditas: 'Bayam',
    grade: 'A',
    asal: 'Cisarua, Bogor',
    hargaPlatform: 7100,
    hargaTengkulak: 5000,
    tanggal: tambahHari(hariIni(), 1),
  },
  {
    komoditas: 'Wortel',
    grade: 'A',
    asal: 'Lembang, Bandung Barat',
    hargaPlatform: 12800,
    hargaTengkulak: 9000,
    tanggal: tambahHari(hariIni(), 2),
  },
  {
    komoditas: 'Cabai merah',
    grade: 'A',
    asal: 'Cikajang, Garut',
    hargaPlatform: 54000,
    hargaTengkulak: 38000,
    tanggal: tambahHari(hariIni(), 1),
  },
];

const peranJelajah = {
  petani: {
    nama: 'Petani',
    ringkas: 'Yang menentukan volume, grade, dan waktu petik.',
    fitur: [
      'Pasang panen dengan volume, grade A atau B, jendela panen, dan catatan pengemasan.',
      'Harga platform, bagian petani setelah komisi 15%, dan harga tengkulak tampil berdampingan.',
      'Sisa volume dan potensi pendapatan dihitung ulang setiap kali pembeli FnB memesan.',
      'Katalog bisa dicari dan disaring per grade, jadi panen tidak tenggelam di daftar panjang.',
    ],
  },
  fnb: {
    nama: 'FnB',
    ringkas: 'Yang memesan sebelum petani memetik.',
    fitur: [
      'Pencarian komoditas, petani, atau kebun, lalu urutkan menurut harga, volume, atau selisih.',
      'Volume pesanan dibatasi sisa panen, dengan ringkasan biaya dan perkiraan tiba satu hari setelah panen.',
      'Pesanan dilacak per status sampai bukti terima, termasuk nama kurir dan urutan rute.',
      'Riwayat setiap perubahan tercatat lengkap dengan waktunya, bisa dibuka per pesanan.',
    ],
  },
  admin: {
    nama: 'Admin',
    ringkas: 'Yang menjaga antrean dan rute tetap waras.',
    fitur: [
      'Antrean verifikasi menampilkan usia tunggu tiap pesanan, bukan sekadar daftar.',
      'Penolakan wajib disertai alasan, dan alasannya tersimpan di riwayat pesanan.',
      'Penugasan kurir memeriksa kapasitas kendaraan pada tanggal berangkat yang sama.',
      'Rute tersusun otomatis per kurir per hari, lengkap dengan total muatan.',
    ],
  },
  kurir: {
    nama: 'Kurir',
    ringkas: 'Yang menutup alur dengan bukti, bukan klaim.',
    fitur: [
      'Empat langkah tercatat: ditugaskan, diambil di kebun, di jalan, terkirim.',
      'Serah terima mencatat nama penerima, waktu, jumlah krat, dan catatan kondisi barang.',
      'Laporan gagal antar wajib beralasan, dan pesanan tetap terlihat oleh admin.',
      'Rute diurutkan per titik dengan muatan yang dihitung terhadap kapasitas kendaraan.',
    ],
  },
};

function PapanTab() {
  const [tab, setTab] = useState('papan');
  return (
    <div className="papan-beta">
      <div className="papan-tab" role="tablist" aria-label="Pratinjau aplikasi">
        {[
          ['papan', 'Papan panen'],
          ['rute', 'Rute hari ini'],
          ['bukti', 'Serah terima'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="papan-tab-tombol"
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'papan' ? (
        <div className="papan-isi" role="tabpanel">
          <div className="papan-kepala">
            <span className="label-kecil">Panen besok</span>
            <span className="label-kecil">Data contoh</span>
          </div>
          {contoh.map((t) => (
            <div className="papan-baris" key={t.komoditas}>
              <div>
                <strong>{t.komoditas}</strong>
                <span className="label-kecil">
                  {t.asal} · grade {t.grade} · panen {formatTanggal(t.tanggal)}
                </span>
              </div>
              <div className="papan-angka">
                <strong>{rupiah(hargaPetani(t.hargaPlatform))}</strong>
                <span className="label-kecil">tengkulak {rupiah(t.hargaTengkulak)}</span>
              </div>
              <div className="papan-selisih">
                +{rupiah(selisihPetani({ hargaPlatform: t.hargaPlatform, hargaTengkulak: t.hargaTengkulak }))}
              </div>
            </div>
          ))}
          <p className="papan-kaki">
            Bagian petani = harga platform x 85%. Selisih dihitung terhadap harga tengkulak.
          </p>
        </div>
      ) : null}

      {tab === 'rute' ? (
        <div className="papan-isi" role="tabpanel">
          <div className="papan-kepala">
            <span className="label-kecil">Rute 17 November</span>
            <span className="papan-kurir">Asep, motor roda tiga</span>
          </div>
          <ol className="mini-rute">
            {[
              ['07.10', 'Cisarua', 'Muat 60 kg bayam, 2 krat'],
              ['08.40', 'Bogor Utara', 'Dapur Bu Sartika, serah terima'],
              ['09.30', 'Bogor Tengah', 'Kedai Sambal, 20 kg cabai'],
            ].map(([jam, tempat, isi], i) => (
              <li key={tempat}>
                <span className="mini-jam">{jam}</span>
                <span className="mini-titik" aria-hidden="true" />
                <div>
                  <strong>{tempat}</strong>
                  <span className="label-kecil">{isi}</span>
                </div>
                <span className="mini-nomor">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
          <div className="mini-muatan">
            <span className="label-kecil">Muatan 80 dari 120 kg</span>
            <div className="progres">
              <span style={{ width: '67%' }} />
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'bukti' ? (
        <div className="papan-isi" role="tabpanel">
          <div className="papan-kepala">
            <span className="label-kecil">Bukti terima</span>
            <span className="papan-kurir">P-01 · Bayam 60 kg</span>
          </div>
          <div className="bukti-contoh">
            <div>
              <span className="label-kecil">Diterima oleh</span>
              <strong>Ibu Ratna</strong>
            </div>
            <div>
              <span className="label-kecil">Waktu</span>
              <strong>08.42, 17 November</strong>
            </div>
            <div>
              <span className="label-kecil">Kondisi</span>
              <p>Lengkap 3 krat, tidak ada yang layu. Suhu box terjaga.</p>
            </div>
            <div className="bukti-garis">
              <span />
              <span className="label-kecil">Tanda terima dicatat oleh kurir</span>
            </div>
          </div>
          <p className="papan-kaki">
            Bukti tersimpan bersama riwayat pesanan dan bisa dibuka FnB maupun admin.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Alur() {
  const langkah = [
    ['Petani', 'Pasang panen', 'Volume, grade, jendela panen, harga platform dan harga tengkulak.'],
    ['FnB', 'Pre-order', 'Pilih komoditas, isi volume dalam batas sisa, lihat komisi dan perkiraan tiba.'],
    ['Admin', 'Verifikasi dan tugaskan', 'Antrean berusia waktu, penolakan beralasan, kapasitas kurir diperiksa.'],
    ['Kurir', 'Ambil dan antar', 'Empat langkah, urutan rute, bukti terima berisi nama dan catatan.'],
    ['Sistem', 'Hitung otomatis', 'GMV, komisi 15%, margin petani, dan limbah dihitung dari data yang sama.'],
  ];
  return (
    <ol className="alur-lima">
      {langkah.map(([peran, judul, isi], i) => (
        <li key={judul}>
          <div className="alur-kepala">
            <span className="alur-nomor">{String(i + 1).padStart(2, '0')}</span>
            <span className="alur-peran">{peran}</span>
          </div>
          <h3>{judul}</h3>
          <p>{isi}</p>
        </li>
      ))}
    </ol>
  );
}

export default function Landing() {
  const [peran, setPeran] = useState('petani');
  const detail = peranJelajah[peran];

  return (
    <>
      <header className="situs">
        <div className="wrap situs-baris">
          <a className="merek" href="#/">
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
          <nav className="situs-nav" aria-label="Navigasi halaman">
            <a href="#alur">Alur</a>
            <a href="#kalkulator">Kalkulator</a>
            <a href="#peran">Peran</a>
            <a href="#faq">Tanya jawab</a>
            <a href="#tentang">Tentang</a>
            <a className="tombol tombol-utama tombol-kecil" href="#/app">
              Buka aplikasi
            </a>
          </nav>
        </div>
      </header>

      <section className="hero-gelap">
        <div className="hero-garis" aria-hidden="true">
          <svg viewBox="0 0 1440 640" preserveAspectRatio="none">
            <path d="M0 120c180 40 320-40 500 10s320 60 470 10 300-40 470 20" />
            <path d="M0 220c200 30 300-30 520 20s300 50 460 0 280-30 460 30" />
            <path d="M0 330c160 40 340-30 520 20s320 40 460-10 300-20 460 30" />
            <path d="M0 450c220 20 300-40 520 10s340 50 480 0 260-20 440 30" />
            <path d="M0 560c180 30 320-20 520 20s320 30 460-10 300-20 460 20" />
          </svg>
        </div>

        <div className="wrap hero-isi">
          <div className="hero-teks">
            <p className="hero-status">
              <span className="hero-kotak" aria-hidden="true" />
              Beta tertutup · gelombang pertama
            </p>
            <h1>
              Panen dipetik <span className="baris">setelah pesanan</span> masuk.
            </h1>
            <p className="hero-ringkas">
              PanenLangsung mempertemukan kelompok tani dengan restoran, kafe, dan katering lewat
              pre-order. Tiga sampai empat lapis tengkulak diganti satu alur yang bisa diperiksa
              dari dua sisi, sampai nama penerima barangnya.
            </p>
            <div className="hero-aksi">
              <a className="tombol tombol-teal" href="#/app">
                Buka aplikasi beta
                <Ikon nama="panah" ukuran={16} />
              </a>
              <a className="tombol tombol-garis-terang" href="#alur">
                Telusuri alurnya
              </a>
            </div>
            <p className="hero-catatan">
              Empat peran. Tanpa login. Data contoh tersimpan di peramban ini.
            </p>
          </div>

          <div className="hero-panel">
            <PapanTab />
          </div>
        </div>

      </section>

      <section className="pasar" aria-label="Harga pasar hari ini">
        <div className="wrap pasar-isi">
          <div className="pasar-kepala">
            <p className="bagian-tanda">Harga pasar</p>
            <p className="pasar-catatan">
              Acuan {PASAR.sumber} · diperbarui {formatTanggal(PASAR.tanggal)}
            </p>
          </div>
          <dl className="pasar-daftar">
            {PASAR.daftar.slice(0, 6).map((d) => (
              <div key={d.nama}>
                <dt>{d.nama}</dt>
                <dd>
                  {rupiah(d.harga)}
                  <span>/kg</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main>
        <section className="bagian" id="masalah" aria-labelledby="judul-masalah">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Masalah</p>
              <h2 id="judul-masalah">Rantai yang mahal di dua ujung.</h2>
              <p className="bagian-pimpin">
                Petani menerima sedikit, dapur membayar banyak, dan selisihnya habis di perjalanan.
                Empat angka di bawah menjelaskan mengapa.
              </p>
            </div>
            <dl className="masalah-daftar">
              <div>
                <dt>3 sampai 4</dt>
                <dd>
                  <strong>lapis tengkulak</strong> antara kebun dan dapur. Setiap lapis menambah
                  biaya, waktu, dan titik di mana sayur bisa terlambat.
                </dd>
              </div>
              <div>
                <dt>30%</dt>
                <dd>
                  <strong>hasil panen rusak di perjalanan</strong> karena dipetik tanpa tahu berapa
                  yang sudah dipesan. Biaya produksinya sudah keluar sejak benih ditanam.
                </dd>
              </div>
              <div>
                <dt>3 sampai 4 hari</dt>
                <dd>
                  <strong>dari panen sampai dapur.</strong> Setiap hari di rantai itu mengurangi
                  kesegaran, dan dapur tetap membayar penuh.
                </dd>
              </div>
              <div>
                <dt>Tanpa pembanding</dt>
                <dd>
                  <strong>petani menerima harga pengepul apa adanya,</strong> karena tidak ada angka
                  lain yang bisa dibaca sebelum ia menjual.
                </dd>
              </div>
            </dl>
            <p className="sumber">
              Sumber: riset lapangan PanenLangsung, 2025.
            </p>
          </div>
        </section>

        <section className="bagian bagian-alur" id="alur" aria-labelledby="judul-alur">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Alur</p>
              <h2 id="judul-alur">Lima langkah, satu data.</h2>
              <p className="bagian-pimpin">
                Setiap langkah mengubah data yang sama, jadi tidak ada angka yang dihitung ulang
                manual oleh orang berbeda.
              </p>
            </div>
            <Alur />
            <div className="alur-kurir">
              <div className="alur-kurir-teks">
                <p className="bagian-tanda">Kurir</p>
                <h3>Serah terima yang bisa diaudit.</h3>
                <p>
                  Kurir tidak hanya menekan tombol tiba. Ia mencatat nama penerima, jumlah krat,
                  kondisi barang, dan waktu. Kalau gagal, alasannya wajib ditulis dan tetap terlihat
                  oleh admin.
                </p>
                <ul className="centang-daftar">
                  <li>Empat langkah: ditugaskan, diambil, di jalan, terkirim.</li>
                  <li>Muatan dihitung terhadap kapasitas kendaraan pada tanggal yang sama.</li>
                  <li>Bukti terima tersimpan di riwayat pesanan, bukan di pesan pribadi.</li>
                </ul>
              </div>
              <div className="alur-kurir-kartu">
                <div className="kartu-atas">
                  <span className="label-kecil">Tugas K-01</span>
                  <span className="bidik bidik-dalam_perjalanan">Di jalan</span>
                </div>
                <h4>Dapur Bu Sartika</h4>
                <p className="label-kecil">Bayam 60 kg · titik 1 dari 3 · Bogor Utara</p>
                <ol className="langkah langkah-contoh">
                  <li className="langkah-selesai">
                    <span className="langkah-nomor">1</span>Ditugaskan
                  </li>
                  <li className="langkah-selesai">
                    <span className="langkah-nomor">2</span>Diambil
                  </li>
                  <li className="langkah-aktif">
                    <span className="langkah-nomor">3</span>Di jalan
                  </li>
                  <li>
                    <span className="langkah-nomor">4</span>Terkirim
                  </li>
                </ol>
                <p className="label-kecil">
                  Bukti sebelumnya: Ibu Ratna, 4 krat, tidak ada yang rusak.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bagian" id="kalkulator" aria-labelledby="judul-kalkulator">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Kalkulator</p>
              <h2 id="judul-kalkulator">Hitung sendiri, jangan percaya angka kami.</h2>
              <p className="bagian-pimpin">
                Ubah komoditas dan volume. Semua angka dihitung langsung dari harga platform dan
                harga tengkulak, tanpa pembulatan tersembunyi.
              </p>
            </div>
            <Kalkulator />
          </div>
        </section>

        <section className="bagian" id="peran" aria-labelledby="judul-peran">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Peran</p>
              <h2 id="judul-peran">Empat meja kerja, satu kebenaran data.</h2>
              <p className="bagian-pimpin">
                Pilih peran untuk melihat apa yang benar-benar bisa ia lakukan di aplikasi beta.
              </p>
            </div>

            <div className="peran-jelajah">
              <div className="peran-tab" role="tablist" aria-label="Peran di aplikasi">
                {Object.entries(peranJelajah).map(([id, p]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={peran === id}
                    className="peran-tab-tombol"
                    onClick={() => setPeran(id)}
                  >
                    <span className="peran-tab-nama">{p.nama}</span>
                    <span className="label-kecil">{p.ringkas}</span>
                  </button>
                ))}
              </div>
              <div className="peran-isi" role="tabpanel">
                <h3>{detail.nama}</h3>
                <ul className="fitur-daftar">
                  {detail.fitur.map((f) => (
                    <li key={f}>
                      <Ikon nama="tanda" ukuran={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a className="tombol tombol-kecil" href="#/app">
                  Coba sebagai {detail.nama}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bagian bagian-gelap" id="dampak" aria-labelledby="judul-dampak">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Dampak</p>
              <h2 id="judul-dampak">Yang berubah kalau panen mengikuti pesanan.</h2>
              <p className="bagian-pimpin">
                Empat target yang dipakai sebagai dasar model bisnis, bukan hasil pengukuran
                lapangan.
              </p>
            </div>
            <dl className="dampak-angka">
              <div>
                <dt>1 hari</dt>
                <dd>
                  distribusi, dari sebelumnya 3 sampai 4 hari
                  <em>Target internal PanenLangsung</em>
                </dd>
              </div>
              <div>
                <dt>+20%</dt>
                <dd>
                  margin bersih petani dibanding menjual ke tengkulak
                  <em>Target internal PanenLangsung</em>
                </dd>
              </div>
              <div>
                <dt>Mendekati 0%</dt>
                <dd>
                  limbah, dari sebelumnya 30% panen rusak
                  <em>Target internal PanenLangsung</em>
                </dd>
              </div>
              <div>
                <dt>15%</dt>
                <dd>
                  take-rate dari setiap transaksi B2B yang selesai
                  <em>Target internal PanenLangsung</em>
                </dd>
              </div>
            </dl>

            <div className="gagal-blok">
              <div>
                <h3>Kegagalan startup jarang soal kode.</h3>
                <p>
                  Riset CB Insights mencatat empat penyebab utama. Yang terbesar bukan teknologi,
                  melainkan produk yang tidak dibutuhkan pasar.
                </p>
                <p className="sumber sumber-terang">
                  Sumber: riset CB Insights, dikutip dalam riset internal PanenLangsung.
                </p>
              </div>
              <div className="gagal-grafik">
                {[
                  ['Tidak ada kebutuhan pasar', 42],
                  ['Kehabisan modal', 29],
                  ['Tim yang buruk', 23],
                  ['Faktor lain', 6],
                ].map(([label, n]) => (
                  <div className="gagal-baris" key={label}>
                    <div className="gagal-label">
                      <span>{label}</span>
                      <strong>{n}%</strong>
                    </div>
                    <div className="gagal-rel">
                      <span style={{ width: `${n}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bagian" aria-labelledby="judul-pilar">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Cara kerja</p>
              <h2 id="judul-pilar">Tiga pilar yang menjaga urutan kerja.</h2>
              <p className="bagian-pimpin">
                Bukan prinsip di slide pembuka, melainkan alasan kenapa rilis ini kecil dan bisa
                diuji.
              </p>
            </div>
            <div className="pilar-tiga">
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
                  Wawancara 30 ketua kelompok tani dan 15 pengelola FnB dijalankan sebelum
                  aplikasi dibangun. MVP awal cukup dengan WhatsApp Business dan Google Sheets.
                </p>
              </div>
              <div>
                <h3>Iterasi lincah</h3>
                <p>
                  10 restoran pertama mendapat free-shipping untuk menguji kebiasaan memesan
                  lebih awal, bukan untuk membeli testimoni. Setelah product-market fit, rencananya
                  seed funding, logistik cerdas, dan ekspansi ke 10 kota.
                </p>
              </div>
            </div>
            <p className="sumber">Sumber: rencana bisnis PanenLangsung, tahap MVP sampai ekspansi.</p>
          </div>
        </section>
        <section className="bagian" id="faq" aria-labelledby="judul-faq">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Tanya jawab</p>
              <h2 id="judul-faq">Yang biasanya ditanya dapur dan petani.</h2>
              <p className="bagian-pimpin">
                Jawaban singkat untuk keberatan yang paling sering muncul sebelum orang mau mencoba.
              </p>
            </div>
            <div className="faq">
              {[
                [
                  'Minimal pesanan berapa?',
                  'Mulai 20 kg per pesanan, dan boleh gabung beberapa komoditas dalam satu pengiriman.',
                ],
                [
                  'Kapan harus pesan?',
                  'Sebelum pukul 15.00 untuk dipetik besok pagi. Pesanan setelah jam itu masuk jadwal petik lusa.',
                ],
                [
                  'Bagaimana kalau barang kurang atau rusak?',
                  'Ajukan klaim dari halaman Pesanan maksimal 2 jam setelah serah terima. Klaim diperiksa admin dan keputusannya tercatat.',
                ],
                [
                  'Siapa menanggung ongkos kirim?',
                  'Ongkir dihitung per rute dan sudah terlihat sebelum pesanan dikirim. Tidak ada biaya tersembunyi.',
                ],
                [
                  'Pembayarannya bagaimana?',
                  'Mitra baru membayar di tempat saat serah terima. Setelah tiga pesanan lancar, tersedia termin 7 hari.',
                ],
                [
                  'Petani dibayar kapan?',
                  'Bagian petani 85% dari nilai transaksi, dicairkan setiap Senin untuk pesanan yang sudah tiba.',
                ],
                [
                  'Apakah harga di sini lebih mahal dari pasar?',
                  'Harga platform dibandingkan langsung dengan harga tengkulak dan harga pasar induk di setiap baris katalog. Selisihnya ditampilkan apa adanya.',
                ],
              ].map(([tanya, jawab]) => (
                <details className="faq-item" key={tanya}>
                  <summary>
                    {tanya}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{jawab}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bagian" id="tentang" aria-labelledby="judul-tentang">
          <div className="wrap">
            <div className="bagian-kepala">
              <p className="bagian-tanda">Tentang</p>
              <h2 id="judul-tentang">Dibangun dari satu masalah yang sama.</h2>
              <p className="bagian-pimpin">
                PanenLangsung adalah layanan pre-order hasil panen untuk bisnis makanan dan minuman
                di Jabodetabek. Kami bekerja langsung dengan kelompok tani, tanpa lapis tengkulak.
              </p>
            </div>
            <div className="tentang">
              <div className="tentang-teks">
                <p>
                  Modelnya sederhana: dapur memesan lebih dulu, petani memetik sesuai pesanan, kurir
                  mengantar di hari yang sama. Tidak ada hasil panen yang dipetik tanpa pembeli, dan
                  tidak ada harga yang ditentukan sepihak.
                </p>
                <p>
                  Versi ini masih beta tertutup. Data di aplikasi adalah contoh, bukan transaksi
                  sungguhan, dan seluruh keadaan tersimpan di peramban masing-masing.
                </p>
              </div>
              <div className="tentang-kontak">
                <div>
                  <span className="label-kecil">WhatsApp</span>
                  <strong>0812-9000-1234</strong>
                </div>
                <div>
                  <span className="label-kecil">Email</span>
                  <strong>halo@panenlangsung.id</strong>
                </div>
                <div>
                  <span className="label-kecil">Alamat</span>
                  <strong>Bogor, Jawa Barat</strong>
                </div>
                <div>
                  <span className="label-kecil">Jam operasional</span>
                  <strong>Senin sampai Sabtu, 06.00–18.00</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <section className="penutup" aria-labelledby="judul-tutup">
        <div className="wrap penutup-isi">
          <div>
            <p className="bagian-tanda bagian-tanda-terang">Beta tertutup</p>
            <h2 id="judul-tutup">Coba alurnya dari sisi mana pun.</h2>
            <p>
              Aplikasi beta memuat empat peran, delapan baris panen contoh, dan dua belas pesanan yang sudah berjalan. Semua angka dihitung dari data yang kamu ubah sendiri.
            </p>
          </div>
          <div className="penutup-aksi">
            <a className="tombol tombol-teal" href="#/app">
              Buka aplikasi beta
              <Ikon nama="panah" ukuran={16} />
            </a>
            <p className="hero-catatan">
              Tanpa login, tanpa server. Data contoh bisa direset dari Pengaturan.
            </p>
          </div>
        </div>
        <div className="wrap kaki">
          <span>
            PanenLangsung beta tertutup. Nama petani, dapur, dan kurir di aplikasi ini adalah contoh,
            bukan mitra sungguhan.
          </span>
          <span>Beta 0.9 · {formatTanggal(hariIni())}</span>
        </div>
      </section>
    </>
  );
}
