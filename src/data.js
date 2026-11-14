export const KUNCI = 'panenlangsung:v1';
export const KOMISI = 0.15;

export const STATUS = {
  TERSEDIA: 'tersedia',
  MENUNGGU: 'menunggu_verifikasi',
  DIVERIFIKASI: 'diverifikasi',
  BERANGKAT: 'berangkat',
  TIBA: 'tiba',
  DIBATALKAN: 'dibatalkan',
};

export const LABEL = {
  tersedia: 'Tersedia',
  habis: 'Habis dipesan',
  menunggu_verifikasi: 'Menunggu verifikasi',
  diverifikasi: 'Terverifikasi',
  berangkat: 'Berangkat',
  tiba: 'Tiba',
  dibatalkan: 'Dibatalkan',
};

export const PERAN = [
  { id: 'petani', nama: 'Petani', tugas: 'Memasang panen dan memeriksa harga pembanding.' },
  { id: 'katering', nama: 'Katering', tugas: 'Membuat pre-order dari panen yang tersedia.' },
  { id: 'admin', nama: 'Admin', tugas: 'Memverifikasi pesanan, menetapkan kurir, menutup status.' },
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

export function formatWaktu(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export function rupiah(n) {
  return `Rp${nf.format(Math.round(n || 0))}`;
}

export function persen(n) {
  return `${(n || 0).toFixed(1).replace('.', ',')}%`;
}

export const hargaPetani = (hargaPlatform) => Math.round(hargaPlatform * (1 - KOMISI));
export const selisihPetani = (t) => hargaPetani(t.hargaPlatform) - t.hargaTengkulak;
export const perkiraanTiba = (t) => tambahHari(t.tanggalPanen, 1);

export function volumeTerpakai(daftarPesanan, tanamanId) {
  return daftarPesanan
    .filter((p) => p.tanamanId === tanamanId && p.status !== STATUS.DIBATALKAN)
    .reduce((total, p) => total + p.volume, 0);
}

export function sisaVolume(tanaman, daftarPesanan) {
  return Math.max(0, tanaman.volume - volumeTerpakai(daftarPesanan, tanaman.id));
}

export function sinkronTanaman(state) {
  const tanaman = state.tanaman.map((t) => ({
    ...t,
    status: sisaVolume(t, state.pesanan) > 0 ? STATUS.TERSEDIA : 'habis',
  }));
  return { ...state, tanaman };
}

export function dataAwal() {
  const besok = tambahHari(hariIni(), 1);
  const lusa = tambahHari(hariIni(), 2);

  const tanaman = [
    {
      id: 'T-01',
      komoditas: 'Bayam',
      volume: 120,
      hargaPlatform: 7100,
      hargaTengkulak: 5000,
      tanggalPanen: besok,
      asalKebun: 'Cisarua, Bogor',
      petani: 'Kelompok Tani Sumber Rejeki',
    },
    {
      id: 'T-02',
      komoditas: 'Kangkung',
      volume: 90,
      hargaPlatform: 6400,
      hargaTengkulak: 4500,
      tanggalPanen: besok,
      asalKebun: 'Cisarua, Bogor',
      petani: 'Kelompok Tani Sumber Rejeki',
    },
    {
      id: 'T-03',
      komoditas: 'Wortel',
      volume: 200,
      hargaPlatform: 12800,
      hargaTengkulak: 9000,
      tanggalPanen: lusa,
      asalKebun: 'Lembang, Bandung Barat',
      petani: 'Gapoktan Lembang Makmur',
    },
    {
      id: 'T-04',
      komoditas: 'Tomat',
      volume: 150,
      hargaPlatform: 10600,
      hargaTengkulak: 7500,
      tanggalPanen: lusa,
      asalKebun: 'Cikajang, Garut',
      petani: 'Kelompok Tani Cikajang Hijau',
    },
    {
      id: 'T-05',
      komoditas: 'Cabai merah',
      volume: 60,
      hargaPlatform: 54000,
      hargaTengkulak: 38000,
      tanggalPanen: besok,
      asalKebun: 'Cikajang, Garut',
      petani: 'Kelompok Tani Cikajang Hijau',
    },
    {
      id: 'T-06',
      komoditas: 'Sawi hijau',
      volume: 100,
      hargaPlatform: 8500,
      hargaTengkulak: 6000,
      tanggalPanen: lusa,
      asalKebun: 'Lembang, Bandung Barat',
      petani: 'Gapoktan Lembang Makmur',
    },
  ].map((t, i) => ({ ...t, id: `T-${pad(i + 1)}`, status: STATUS.TERSEDIA }));

  return { tanaman, pesanan: [], peranAktif: 'petani' };
}
