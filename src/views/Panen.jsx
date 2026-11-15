import { useState } from 'react';
import {
  GRADE,
  KOMISI,
  STATUS,
  formatTanggal,
  hargaPetani,
  hariIni,
  perkiraanTiba,
  rupiah,
  sisaVolume,
  acuanPasar,
  PASAR,
  perkiraanTengkulak,
} from '../data.js';
import { Grade, Kepala, Kpi, Kosong, Panel, Progres, Status } from '../ui.jsx';
import { Medan } from './bersama.jsx';

const kosongForm = {
  komoditas: '',
  grade: 'A',
  volume: '',
  hargaPlatform: '',
  hargaTengkulak: '',
  tanggalPanen: hariIni(),
  jendela: '',
  asalKebun: '',
  petani: '',
  catatan: '',
};

export default function Panen({ state, aksi }) {
  const [form, setForm] = useState(kosongForm);
  const [galat, setGalat] = useState({});
  const [sukses, setSukses] = useState('');
  const [tengkulakOtomatis, setTengkulakOtomatis] = useState(true);

  const daftar = state.tanaman;
  const totalVolume = daftar.reduce((s, t) => s + t.volume, 0);
  const totalSisa = daftar.reduce((s, t) => s + sisaVolume(t, state.pesanan), 0);
  const potensi = daftar.reduce(
    (s, t) => s + sisaVolume(t, state.pesanan) * hargaPetani(t.hargaPlatform),
    0
  );

  const ubah = (kunci) => (e) => {
    setForm((f) => ({ ...f, [kunci]: e.target.value }));
    setGalat((g) => ({ ...g, [kunci]: undefined }));
    setSukses('');
  };

  const ubahKomoditas = (e) => {
    const nilai = e.target.value;
    const acuanBaru = acuanPasar(nilai);
    const pakaiOtomatis = tengkulakOtomatis;

    setForm((f) => {
      let harga = f.hargaTengkulak;
      if (acuanBaru && (pakaiOtomatis || !f.hargaTengkulak)) {
        harga = String(perkiraanTengkulak(acuanBaru.harga));
      } else if (!acuanBaru && pakaiOtomatis) {
        harga = '';
      }
      return { ...f, komoditas: nilai, hargaTengkulak: harga };
    });

    setGalat((g) => ({ ...g, komoditas: undefined }));
    setSukses('');
  };

  const periksa = () => {
    const g = {};
    if (!form.komoditas.trim()) g.komoditas = 'Isi nama komoditas.';
    if (!(Number(form.volume) > 0)) g.volume = 'Volume harus lebih dari 0 kg.';
    if (!(Number(form.hargaPlatform) > 0)) g.hargaPlatform = 'Harga platform harus lebih dari 0.';
    if (!(Number(form.hargaTengkulak) > 0)) g.hargaTengkulak = 'Harga tengkulak harus lebih dari 0.';
    if (!form.tanggalPanen) g.tanggalPanen = 'Pilih tanggal panen.';
    if (!form.jendela.trim()) g.jendela = 'Tulis jendela panen, misalnya pagi 04.00 sampai 07.00.';
    if (!form.asalKebun.trim()) g.asalKebun = 'Isi asal kebun.';
    if (!form.petani.trim()) g.petani = 'Isi nama petani atau kelompok tani.';
    return g;
  };

  const kirim = (e) => {
    e.preventDefault();
    const g = periksa();
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setSukses('');
      return;
    }
    aksi.tambahTanaman({
      komoditas: form.komoditas.trim(),
      grade: form.grade,
      volume: Number(form.volume),
      hargaPlatform: Number(form.hargaPlatform),
      hargaTengkulak: Number(form.hargaTengkulak),
      tanggalPanen: form.tanggalPanen,
      jendela: form.jendela.trim(),
      asalKebun: form.asalKebun.trim(),
      petani: form.petani.trim(),
      catatan: form.catatan.trim(),
    });
    setForm({ ...kosongForm, tanggalPanen: form.tanggalPanen, petani: form.petani });
    setTengkulakOtomatis(true);
    setSukses(`${form.komoditas.trim()} terpasang dan langsung masuk katalog FnB.`);
  };

  const platform = Number(form.hargaPlatform) || 0;
  const volume = Number(form.volume) || 0;
  const acuan = acuanPasar(form.komoditas);
  const isiHargaPasar = () => {
    if (!acuan) return;
    setForm((f) => ({
      ...f,
      hargaPlatform: String(acuan.harga),
      hargaTengkulak: String(perkiraanTengkulak(acuan.harga)),
    }));
    setTengkulakOtomatis(true);
  };

  return (
    <>
      <Kepala
        judul="Panen saya"
        keterangan="Pasang volume, grade, dan jendela panen. Pembeli FnB memesan dari data ini sebelum kamu memetik."
      />

      <div className="kpi-grid kpi-grid-3">
        <Kpi label="Volume terpasang" nilai={`${totalVolume} kg`} catatan={`${daftar.length} baris panen`} />
        <Kpi label="Belum terpesan" nilai={`${totalSisa} kg`} catatan="Siap ditawarkan ke pembeli FnB" />
        <Kpi
          label="Potensi diterima"
          nilai={rupiah(potensi)}
          catatan="Sisa volume x harga petani setelah komisi 15%"
          aksen
        />
      </div>

      <div className="dua-kolom">
        <Panel
          judul="Pasang panen baru"
          keterangan="Data contoh tersimpan di peramban. Tidak ada unggahan ke server."
        >
          <form className="form" onSubmit={kirim} noValidate>
            <Medan id="komoditas" label="Komoditas" galat={galat.komoditas}>
              <input
                id="komoditas"
                value={form.komoditas}
                onChange={ubahKomoditas}
                placeholder="Contoh: Bayam"
                aria-invalid={galat.komoditas ? 'true' : undefined}
                aria-describedby={galat.komoditas ? 'galat-komoditas' : undefined}
                list="daftar-komoditas"
              />
              <datalist id="daftar-komoditas">
                {PASAR.daftar.map((d) => (
                  <option key={d.nama} value={d.nama} />
                ))}
              </datalist>
              <p className="petunjuk">
                Bebas diisi komoditas apa saja. Saran di atas hanya bantuan ketik.
              </p>
            </Medan>

            <Medan id="grade" label="Grade">
              <select id="grade" value={form.grade} onChange={ubah('grade')}>
                {Object.keys(GRADE).map((g) => (
                  <option key={g} value={g}>
                    {GRADE[g]}
                  </option>
                ))}
              </select>
            </Medan>

            <Medan id="volume" label="Volume (kg)" galat={galat.volume}>
              <input
                id="volume"
                type="number"
                inputMode="numeric"
                min="1"
                value={form.volume}
                onChange={ubah('volume')}
                placeholder="120"
                aria-invalid={galat.volume ? 'true' : undefined}
                aria-describedby={galat.volume ? 'galat-volume' : undefined}
              />
            </Medan>

            <Medan id="hargaPlatform" label="Harga jual platform (Rp/kg)" galat={galat.hargaPlatform}>
              <input
                id="hargaPlatform"
                type="number"
                inputMode="numeric"
                min="1"
                value={form.hargaPlatform}
                onChange={ubah('hargaPlatform')}
                placeholder="7100"
                aria-invalid={galat.hargaPlatform ? 'true' : undefined}
                aria-describedby={galat.hargaPlatform ? 'galat-hargaPlatform' : undefined}
              />
              {acuan ? (
                <div className="acuan-pasar">
                  <p>
                    Harga pasar hari ini <strong>{rupiah(acuan.harga)}/kg</strong> · {PASAR.sumber}
                  </p>
                  <button type="button" className="tombol tombol-kecil" onClick={isiHargaPasar}>
                    Pakai harga pasar
                  </button>
                </div>
              ) : form.komoditas.trim() ? (
                <p className="petunjuk">
                  Belum ada acuan harga pasar untuk komoditas ini. Harga sepenuhnya ditentukan
                  petani dan diperiksa admin saat verifikasi.
                </p>
              ) : null}
            </Medan>

            <Medan
              id="hargaTengkulak"
              label="Harga tengkulak saat ini (Rp/kg)"
              galat={galat.hargaTengkulak}
            >
              <input
                id="hargaTengkulak"
                type="number"
                inputMode="numeric"
                min="1"
                value={form.hargaTengkulak}
                onChange={(e) => {
                  setTengkulakOtomatis(e.target.value === '');
                  ubah('hargaTengkulak')(e);
                }}
                placeholder="5000"
                aria-invalid={galat.hargaTengkulak ? 'true' : undefined}
                aria-describedby={galat.hargaTengkulak ? 'galat-hargaTengkulak' : undefined}
              />
              <p className="petunjuk">
                {tengkulakOtomatis
                  ? 'Perkiraan otomatis 75% dari harga pasar. Ubah kalau di tempatmu berbeda.'
                  : 'Diisi manual oleh petani.'}
              </p>
            </Medan>

            <Medan id="tanggalPanen" label="Tanggal panen" galat={galat.tanggalPanen}>
              <input
                id="tanggalPanen"
                type="date"
                value={form.tanggalPanen}
                onChange={ubah('tanggalPanen')}
                aria-invalid={galat.tanggalPanen ? 'true' : undefined}
                aria-describedby={galat.tanggalPanen ? 'galat-tanggalPanen' : undefined}
              />
            </Medan>

            <Medan id="jendela" label="Jendela panen" galat={galat.jendela} penuh>
              <input
                id="jendela"
                value={form.jendela}
                onChange={ubah('jendela')}
                placeholder="Pagi, 04.00 sampai 07.00"
                aria-invalid={galat.jendela ? 'true' : undefined}
                aria-describedby={galat.jendela ? 'galat-jendela' : undefined}
              />
            </Medan>

            <Medan id="asalKebun" label="Asal kebun" galat={galat.asalKebun}>
              <input
                id="asalKebun"
                value={form.asalKebun}
                onChange={ubah('asalKebun')}
                placeholder="Cisarua, Bogor"
                aria-invalid={galat.asalKebun ? 'true' : undefined}
                aria-describedby={galat.asalKebun ? 'galat-asalKebun' : undefined}
              />
            </Medan>

            <Medan id="petani" label="Petani atau kelompok tani" galat={galat.petani}>
              <input
                id="petani"
                value={form.petani}
                onChange={ubah('petani')}
                placeholder="Kelompok Tani Sumber Rejeki"
                aria-invalid={galat.petani ? 'true' : undefined}
                aria-describedby={galat.petani ? 'galat-petani' : undefined}
              />
            </Medan>

            <Medan id="catatan" label="Catatan untuk pembeli FnB" penuh>
              <textarea
                id="catatan"
                rows="2"
                value={form.catatan}
                onChange={ubah('catatan')}
                placeholder="Ukuran, pengemasan, atau tingkat kematangan."
              />
            </Medan>

            <div className="form-aksi">
              <button type="submit" className="tombol tombol-utama">
                Pasang panen
              </button>
              <p className="sukses" aria-live="polite">
                {sukses}
              </p>
            </div>
          </form>
        </Panel>

        <aside className="sisi-ringkas">
          <Panel judul="Pratinjau harga" keterangan="Dihitung dari isian di sebelah kiri.">
            <dl className="rincian">
              <div>
                <dt>Diterima petani per kg</dt>
                <dd>{platform > 0 ? rupiah(hargaPetani(platform)) : '-'}</dd>
              </div>
              <div>
                <dt>Komisi platform per kg</dt>
                <dd>{platform > 0 ? rupiah(platform * KOMISI) : '-'}</dd>
              </div>
              <div>
                <dt>Nilai untuk {volume || 0} kg</dt>
                <dd>{platform > 0 && volume > 0 ? rupiah(hargaPetani(platform) * volume) : '-'}</dd>
              </div>
              <div>
                <dt>Perkiraan tiba</dt>
                <dd>
                  {form.tanggalPanen
                    ? formatTanggal(perkiraanTiba({ tanggalPanen: form.tanggalPanen }))
                    : '-'}
                </dd>
              </div>
            </dl>
            <p className="rumus">
              Nilai petani = volume x harga platform x 85%. Selisih terhadap tengkulak muncul di
              katalog setelah panen dipasang.
            </p>
          </Panel>
        </aside>
      </div>

      <Panel judul="Panen terpasang" keterangan={`${daftar.length} baris, terbaru di atas.`}>
        {daftar.length === 0 ? (
          <Kosong
            judul="Belum ada panen."
            lanjut="Isi formulir di atas. Setelah tersimpan, baris pertama muncul di sini dan di katalog FnB."
          />
        ) : (
          <div className="daftar-panen">
            {daftar.map((t) => {
              const sisa = sisaVolume(t, state.pesanan);
              const terpakai = t.volume - sisa;
              return (
                <article className="panen-baris" key={t.id}>
                  <div className="panen-identitas">
                    <h3>
                      {t.komoditas} <Grade grade={t.grade} />
                    </h3>
                    <p>
                      {t.petani} · {t.asalKebun}
                    </p>
                    <p>
                      Panen {formatTanggal(t.tanggalPanen)} · {t.jendela}
                    </p>
                    {t.catatan ? <p className="panen-catatan">{t.catatan}</p> : null}
                  </div>
                  <div>
                    <span className="label-kecil">Terjual</span>
                    <p className="angka-baris">
                      {terpakai} / {t.volume} kg
                    </p>
                    <Progres nilai={terpakai} maks={t.volume} label={`${terpakai} dari ${t.volume} kg terjual`} />
                  </div>
                  <div>
                    <span className="label-kecil">Harga platform</span>
                    <p className="angka-baris">{rupiah(t.hargaPlatform)}</p>
                    <span className="label-kecil">Diterima petani</span>
                    <p className="angka-baris">{rupiah(hargaPetani(t.hargaPlatform))}</p>
                  </div>
                  <div>
                    <Status status={sisa > 0 ? STATUS.TERSEDIA : 'habis'} />
                    <p className="label-kecil" style={{ marginTop: '6px' }}>
                      Sisa {sisa} kg
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </>
  );
}
