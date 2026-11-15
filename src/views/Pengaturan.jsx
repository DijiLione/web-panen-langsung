import { useState } from 'react';
import { KUNCI, KOMISI, STATUS, formatWaktu, rupiah, sisaVolume } from '../data.js';
import { Kepala, Kosong, Panel } from '../ui.jsx';

export default function Pengaturan({ state, aksi }) {
  const [tanya, setTanya] = useState(false);
  const [ekspor, setEkspor] = useState('');

  const reset = () => {
    aksi.reset();
    setTanya(false);
    setEkspor('');
  };

  const unduh = () => {
    const isi = JSON.stringify(state, null, 2);
    const blob = new Blob([isi], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panenlangsung-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setEkspor('Berkas data diunduh ke folder unduhan peramban.');
  };

  const totalVolume = state.tanaman.reduce((s, t) => s + t.volume, 0);
  const sisa = state.tanaman.reduce((s, t) => s + sisaVolume(t, state.pesanan), 0);
  const tiba = state.pesanan.filter((p) => p.status === STATUS.TIBA);
  const gmv = tiba.reduce((s, p) => s + p.nilai, 0);

  return (
    <>
      <Kepala
        judul="Pengaturan"
        keterangan="Versi beta menyimpan seluruh keadaan di peramban ini. Tidak ada server dan tidak ada akun."
      />

      <div className="dua-kolom dua-kolom-dash">
        <Panel judul="Data yang tersimpan" keterangan={`Kunci penyimpanan ${KUNCI}`}>
          <dl className="rincian">
            <div>
              <dt>Baris panen</dt>
              <dd>{state.tanaman.length}</dd>
            </div>
            <div>
              <dt>Volume terpasang</dt>
              <dd>{totalVolume} kg</dd>
            </div>
            <div>
              <dt>Volume belum terpesan</dt>
              <dd>{sisa} kg</dd>
            </div>
            <div>
              <dt>Pesanan tercatat</dt>
              <dd>{state.pesanan.length}</dd>
            </div>
            <div>
              <dt>Pesanan tiba</dt>
              <dd>{tiba.length}</dd>
            </div>
            <div>
              <dt>GMV selesai</dt>
              <dd>{rupiah(gmv)}</dd>
            </div>
            <div>
              <dt>Komisi 15%</dt>
              <dd>{rupiah(gmv * KOMISI)}</dd>
            </div>
            <div>
              <dt>Kurir terdaftar</dt>
              <dd>{state.kurir.length}</dd>
            </div>
          </dl>
          <div className="aksi-baris" style={{ marginTop: '14px' }}>
            <button type="button" className="tombol tombol-kecil" onClick={unduh}>
              Unduh data JSON
            </button>
          </div>
          <p className="sukses" aria-live="polite">
            {ekspor}
          </p>
        </Panel>

        <Panel judul="Reset data" keterangan="Kembali ke data contoh awal, dua belas pesanan dan delapan panen.">
          <p className="catatan-bawah" style={{ marginTop: 0 }}>
            Reset berguna sebelum presentasi atau saat mencoba alur dari awal. Data yang sudah
            diunduh tidak terpengaruh.
          </p>
          {!tanya ? (
            <button type="button" className="tombol" onClick={() => setTanya(true)}>
              Reset data
            </button>
          ) : (
            <div className="konfirmasi" role="alertdialog" aria-labelledby="judul-reset">
              <p id="judul-reset">
                Hapus semua perubahan dan kembalikan data contoh awal?
              </p>
              <div className="aksi-baris">
                <button type="button" className="tombol tombol-utama tombol-kecil" onClick={reset}>
                  Ya, reset sekarang
                </button>
                <button
                  type="button"
                  className="tombol tombol-kecil"
                  onClick={() => setTanya(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </Panel>
      </div>

      <Panel judul="Tentang versi beta" keterangan="Beta tertutup, data contoh.">
        <div className="dua-kolom dua-kolom-teks">
          <div>
            <h3>Yang sudah berjalan</h3>
            <p>
              Empat peran: petani, FnB, admin, dan kurir. Katalog dengan pencarian dan filter,
              pre-order dengan batas volume, verifikasi beralasan, penugasan kurir dengan kapasitas,
              serah terima dengan bukti, rute harian, serta dashboard yang dihitung dari data.
            </p>
            <p>
              Semua perubahan tersimpan langsung dan pulih saat halaman dimuat ulang. Tidak ada
              permintaan jaringan setelah aplikasi terbuka.
            </p>
          </div>
          <div>
            <h3>Yang belum ada</h3>
            <p>
              Backend, login sungguhan, pembayaran, notifikasi, peta, dan integrasi logistik nyata.
              Angka di aplikasi ini berasal dari data contoh, bukan transaksi lapangan.
            </p>
            <p>
              Data terakhir disimpan {formatWaktu(new Date().toISOString())}. Versi ini ditujukan
              untuk uji alur, bukan untuk operasi harian.
            </p>
          </div>
        </div>
      </Panel>

      <Panel judul="Peran dan cakupannya">
        <div className="tabel">
          <div className="tabel-baris tabel-baris-peran">
            <div>
              <h3>Petani</h3>
              <p className="label-kecil">Pasang panen, lihat sisa, bandingkan harga.</p>
            </div>
            <div>
              <h3>FnB</h3>
              <p className="label-kecil">Cari panen, pre-order, lacak kiriman.</p>
            </div>
            <div>
              <h3>Admin</h3>
              <p className="label-kecil">Verifikasi, tugaskan kurir, tutup status.</p>
            </div>
            <div>
              <h3>Kurir</h3>
              <p className="label-kecil">Ambil, antar sesuai urutan, catat bukti.</p>
            </div>
          </div>
        </div>
      </Panel>

      <Kosong
        judul="Butuh data dari nol?"
        lanjut="Gunakan tombol Reset data di atas. Aplikasi akan kembali ke delapan baris panen dan dua belas pesanan contoh, termasuk dua pengiriman yang sedang berjalan."
      />
    </>
  );
}
