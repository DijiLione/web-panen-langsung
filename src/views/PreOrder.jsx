import { useState } from 'react';
import {
  KOMISI,
  formatTanggal,
  hargaPetani,
  perkiraanTiba,
  rupiah,
  selisihPetani,
  sisaVolume,
} from '../data.js';
import { Grade, Kepala, Kosong, Panel } from '../ui.jsx';
import { Medan } from './bersama.jsx';
import Cutoff from '../Cutoff.jsx';

export default function PreOrder({ state, aksi, pilihan, setPilihan, onLihatPesanan }) {
  const [volume, setVolume] = useState('');
  const [fnb, setFnb] = useState('');
  const [catatan, setCatatan] = useState('');
  const [galat, setGalat] = useState({});
  const [sukses, setSukses] = useState('');

  const opsi = state.tanaman
    .map((t) => ({ ...t, sisa: sisaVolume(t, state.pesanan) }))
    .filter((t) => t.sisa > 0);

  const terpilih = opsi.find((t) => t.id === pilihan) || null;
  const vol = Number(volume);
  const sisa = terpilih ? terpilih.sisa : 0;
  const nilai = terpilih && vol > 0 ? vol * terpilih.hargaPlatform : 0;

  const kirim = (e) => {
    e.preventDefault();
    const g = {};
    if (!terpilih) g.tanaman = 'Pilih komoditas lebih dulu.';
    if (!(vol > 0)) g.volume = 'Volume harus lebih dari 0 kg.';
    else if (terpilih && vol > sisa) g.volume = `Melebihi sisa volume (${sisa} kg).`;
    if (!fnb.trim()) g.fnb = 'Isi nama bisnis FnB.';
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setSukses('');
      return;
    }
    aksi.buatPesanan({
      tanamanId: terpilih.id,
      komoditas: terpilih.komoditas,
      grade: terpilih.grade,
      fnb: fnb.trim(),
      volume: vol,
      nilai,
      komisi: nilai * KOMISI,
      bagianPetani: nilai * (1 - KOMISI),
      perkiraanTiba: perkiraanTiba(terpilih),
      catatanFnb: catatan.trim(),
    });
    setSukses(
      `Pre-order ${vol} kg ${terpilih.komoditas} masuk antrean verifikasi admin.`
    );
    setVolume('');
    setCatatan('');
    setPilihan('');
  };

  return (
    <>
      <Kepala
        judul="Buat pre-order"
        keterangan="Pesanan diverifikasi admin, lalu kurir mengambilnya di kebun pada pagi hari panen."
      />

      <Cutoff />

      <div className="dua-kolom dua-kolom-form">
        <Panel judul="Detail pesanan" keterangan="Volume dibatasi sisa panen yang belum dipesan.">
          {opsi.length === 0 ? (
            <Kosong
              judul="Belum ada panen yang bisa dipesan."
              lanjut="Minta peran Petani memasang panen lebih dulu, atau reset data dari Pengaturan."
            />
          ) : (
            <form className="form" onSubmit={kirim} noValidate>
              <Medan id="pilihTanaman" label="Komoditas" galat={galat.tanaman} penuh>
                <select
                  id="pilihTanaman"
                  value={pilihan}
                  onChange={(e) => {
                    setPilihan(e.target.value);
                    setGalat((g) => ({ ...g, tanaman: undefined, volume: undefined }));
                  }}
                  aria-invalid={galat.tanaman ? 'true' : undefined}
                  aria-describedby={galat.tanaman ? 'galat-pilihTanaman' : undefined}
                >
                  <option value="">Pilih komoditas</option>
                  {opsi.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.komoditas} grade {t.grade} · sisa {t.sisa} kg · {rupiah(t.hargaPlatform)}/kg
                    </option>
                  ))}
                </select>
              </Medan>

              <Medan id="volumePesan" label="Volume (kg)" galat={galat.volume}>
                <input
                  id="volumePesan"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                    setGalat((g) => ({ ...g, volume: undefined }));
                  }}
                  placeholder={terpilih ? String(sisa) : '60'}
                  aria-invalid={galat.volume ? 'true' : undefined}
                  aria-describedby={galat.volume ? 'galat-volumePesan' : undefined}
                />
              </Medan>

              <Medan id="fnb" label="Nama bisnis FnB" galat={galat.fnb}>
                <input
                  id="fnb"
                  value={fnb}
                  onChange={(e) => {
                    setFnb(e.target.value);
                    setGalat((g) => ({ ...g, fnb: undefined }));
                  }}
                  placeholder="Dapur Bu Sartika"
                  aria-invalid={galat.fnb ? 'true' : undefined}
                  aria-describedby={galat.fnb ? 'galat-fnb' : undefined}
                />
              </Medan>

              <Medan id="catatanFnb" label="Catatan untuk petani" penuh>
                <textarea
                  id="catatanFnb"
                  rows="2"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: ikat 250 gram, kirim sebelum jam 09.00."
                />
              </Medan>

              <div className="form-aksi">
                <button type="submit" className="tombol tombol-utama">
                  Kirim pre-order
                </button>
                {sukses ? (
                  <button type="button" className="tombol tombol-kecil" onClick={onLihatPesanan}>
                    Lihat pesanan
                  </button>
                ) : null}
              </div>
              <p className="sukses" aria-live="polite">
                {sukses}
              </p>
            </form>
          )}
        </Panel>

        <aside className="sisi-ringkas">
          <Panel judul="Ringkasan" keterangan="Angka mengikuti pilihan dan volume.">
            {terpilih ? (
              <>
                <div className="ringkas-judul">
                  <h3>
                    {terpilih.komoditas} <Grade grade={terpilih.grade} />
                  </h3>
                  <p>
                    {terpilih.petani} · {terpilih.asalKebun}
                  </p>
                  <p>
                    Panen {formatTanggal(terpilih.tanggalPanen)} · {terpilih.jendela}
                  </p>
                </div>
                <dl className="rincian">
                  <div>
                    <dt>Harga platform</dt>
                    <dd>{rupiah(terpilih.hargaPlatform)}/kg</dd>
                  </div>
                  <div>
                    <dt>Nilai pesanan</dt>
                    <dd>{rupiah(nilai)}</dd>
                  </div>
                  <div>
                    <dt>Komisi platform 15%</dt>
                    <dd>{rupiah(nilai * KOMISI)}</dd>
                  </div>
                  <div>
                    <dt>Bagian petani</dt>
                    <dd>{rupiah(nilai * (1 - KOMISI))}</dd>
                  </div>
                  <div>
                    <dt>Perkiraan tiba</dt>
                    <dd>{formatTanggal(perkiraanTiba(terpilih))}</dd>
                  </div>
                  <div>
                    <dt>Selisih lawan tengkulak</dt>
                    <dd className="selisih">+{rupiah(selisihPetani(terpilih))}/kg</dd>
                  </div>
                </dl>
                <p className="rumus">
                  Petani menerima {rupiah(hargaPetani(terpilih.hargaPlatform))} per kg. Pengiriman
                  dijadwalkan satu hari setelah panen.
                </p>
              </>
            ) : (
              <Kosong
                judul="Belum ada komoditas dipilih."
                lanjut="Pilih komoditas di formulir. Ringkasan harga dan jadwal akan muncul di sini."
              />
            )}
          </Panel>
        </aside>
      </div>
    </>
  );
}
