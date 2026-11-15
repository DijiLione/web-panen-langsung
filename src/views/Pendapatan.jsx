import { useMemo } from 'react';
import { KOMISI, STATUS, formatTanggal, isoLokal, rupiah } from '../data.js';
import { Kepala, Kpi, Kosong, Panel, Status } from '../ui.jsx';

function seninDepan() {
  const d = new Date();
  const sisa = (8 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + sisa);
  return isoLokal(d);
}

export default function Pendapatan({ state }) {
  const data = useMemo(() => {
    const urut = [...state.pesanan].sort((a, b) =>
      b.jejak[0].waktu.localeCompare(a.jejak[0].waktu)
    );
    const cair = urut.filter((p) => p.status === STATUS.TIBA);
    const proses = urut.filter(
      (p) => p.status === STATUS.BERANGKAT || p.status === STATUS.DIVERIFIKASI
    );
    const jumlah = (daftar) => daftar.reduce((s, p) => s + p.bagianPetani, 0);
    const volumeCair = cair.reduce((s, p) => s + p.volume, 0);
    return {
      urut,
      cair: jumlah(cair),
      menunggu: jumlah(proses),
      volumeCair,
      rata: volumeCair > 0 ? jumlah(cair) / volumeCair : 0,
      bayar: seninDepan(),
    };
  }, [state.pesanan]);

  return (
    <>
      <Kepala
        judul="Pendapatan"
        keterangan="Bagian petani dihitung otomatis 85% dari setiap pesanan. Tidak ada rekap manual."
      />

      <div className="kpi-grid kpi-grid-3">
        <Kpi
          label="Siap cair"
          nilai={rupiah(data.cair)}
          catatan={`Dari pesanan yang sudah tiba · cair ${formatTanggal(data.bayar)}`}
          aksen
        />
        <Kpi label="Masih berjalan" nilai={rupiah(data.menunggu)} catatan="Menunggu verifikasi atau pengiriman" />
        <Kpi label="Rata-rata per kg" nilai={rupiah(data.rata)} catatan={`${data.volumeCair} kg sudah terkirim`} />
      </div>

      <Panel judul="Rincian per pesanan" keterangan={`Komisi platform ${Math.round(KOMISI * 100)}% sudah dipotong.`}>
        {data.urut.length === 0 ? (
          <Kosong judul="Belum ada pesanan." lanjut="Pasang panen, lalu tunggu pre-order pertama masuk." />
        ) : (
          <div className="tabel">
            {data.urut.map((p) => (
              <div className="tabel-baris tabel-baris-pendapatan" key={p.id}>
                <div>
                  <h3>
                    {p.id} · {p.komoditas}
                  </h3>
                  <p className="label-kecil">
                    {p.fnb} · {p.volume} kg · harga {rupiah(Math.round(p.nilai / p.volume))}/kg
                  </p>
                </div>
                <div>
                  <Status status={p.status} />
                </div>
                <div className="angka-baris">{rupiah(p.bagianPetani)}</div>
                <div className="label-kecil">
                  {p.status === STATUS.TIBA ? 'Siap cair' : p.status === STATUS.DIBATALKAN ? 'Batal' : 'Menunggu'}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="catatan-bawah">
          Pencairan dilakukan setiap Senin untuk pesanan yang sudah tiba sebelum pukul 15.00 hari
          Minggu. Nominal di atas adalah bagian petani setelah komisi 15%.
        </p>
      </Panel>
    </>
  );
}
