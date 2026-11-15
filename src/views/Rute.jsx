import { useMemo } from 'react';
import { STATUS, formatTanggal, kg } from '../data.js';
import { Ikon, Kosong, Kepala, Panel, Progres, Status, Tahap } from '../ui.jsx';

export default function Rute({ state, peran, kurirAktif, onDokumen }) {
  const grup = useMemo(() => {
    const relevan = state.pesanan.filter(
      (p) =>
        (p.status === STATUS.BERANGKAT || p.status === STATUS.TIBA) &&
        p.jadwalBerangkat &&
        (!kurirAktif || peran !== 'kurir' || p.kurirId === kurirAktif)
    );
    const peta = {};
    for (const p of relevan) {
      const kunci = `${p.jadwalBerangkat}|${p.kurirId}`;
      if (!peta[kunci]) {
        peta[kunci] = {
          tanggal: p.jadwalBerangkat,
          kurirId: p.kurirId,
          kurir: p.kurir,
          isi: [],
        };
      }
      peta[kunci].isi.push(p);
    }
    return Object.values(peta).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [state.pesanan, peran, kurirAktif]);

  const infoKurir = (id) => state.kurir.find((k) => k.id === id);

  return (
    <>
      <Kepala
        judul="Rute kurir"
        keterangan="Satu lembar rute per kurir per hari. Urutan antar mengikuti nomor, bukan tebakan."
      />

      {grup.length === 0 ? (
        <Panel>
          <Kosong
            judul="Belum ada rute aktif."
            lanjut="Verifikasi pesanan lalu tugaskan kurir. Lembar rute tersusun otomatis dari pesanan hari itu."
          />
        </Panel>
      ) : (
        grup.map((g) => {
          const k = infoKurir(g.kurirId);
          const total = g.isi.reduce((s, p) => s + p.volume, 0);
          const sedang = g.isi.filter((p) => p.status === STATUS.BERANGKAT);
          return (
            <Panel
              key={`${g.tanggal}-${g.kurirId}`}
              judul={`${formatTanggal(g.tanggal)} · ${g.kurir || 'Tanpa kurir'}`}
              keterangan={`${g.isi.length} titik antar · ${sedang.length} masih berjalan`}
              aksi={<Status status={sedang.length ? STATUS.BERANGKAT : STATUS.TIBA} />}
            >
              <div className="rute-kepala">
                <div>
                  <span className="label-kecil">Kendaraan</span>
                  <p className="angka-baris">{k ? `${k.kendaraan} · ${k.area}` : '-'}</p>
                </div>
                <div className="rute-muatan">
                  <span className="label-kecil">Muatan</span>
                  <p className="angka-baris">
                    {kg(total)} dari {k ? kg(k.kapasitas) : '-'}
                  </p>
                  <Progres
                    nilai={total}
                    maks={k ? k.kapasitas : total || 1}
                    label={`${total} kg dari kapasitas ${k ? k.kapasitas : '-'} kg`}
                  />
                </div>
              </div>

              <ol className="rute-daftar">
                {[...g.isi]
                  .sort((a, b) => a.urutanRute - b.urutanRute)
                  .map((p, i) => (
                    <li key={p.id}>
                      <span className="rute-nomor">{String(i + 1).padStart(2, '0')}</span>
                      <div className="rute-isi">
                        <h3>{p.fnb}</h3>
                        <p className="label-kecil">
                          {p.id} · {p.komoditas} · {p.volume} kg · {p.grade}
                        </p>
                      </div>
                      <div className="rute-lencana">
                        <Status status={p.status} />
                        {p.status === STATUS.BERANGKAT ? <Tahap tahap={p.tahapKurir} /> : null}
                        <button
                          type="button"
                          className="tombol tombol-garis tombol-kecil"
                          onClick={() => onDokumen(p)}
                        >
                          <Ikon nama="papan" ukuran={15} />
                          Surat jalan
                        </button>
                      </div>
                    </li>
                  ))}
              </ol>
            </Panel>
          );
        })
      )}
    </>
  );
}
