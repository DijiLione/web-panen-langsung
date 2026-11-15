const ISI = {
  petani: [
    'Pasang panen: komoditas, grade, volume, jendela petik.',
    'Buka Katalog untuk melihat sisa volume dan harga pembanding.',
    'Cek Pendapatan untuk melihat bagian yang siap cair.',
  ],
  fnb: [
    'Cari komoditas di Katalog, saring grade sesuai menu.',
    'Kirim pre-order sebelum jam 15.00.',
    'Terima barang, lalu catat klaim bila ada selisih.',
  ],
  admin: [
    'Verifikasi pesanan masuk beserta alasannya bila ditolak.',
    'Tugaskan kurir sesuai kapasitas kendaraan.',
    'Pantau rute harian dan selesaikan klaim.',
  ],
  kurir: [
    'Buka Tugas, lihat urutan antar hari ini.',
    'Catat empat langkah: ditugaskan, diambil, di jalan, terkirim.',
    'Isi nama penerima dan kondisi barang sebagai bukti.',
  ],
};

export default function Tur({ peran, onTutup }) {
  const langkah = ISI[peran] || ISI.fnb;

  return (
    <aside className="tur" aria-label="Panduan singkat">
      <div className="tur-kepala">
        <p className="tur-judul">Tiga langkah pertama</p>
        <button type="button" className="tur-tutup" onClick={onTutup} aria-label="Tutup panduan">
          Mengerti
        </button>
      </div>
      <ol className="tur-langkah">
        {langkah.map((isi, i) => (
          <li key={isi}>
            <span>{i + 1}</span>
            {isi}
          </li>
        ))}
      </ol>
    </aside>
  );
}
