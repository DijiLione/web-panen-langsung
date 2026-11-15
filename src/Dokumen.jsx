import { useEffect } from 'react';
import { KOMISI, LABEL, formatTanggal, formatWaktu, rupiah } from './data.js';
import { Ikon } from './ui.jsx';

export default function Dokumen({ jenis, pesanan, state, onTutup }) {
  const invoice = jenis === 'invoice';
  const kurir = state.kurir.find((k) => k.id === pesanan.kurirId);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') onTutup();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onTutup]);

  return (
    <div
      className="dokumen-overlay"
      role="dialog"
      aria-label={invoice ? 'Invoice pesanan' : 'Surat jalan'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onTutup();
      }}
    >
      <div className="dokumen-kertas">
        <div className="dokumen-aksi">
          <span>{invoice ? 'Invoice / PO' : 'Surat jalan'}</span>
          <div>
            <button type="button" className="tombol tombol-kecil" onClick={() => window.print()}>
              <Ikon nama="papan" ukuran={16} />
              Cetak
            </button>
            <button type="button" className="tombol tombol-utama tombol-kecil" onClick={onTutup}>
              Tutup
            </button>
          </div>
        </div>

        <header className="dokumen-kepala">
          <div>
            <p className="dokumen-merek">PanenLangsung</p>
            <p className="label-kecil">
              Jual beli hasil panen langsung ke dapur · Bogor, Jawa Barat
            </p>
          </div>
          <div className="dokumen-nomor">
            <p>{invoice ? 'Invoice' : 'Surat jalan'}</p>
            <strong>
              {invoice ? 'INV' : 'SJ'}-{pesanan.id}/2026
            </strong>
            <span className="label-kecil">
              {formatTanggal(invoice ? pesanan.perkiraanTiba : pesanan.jadwalBerangkat)}
            </span>
          </div>
        </header>

        <div className="dokumen-pihak">
          <div>
            <span className="label-kecil">Pembeli</span>
            <strong>{pesanan.fnb}</strong>
            <p className="label-kecil">Tujuan: {pesanan.fnb}</p>
          </div>
          <div>
            <span className="label-kecil">Penjual</span>
            <strong>PanenLangsung</strong>
            <p className="label-kecil">halo@panenlangsung.id · 0812-9000-1234</p>
          </div>
          <div>
            <span className="label-kecil">Pengiriman</span>
            <strong>{kurir ? kurir.nama : 'Belum ditugaskan'}</strong>
            <p className="label-kecil">
              {kurir ? `${kurir.kendaraan} · ${kurir.area}` : 'Kurir menyusul'}
            </p>
          </div>
        </div>

        <div className="dokumen-tabel-wadah">
          <table className="dokumen-tabel">
          <thead>
            <tr>
              <th>Komoditas</th>
              <th>Grade</th>
              <th>Volume</th>
              <th>Harga/kg</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{pesanan.komoditas}</td>
              <td>{pesanan.grade}</td>
              <td>{pesanan.volume} kg</td>
              <td>{rupiah(Math.round(pesanan.nilai / pesanan.volume))}</td>
              <td>{rupiah(pesanan.nilai)}</td>
            </tr>
          </tbody>
          </table>
        </div>

        {invoice ? (
          <div className="dokumen-total">
            <div>
              <span>Nilai pesanan</span>
              <strong>{rupiah(pesanan.nilai)}</strong>
            </div>
            <div>
              <span>Komisi platform {Math.round(KOMISI * 100)}%</span>
              <strong>{rupiah(pesanan.komisi)}</strong>
            </div>
            <div>
              <span>Bagian petani</span>
              <strong>{rupiah(pesanan.bagianPetani)}</strong>
            </div>
            <div className="dokumen-tagihan">
              <span>Tagihan</span>
              <strong>{rupiah(pesanan.nilai)}</strong>
            </div>
          </div>
        ) : (
          <div className="dokumen-total">
            <div>
              <span>Total muatan</span>
              <strong>{pesanan.volume} kg</strong>
            </div>
            <div>
              <span>Titik rute</span>
              <strong>{pesanan.urutanRute || '-'}</strong>
            </div>
            <div>
              <span>Tahap kurir</span>
              <strong>{LABEL[pesanan.tahapKurir] || pesanan.tahapKurir}</strong>
            </div>
          </div>
        )}

        <div className="dokumen-catatan">
          <p>
            {invoice
              ? 'Pembayaran: termin 7 hari setelah barang diterima. Klaim maksimal 2 jam setelah serah terima.'
              : 'Periksa jumlah krat dan kondisi barang saat serah terima. Bukti terima dicatat oleh kurir.'}
          </p>
        </div>

        <div className="dokumen-tanda">
          <div>
            <span className="label-kecil">Disiapkan oleh</span>
            <span className="dokumen-garis" />
            <span className="label-kecil">Admin PanenLangsung</span>
          </div>
          <div>
            <span className="label-kecil">Diterima oleh</span>
            <span className="dokumen-garis" />
            <span className="label-kecil">
              {invoice ? 'Nama penerima dan tanggal' : 'Nama penerima, jumlah krat, kondisi'}
            </span>
          </div>
        </div>

        <footer className="dokumen-kaki">
          <span>Dibuat {formatWaktu(new Date().toISOString())} · data contoh</span>
          <span>PanenLangsung beta 0.9</span>
        </footer>
      </div>
    </div>
  );
}
