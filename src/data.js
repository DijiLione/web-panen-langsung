export const KUNCI = 'panenlangsung:v4';
export const KOMISI = 0.15;

export const STATUS = {
  TERSEDIA: 'tersedia',
  MENUNGGU: 'menunggu_verifikasi',
  DIVERIFIKASI: 'diverifikasi',
  BERANGKAT: 'berangkat',
  TIBA: 'tiba',
  DIBATALKAN: 'dibatalkan',
};

export const TAHAP = {
  BELUM: 'belum',
  DITUGASKAN: 'ditugaskan',
  DIAMBIL: 'diambil',
  JALAN: 'dalam_perjalanan',
  TERKIRIM: 'terkirim',
  GAGAL: 'gagal',
};

export const LABEL = {
  tersedia: 'Tersedia',
  habis: 'Habis dipesan',
  menunggu_verifikasi: 'Menunggu verifikasi',
  diverifikasi: 'Terverifikasi',
  berangkat: 'Dalam pengiriman',
  tiba: 'Tiba',
  dibatalkan: 'Dibatalkan',
  belum: 'Belum ditugaskan',
  ditugaskan: 'Ditugaskan',
  diambil: 'Diambil di kebun',
  dalam_perjalanan: 'Di jalan',
  terkirim: 'Terkirim',
  gagal: 'Gagal antar',
};

export const GRADE = {
  A: 'Grade A',
  B: 'Grade B',
};

export const PERAN = [
  {
    id: 'petani',
    nama: 'Petani',
    ringkas: 'Pasang panen, pantau sisa volume, lihat harga pembanding.',
    tabAwal: 'panen',
  },
  {
    id: 'fnb',
    nama: 'FnB',
    ringkas: 'Pesan sebelum petik, lacak kiriman sampai diterima.',
    tabAwal: 'katalog',
  },
  {
    id: 'admin',
    nama: 'Admin',
    ringkas: 'Verifikasi, tugaskan kurir, jaga rute tetap satu hari.',
    tabAwal: 'dashboard',
  },
  {
    id: 'kurir',
    nama: 'Kurir',
    ringkas: 'Ambil di kebun, antar sesuai urutan, catat bukti terima.',
    tabAwal: 'tugas',
  },
];

const pad = (n) => String(n).padStart(2, '0');

export function isoLokal(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function hariIni() {
  return isoLokal(new Date());
}

export function tambahHari(iso, jumlah) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + jumlah);
  return isoLokal(dt);
}

