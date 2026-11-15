import { useMemo, useState } from 'react';
import {
  GRADE,
  formatTanggal,
  hargaPetani,
  perkiraanTiba,
  rupiah,
  selisihPetani,
  sisaVolume,
  acuanPasar,
} from '../data.js';
import { Grade, Ikon, Kepala, Kosong, Panel, Progres, Status } from '../ui.jsx';
import Cutoff from '../Cutoff.jsx';

export default function Katalog({ state, peran, onPesan }) {
  const [cari, setCari] = useState('');
  const [grade, setGrade] = useState('semua');
  const [urut, setUrut] = useState('terbaru');
  const [hanyaAda, setHanyaAda] = useState(false);

  const daftar = useMemo(() => {
    let hasil = state.tanaman.map((t) => ({ ...t, sisa: sisaVolume(t, state.pesanan) }));
    const q = cari.trim().toLowerCase();
    if (q) {
      hasil = hasil.filter(
        (t) =>
          t.komoditas.toLowerCase().includes(q) ||
          t.petani.toLowerCase().includes(q) ||
          t.asalKebun.toLowerCase().includes(q)
      );
    }
    if (grade !== 'semua') hasil = hasil.filter((t) => t.grade === grade);
    if (hanyaAda) hasil = hasil.filter((t) => t.sisa > 0);
    hasil = [...hasil].sort((a, b) => {
      if (urut === 'harga') return a.hargaPlatform - b.hargaPlatform;
      if (urut === 'volume') return b.volume - a.volume;
      if (urut === 'selisih') return selisihPetani(b) - selisihPetani(a);
      return b.tanggalPanen.localeCompare(a.tanggalPanen);
    });
    return hasil;
  }, [state.tanaman, state.pesanan, cari, grade, urut, hanyaAda]);

  return (
    <>
      <Kepala
        judul="Katalog panen"
        keterangan="Harga platform, bagian petani, dan harga tengkulak dihitung dari data yang sama. Tidak ada angka tempelan."
      />

      <Cutoff />

      <div className="toolbar" role="search">
        <div className="toolbar-cari">
          <Ikon nama="cari" ukuran={16} />
          <label className="lewat" htmlFor="cariKatalog">
            Cari komoditas, petani, atau kebun
          </label>
          <input
            id="cariKatalog"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari komoditas, petani, atau kebun"
          />
        </div>
        <div className="toolbar-pilihan">
          <label htmlFor="filterGrade" className="lewat">
            Filter grade
          </label>
          <select id="filterGrade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="semua">Semua grade</option>
            {Object.keys(GRADE).map((g) => (
              <option key={g} value={g}>
                {GRADE[g]}
              </option>
            ))}
          </select>

          <label htmlFor="urutKatalog" className="lewat">
            Urutkan
          </label>
          <select id="urutKatalog" value={urut} onChange={(e) => setUrut(e.target.value)}>
            <option value="terbaru">Panen terbaru</option>
            <option value="harga">Harga terendah</option>
            <option value="volume">Volume terbesar</option>
            <option value="selisih">Selisih terbesar</option>
          </select>

          <label className="centang">
            <input
              type="checkbox"
              checked={hanyaAda}
              onChange={(e) => setHanyaAda(e.target.checked)}
            />
            Hanya yang tersedia
          </label>
        </div>
      </div>

      <Panel
        judul="Perbandingan per kilogram"
        keterangan={`${daftar.length} dari ${state.tanaman.length} baris · data contoh`}
        padat
      >
        {state.tanaman.length === 0 ? (
          <Kosong
            judul="Belum ada panen yang terpasang."
            lanjut="Buka peran Petani dan pasang panen pertama. Barisnya akan muncul di sini."
          />
        ) : daftar.length === 0 ? (
          <Kosong
            judul="Tidak ada baris yang cocok."
            lanjut="Hapus kata kunci, ganti grade, atau matikan centang hanya tersedia."
          />
        ) : (
          <div className="katalog">
            {daftar.map((t) => {
              const terjual = t.volume - t.sisa;
              return (
                <article className="katalog-baris" key={t.id}>
                  <div className="katalog-identitas">
                    <h3>
                      {t.komoditas} <Grade grade={t.grade} />
                    </h3>
                    <p>
                      {t.petani} · {t.asalKebun}
                    </p>
                    <p>
                      Panen {formatTanggal(t.tanggalPanen)} · {t.jendela}
                    </p>
                    {t.catatan ? <p className="katalog-catatan">{t.catatan}</p> : null}
                  </div>

                  <div className="katalog-harga">
                    <span className="label-kecil">Dibayar pembeli</span>
                    <p className="angka-baris">{rupiah(t.hargaPlatform)}</p>
                    <span className="label-kecil">Diterima petani, setelah komisi 15%</span>
                    <p className="angka-baris tebal">{rupiah(hargaPetani(t.hargaPlatform))}</p>
                  </div>

                  <div className="katalog-harga">
                    <span className="label-kecil">Tengkulak</span>
                    <p className="angka-baris">{rupiah(t.hargaTengkulak)}</p>
                    <span className="label-kecil">Selisih untuk petani</span>
                    <p className="angka-baris selisih">+{rupiah(selisihPetani(t))}/kg</p>
                    {acuanPasar(t.komoditas) ? (
                      <p className="label-kecil katalog-pasar">
                        Pasar induk {rupiah(acuanPasar(t.komoditas).harga)}/kg
                      </p>
                    ) : null}
                  </div>

                  <div className="katalog-ketersediaan">
                    <div className="ketersediaan-atas">
                      <Status status={t.sisa > 0 ? 'tersedia' : 'habis'} />
                      <span className="label-kecil">
                        Sisa {t.sisa} kg dari {t.volume} kg
                      </span>
                    </div>
                    <Progres
                      nilai={terjual}
                      maks={t.volume}
                      label={`${terjual} dari ${t.volume} kg sudah dipesan`}
                    />
                    <p className="label-kecil">Tiba {formatTanggal(perkiraanTiba(t))}</p>
                    {peran === 'fnb' && t.sisa > 0 ? (
                      <button
                        type="button"
                        className="tombol tombol-utama tombol-kecil"
                        onClick={() => onPesan(t.id)}
                      >
                        Pesan {t.komoditas}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <p className="catatan-bawah">
        Cara hitung: bagian petani = harga platform x 85%. Selisih = bagian petani dikurangi harga
        tengkulak. Semua baris di atas berasal dari data contoh di peramban ini.
      </p>
    </>
  );
}