export function formatTanggal(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTanggalPendek(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function formatWaktu(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatJam(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export function angka(n) {
  return nf.format(Math.round(n || 0));
}

export function rupiah(n) {
  return `Rp${angka(n)}`;
}

export function persen(n, digit = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  return `${n.toFixed(digit).replace('.', ',')}%`;
}

export function kg(n) {
  return `${angka(n)} kg`;
}

export const hargaPetani = (hargaPlatform) => Math.round(hargaPlatform * (1 - KOMISI));

export const RASIO_TENGKULAK = 0.75;

export const perkiraanTengkulak = (hargaPasar) =>
  Math.max(0, Math.round((hargaPasar * RASIO_TENGKULAK) / 100) * 100);

export const PASAR = {
  sumber: 'Pasar Induk Kramat Jati',
  tanggal: hariIni(),
  daftar: [
    { nama: 'Bayam', harga: 6500 },
    { nama: 'Kangkung', harga: 5400 },
    { nama: 'Sawi hijau', harga: 7200 },
    { nama: 'Wortel', harga: 11500 },
    { nama: 'Tomat', harga: 9800 },
    { nama: 'Cabai merah', harga: 47000 },
    { nama: 'Buncis', harga: 8200 },
    { nama: 'Selada air', harga: 10500 },
    { nama: 'Kentang', harga: 13000 },
    { nama: 'Kol', harga: 6000 },
    { nama: 'Terong', harga: 8500 },
    { nama: 'Timun', harga: 7000 },
    { nama: 'Bawang merah', harga: 32000 },
    { nama: 'Bawang putih', harga: 38000 },
    { nama: 'Jahe', harga: 25000 },
  ],
};

const ALIAS_PASAR = {
  cabe: 'cabai merah',
  'cabe merah': 'cabai merah',
  cabai: 'cabai merah',
  lombok: 'cabai merah',
  kangkong: 'kangkung',
  selada: 'selada air',
  sawi: 'sawi hijau',
  terung: 'terong',
  mentimun: 'timun',
  kubis: 'kol',
  kentang: 'kentang',
};

export function kunciPasar(nama) {
  const bersih = String(nama || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  return ALIAS_PASAR[bersih] || bersih;
}

export function acuanPasar(nama) {
  const kunci = kunciPasar(nama);
  if (!kunci) return null;
  return PASAR.daftar.find((d) => d.nama.toLowerCase() === kunci) || null;
}
export const selisihPetani = (t) => hargaPetani(t.hargaPlatform) - t.hargaTengkulak;
export const perkiraanTiba = (t) => tambahHari(t.tanggalPanen, 1);

export function sudahBerangkat(p) {
  return p.jejak.some((j) => j.status === STATUS.BERANGKAT || j.status === STATUS.TIBA);
}

export function volumeTerpakai(daftarPesanan, tanamanId) {
  return daftarPesanan
    .filter(
      (p) =>
        p.tanamanId === tanamanId &&
        (p.status !== STATUS.DIBATALKAN || sudahBerangkat(p))
    )
    .reduce((total, p) => total + p.volume, 0);
}

export function sisaVolume(tanaman, daftarPesanan) {
  return Math.max(0, tanaman.volume - volumeTerpakai(daftarPesanan, tanaman.id));
}

export function sinkronPesanan(state) {
  const pesanan = state.pesanan.map((p) => {
    const tiba = p.status === STATUS.TIBA;
    const terkirim = p.tahapKurir === TAHAP.TERKIRIM;
    const gagal = p.tahapKurir === TAHAP.GAGAL;

    if (tiba && !terkirim && !gagal) {
      const waktu = p.jejak?.[p.jejak.length - 1]?.waktu || new Date().toISOString();
      return {
        ...p,
        tahapKurir: TAHAP.TERKIRIM,
        bukti:
          p.bukti || {
            penerima: 'Ditutup admin',
            catatan: 'Bukti serah terima tidak tercatat',
            waktu,
          },
        jejakKurir: [
          ...(p.jejakKurir || []),
          { tahap: TAHAP.TERKIRIM, waktu, catatan: 'Ditutup admin' },
        ],
      };
    }

    if (terkirim && !tiba && p.status !== STATUS.DIBATALKAN) {
      const waktu = p.jejakKurir?.[p.jejakKurir.length - 1]?.waktu || new Date().toISOString();
      const adaJejak = (p.jejak || []).some((j) => j.status === STATUS.TIBA);
      return {
        ...p,
        status: STATUS.TIBA,
        jejak: adaJejak ? p.jejak : [...p.jejak, { status: STATUS.TIBA, waktu }],
      };
    }

    return p;
  });

  return { ...state, pesanan };
}

export function sinkronTanaman(state) {
  const tanaman = state.tanaman.map((t) => ({
    ...t,
    status: sisaVolume(t, state.pesanan) > 0 ? STATUS.TERSEDIA : 'habis',
  }));
  return { ...state, tanaman };
}

export function dataAwal() {
  const sekarang = Date.now();
  const jamLalu = (h) => new Date(sekarang - h * 3600 * 1000).toISOString();
  const besok = tambahHari(hariIni(), 1);
  const lusa = tambahHari(hariIni(), 2);
  const kemarin = tambahHari(hariIni(), -1);
  const duaHariLalu = tambahHari(hariIni(), -2);

  const kurir = [
    { id: 'K-01', nama: 'Asep Saepudin', kendaraan: 'Motor roda tiga', kapasitas: 120, area: 'Bogor dan Ciawi', aktif: true },
    { id: 'K-02', nama: 'Rina Marlina', kendaraan: 'Mobil boks', kapasitas: 400, area: 'Bandung dan Lembang', aktif: true },
    { id: 'K-03', nama: 'Dadang Hermawan', kendaraan: 'Pikap terbuka', kapasitas: 800, area: 'Jabodetabek', aktif: true },
  ];

  const mentah = [
    { komoditas: 'Bayam', grade: 'A', volume: 100, hargaPlatform: 7100, hargaTengkulak: 5000, tanggalPanen: hariIni(), jendela: 'Pagi, 04.00 sampai 07.00', asalKebun: 'Cisarua, Bogor', petani: 'Kelompok Tani Sumber Rejeki', catatan: 'Daun lebar, ikat 250 gram.' },
    { komoditas: 'Kangkung', grade: 'A', volume: 90, hargaPlatform: 6400, hargaTengkulak: 4500, tanggalPanen: duaHariLalu, jendela: 'Pagi, 04.00 sampai 07.00', asalKebun: 'Cisarua, Bogor', petani: 'Kelompok Tani Sumber Rejeki', catatan: 'Ditiriskan sebelum dikirim.' },
    { komoditas: 'Wortel', grade: 'A', volume: 140, hargaPlatform: 12800, hargaTengkulak: 9000, tanggalPanen: duaHariLalu, jendela: 'Pagi, 05.00 sampai 08.00', asalKebun: 'Lembang, Bandung Barat', petani: 'Gapoktan Lembang Makmur', catatan: 'Umbi sedang, tanpa retak.' },
    { komoditas: 'Tomat', grade: 'B', volume: 150, hargaPlatform: 10600, hargaTengkulak: 7500, tanggalPanen: besok, jendela: 'Siang, 10.00 sampai 13.00', asalKebun: 'Cikajang, Garut', petani: 'Kelompok Tani Cikajang Hijau', catatan: 'Grade B untuk saus dan sup, kematangan 80 persen.' },
    { komoditas: 'Cabai merah', grade: 'A', volume: 60, hargaPlatform: 54000, hargaTengkulak: 38000, tanggalPanen: hariIni(), jendela: 'Pagi, 05.00 sampai 07.00', asalKebun: 'Cikajang, Garut', petani: 'Kelompok Tani Cikajang Hijau', catatan: 'Sortir manual, tangkai dipotong pendek.' },
    { komoditas: 'Sawi hijau', grade: 'A', volume: 100, hargaPlatform: 8500, hargaTengkulak: 6000, tanggalPanen: hariIni(), jendela: 'Pagi, 04.30 sampai 07.30', asalKebun: 'Lembang, Bandung Barat', petani: 'Gapoktan Lembang Makmur', catatan: 'Ukuran seragam, 3 sampai 4 lembar luar.' },
    { komoditas: 'Selada air', grade: 'A', volume: 80, hargaPlatform: 12000, hargaTengkulak: 8500, tanggalPanen: duaHariLalu, jendela: 'Siang, 11.00 sampai 13.00', asalKebun: 'Cipanas, Cianjur', petani: 'Kelompok Tani Cipanas Segar', catatan: 'Dikemas keranjang berlubang.' },
    { komoditas: 'Buncis', grade: 'B', volume: 100, hargaPlatform: 9500, hargaTengkulak: 6800, tanggalPanen: hariIni(), jendela: 'Pagi, 05.00 sampai 08.00', asalKebun: 'Lembang, Bandung Barat', petani: 'Gapoktan Lembang Makmur', catatan: 'Grade B, panjang 12 sampai 15 cm.' },
  ];

  const tanaman = mentah.map((t, i) => ({ ...t, id: `T-${pad(i + 1)}`, status: STATUS.TERSEDIA }));
  const cari = (id) => tanaman.find((t) => t.id === id);

  const buat = (nomor, tanamanId, fnb, volume, status, opsi = {}) => {
    const t = cari(tanamanId);
    const nilai = volume * t.hargaPlatform;
    const kurirId = opsi.kurirId || '';
    const k = kurir.find((x) => x.id === kurirId);
    return {
      id: `P-${pad(nomor)}`,
      tanamanId,
      komoditas: t.komoditas,
      grade: t.grade,
      fnb,
      volume,
      nilai,
      komisi: nilai * KOMISI,
      bagianPetani: nilai * (1 - KOMISI),
      perkiraanTiba: tambahHari(t.tanggalPanen, 1),
      status,
      kurirId,
      kurir: k ? k.nama : '',
      jadwalBerangkat: opsi.jadwalBerangkat || '',
      urutanRute: opsi.urutanRute || 0,
      tahapKurir: opsi.tahapKurir || TAHAP.BELUM,
      bukti: opsi.bukti || null,
      buktiFnb: opsi.buktiFnb || null,
      alasanGagal: opsi.alasanGagal || '',
      alasanBatal: opsi.alasanBatal || '',
      catatanFnb: opsi.catatanFnb || '',
      klaim: opsi.klaim || null,
      jejak: opsi.jejak || [{ status, waktu: jamLalu(opsi.jam || 2) }],
      jejakKurir: opsi.jejakKurir || [],
    };
  };

  const pesanan = [
    buat(1, 'T-03', 'Kedai Rasa Ibu', 80, STATUS.TIBA, {
      klaim: {
        jenis: 'Kurang berat',
        berat: 6,
        catatan: 'Timbangan dapur 74 kg dari 80 kg.',
        waktu: jamLalu(16),
        status: 'menunggu',
      },
      kurirId: 'K-02',
      jadwalBerangkat: kemarin,
      urutanRute: 1,
      tahapKurir: TAHAP.TERKIRIM,
      bukti: { penerima: 'Ibu Ratna', catatan: 'Diterima lengkap, 4 krat, tidak ada yang rusak.', waktu: jamLalu(20) },
      buktiFnb: {
        penerima: 'Kedai Rasa Ibu',
        catatan: 'Empat krat diterima, isi sesuai surat jalan.',
        foto: '',
        waktu: jamLalu(18),
      },
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(54) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(50) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(30) },
        { status: STATUS.TIBA, waktu: jamLalu(20) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(32), catatan: 'Rina Marlina, mobil boks' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(28), catatan: 'Dimuat di Lembang' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(26), catatan: 'Berangkat ke dapur' },
        { tahap: TAHAP.TERKIRIM, waktu: jamLalu(20), catatan: 'Diterima Ibu Ratna' },
      ],
    }),
    buat(2, 'T-01', 'Dapur Bu Sartika', 60, STATUS.BERANGKAT, {
      kurirId: 'K-01',
      jadwalBerangkat: hariIni(),
      urutanRute: 1,
      tahapKurir: TAHAP.JALAN,
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(26) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(23) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(4) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(8), catatan: 'Asep Saepudin, motor roda tiga' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(5), catatan: 'Dimuat di Cisarua' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(4), catatan: 'Menuju Bogor Utara' },
      ],
    }),
    buat(3, 'T-05', 'Kedai Sambal Nusantara', 20, STATUS.MENUNGGU, {
      jam: 2,
      catatanFnb: 'Tolong pilih cabai yang tidak lembek.',
    }),
    buat(4, 'T-04', 'Dapur Bu Sartika', 30, STATUS.MENUNGGU, {
      jam: 1,
      catatanFnb: 'Untuk menu besok siang, kirim sebelum jam 09.00.',
    }),
    buat(5, 'T-04', 'Restoran Padang Sederhana', 50, STATUS.DIVERIFIKASI, {
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(24) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(22) },
      ],
    }),
    buat(6, 'T-06', 'Warung Sehat Bu Tuti', 20, STATUS.DIBATALKAN, {
      alasanBatal: 'Kualitas tidak sesuai grade A, dibatalkan sebelum berangkat.',
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(40) },
        { status: STATUS.DIBATALKAN, waktu: jamLalu(38) },
      ],
    }),
    buat(7, 'T-02', 'Kedai Rasa Ibu', 40, STATUS.TIBA, {
      kurirId: 'K-01',
      jadwalBerangkat: kemarin,
      urutanRute: 2,
      tahapKurir: TAHAP.TERKIRIM,
      bukti: { penerima: 'Pak Hendra', catatan: 'Dua krat, kondisi baik.', waktu: jamLalu(23) },
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(52) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(48) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(30) },
        { status: STATUS.TIBA, waktu: jamLalu(23) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(31), catatan: 'Asep Saepudin' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(27), catatan: 'Dimuat di Cisarua' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(25), catatan: 'Menuju dapur' },
        { tahap: TAHAP.TERKIRIM, waktu: jamLalu(23), catatan: 'Diterima Pak Hendra' },
      ],
    }),
    buat(8, 'T-06', 'Warung Sehat Bu Tuti', 60, STATUS.TIBA, {
      kurirId: 'K-02',
      jadwalBerangkat: hariIni(),
      urutanRute: 1,
      tahapKurir: TAHAP.TERKIRIM,
      bukti: { penerima: 'Bu Tuti', catatan: 'Lima krat, dua lembar luar dibuang.', waktu: jamLalu(5) },
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(18) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(16) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(9) },
        { status: STATUS.TIBA, waktu: jamLalu(5) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(10), catatan: 'Rina Marlina' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(8), catatan: 'Dimuat di Lembang' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(7), catatan: 'Menuju warung' },
        { tahap: TAHAP.TERKIRIM, waktu: jamLalu(5), catatan: 'Diterima Bu Tuti' },
      ],
    }),
    buat(9, 'T-08', 'Restoran Padang Sederhana', 100, STATUS.BERANGKAT, {
      kurirId: 'K-03',
      jadwalBerangkat: hariIni(),
      urutanRute: 1,
      tahapKurir: TAHAP.DIAMBIL,
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(20) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(18) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(6) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(7), catatan: 'Dadang Hermawan, pikap' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(2), catatan: 'Dimuat di Lembang' },
      ],
    }),
    buat(10, 'T-04', 'Kedai Rasa Ibu', 60, STATUS.DIVERIFIKASI, {
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(12) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(9) },
      ],
    }),
    buat(11, 'T-07', 'Kedai Sambal Nusantara', 40, STATUS.TIBA, {
      kurirId: 'K-03',
      jadwalBerangkat: kemarin,
      urutanRute: 1,
      tahapKurir: TAHAP.TERKIRIM,
      bukti: { penerima: 'Kak Dimas', catatan: 'Dua keranjang, ditiriskan.', waktu: jamLalu(21) },
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(56) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(52) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(31) },
        { status: STATUS.TIBA, waktu: jamLalu(21) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(33), catatan: 'Dadang Hermawan' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(29), catatan: 'Dimuat di Cipanas' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(27), catatan: 'Menuju kedai' },
        { tahap: TAHAP.TERKIRIM, waktu: jamLalu(21), catatan: 'Diterima Kak Dimas' },
      ],
    }),
    buat(12, 'T-05', 'Dapur Bu Sartika', 30, STATUS.TIBA, {
      kurirId: 'K-01',
      jadwalBerangkat: hariIni(),
      urutanRute: 2,
      tahapKurir: TAHAP.TERKIRIM,
      bukti: { penerima: 'Bu Sartika', catatan: 'Satu krat, cabai kering di luar.', waktu: jamLalu(2) },
      jejak: [
        { status: STATUS.MENUNGGU, waktu: jamLalu(16) },
        { status: STATUS.DIVERIFIKASI, waktu: jamLalu(14) },
        { status: STATUS.BERANGKAT, waktu: jamLalu(5) },
        { status: STATUS.TIBA, waktu: jamLalu(2) },
      ],
      jejakKurir: [
        { tahap: TAHAP.DITUGASKAN, waktu: jamLalu(6), catatan: 'Asep Saepudin' },
        { tahap: TAHAP.DIAMBIL, waktu: jamLalu(4), catatan: 'Dimuat di Cikajang' },
        { tahap: TAHAP.JALAN, waktu: jamLalu(3), catatan: 'Menuju dapur' },
        { tahap: TAHAP.TERKIRIM, waktu: jamLalu(2), catatan: 'Diterima Bu Sartika' },
      ],
    }),
  ];

  return sinkronPesanan(
    sinkronTanaman({ tanaman, pesanan, kurir, peranAktif: 'admin', kurirAktif: 'K-01' })
  );
}
