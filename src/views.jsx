import { useState } from 'react';
import {
  KOMISI,
  LABEL,
  STATUS,
  formatTanggal,
  formatWaktu,
  hargaPetani,
  hariIni,
  perkiraanTiba,
  persen,
  rupiah,
  selisihPetani,
  sisaVolume,
} from './data.js';

export function Status({ status }) {
  return <span className={`st st-${status}`}>{LABEL[status] || status}</span>;
}

export function Kosong({ judul, lanjut }) {
  return (
    <div className="kosong">
      <p>{judul}</p>
      {lanjut ? <p>{lanjut}</p> : null}
    </div>
  );
}

function Kepala({ judul, catatan }) {
  return (
    <div className="utama-kepala">
      <div>
        <h1>{judul}</h1>
      </div>
      {catatan ? <p>{catatan}</p> : null}
    </div>
  );
}

function tanamanDari(state, id) {
  return state.tanaman.find((t) => t.id === id);
}

function nilaiPesanan(p) {
  return p.nilai;
}

/* ---------------- F-1 katalog ---------------- */
export function Katalog({ state, peran, onPesan }) {
  const { tanaman, pesanan } = state;
  const tersedia = tanaman.filter((t) => sisaVolume(t, pesanan) > 0);

  return (
    <>
      <Kepala
        judul="Katalog panen"
        catatan="Harga dihitung dari data panen. Komisi 15% ditampilkan terpisah dari bagian petani."
      />
      <div className="panel">
        <div className="panel-kepala">
          <h2>Perbandingan harga per kilogram</h2>
          <p>Data simulasi</p>
        </div>

        {tanaman.length === 0 ? (
          <Kosong
            judul="Belum ada panen yang terpasang."
            lanjut="Pindah ke peran Petani, lalu isi formulir Pasang panen. Baris pertama akan muncul di sini."
          />
        ) : (
          <div className="komoditas">
            {tanaman.map((t) => {
              const sisa = sisaVolume(t, pesanan);
              return (
                <article className="komoditas-baris" key={t.id}>
                  <div className="komoditas-identitas">
                    <h3 className="komoditas-nama">{t.komoditas}</h3>
                    <p className="komoditas-meta">
                      {t.petani} · {t.asalKebun}
                    </p>
                    <p className="komoditas-meta">
                      Panen {formatTanggal(t.tanggalPanen)} · sisa {sisa} kg dari {t.volume} kg
                    </p>
                    <p style={{ marginTop: '6px' }}>
                      <Status status={sisa > 0 ? STATUS.TERSEDIA : 'habis'} />
                    </p>
                  </div>

                  <div>
                    <p className="harga-label">Harga platform (dibayar katering)</p>
                    <p className="harga-nilai tebal">{rupiah(t.hargaPlatform)}</p>
                  </div>

                  <div>
                    <p className="harga-label">Diterima petani setelah komisi 15%</p>
                    <p className="harga-nilai">{rupiah(hargaPetani(t.hargaPlatform))}</p>
                    <p className="harga-label">Tengkulak {rupiah(t.hargaTengkulak)}</p>
                    <p className="selisih">
                      Selisih {rupiah(selisihPetani(t))} per kg lebih tinggi
                    </p>
                  </div>

                  <div>
                    <p className="harga-label">Perkiraan tiba</p>
                    <p className="harga-nilai">{formatTanggal(perkiraanTiba(t))}</p>
                    {peran === 'katering' && sisa > 0 ? (
                      <button
                        type="button"
                        className="tombol tombol-kecil"
                        style={{ marginTop: '8px' }}
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
        <p className="sumber">
          Cara hitung: harga platform x 85% = bagian petani. Selisih = bagian petani dikurangi harga
          tengkulak. Semua angka berasal dari data simulasi.
        </p>
        {peran === 'katering' && tersedia.length === 0 && tanaman.length > 0 ? (
          <p className="bantuan" style={{ marginTop: '14px' }}>
            Semua panen sudah dipesan penuh. Tunggu panen berikutnya atau reset data dari Pengaturan.
          </p>
        ) : null}
      </div>
    </>
  );
}

/* ---------------- F-2 pasang panen ---------------- */
const kosongForm = {
  komoditas: '',
  volume: '',
  hargaPlatform: '',
  hargaTengkulak: '',
  tanggalPanen: hariIni(),
  asalKebun: '',
  petani: '',
};

export function PasangPanen({ state, aksi }) {
  const [form, setForm] = useState(kosongForm);
  const [galat, setGalat] = useState({});
  const [sukses, setSukses] = useState('');

  const ubah = (kunci) => (e) => {
    setForm((f) => ({ ...f, [kunci]: e.target.value }));
    setGalat((g) => ({ ...g, [kunci]: undefined }));
    setSukses('');
  };

  const periksa = () => {
    const g = {};
    if (!form.komoditas.trim()) g.komoditas = 'Isi nama komoditas.';
    if (!(Number(form.volume) > 0)) g.volume = 'Volume harus lebih dari 0 kg.';
    if (!(Number(form.hargaPlatform) > 0)) g.hargaPlatform = 'Harga platform harus lebih dari 0.';
    if (!(Number(form.hargaTengkulak) > 0))
      g.hargaTengkulak = 'Harga tengkulak harus lebih dari 0.';
    if (!form.tanggalPanen) g.tanggalPanen = 'Pilih tanggal panen.';
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
      volume: Number(form.volume),
      hargaPlatform: Number(form.hargaPlatform),
      hargaTengkulak: Number(form.hargaTengkulak),
      tanggalPanen: form.tanggalPanen,
      asalKebun: form.asalKebun.trim(),
      petani: form.petani.trim(),
    });
    setForm({ ...kosongForm, tanggalPanen: form.tanggalPanen });
    setSukses(`Panen ${form.komoditas.trim()} terpasang dan langsung tampil di katalog katering.`);
  };

  const punyaSaya = state.tanaman;

  return (
    <>
      <Kepala
        judul="Pasang panen"
        catatan="Isi volume dan tanggal. Katering memesan dari data ini sebelum kamu memetik."
      />
      <div className="panel">
        <div className="panel-kepala">
          <h2>Panen baru</h2>
          <p>Data simulasi</p>
        </div>
        <form className="form" onSubmit={kirim} noValidate>
          <div className={`kolom ${galat.komoditas ? 'bahaya' : ''}`}>
            <label htmlFor="komoditas">Komoditas</label>
            <input
              id="komoditas"
              value={form.komoditas}
              onChange={ubah('komoditas')}
              placeholder="Contoh: Bayam"
              aria-invalid={galat.komoditas ? 'true' : undefined}
              aria-describedby={galat.komoditas ? 'galat-komoditas' : undefined}
            />
            {galat.komoditas ? (
              <p className="galat" id="galat-komoditas">
                {galat.komoditas}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.volume ? 'bahaya' : ''}`}>
            <label htmlFor="volume">Volume (kg)</label>
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
            {galat.volume ? (
              <p className="galat" id="galat-volume">
                {galat.volume}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.hargaPlatform ? 'bahaya' : ''}`}>
            <label htmlFor="hargaPlatform">Harga jual platform (Rp/kg)</label>
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
            {galat.hargaPlatform ? (
              <p className="galat" id="galat-hargaPlatform">
                {galat.hargaPlatform}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.hargaTengkulak ? 'bahaya' : ''}`}>
            <label htmlFor="hargaTengkulak">Harga tengkulak (Rp/kg)</label>
            <input
              id="hargaTengkulak"
              type="number"
              inputMode="numeric"
              min="1"
              value={form.hargaTengkulak}
              onChange={ubah('hargaTengkulak')}
              placeholder="5000"
              aria-invalid={galat.hargaTengkulak ? 'true' : undefined}
              aria-describedby={galat.hargaTengkulak ? 'galat-hargaTengkulak' : undefined}
            />
            {galat.hargaTengkulak ? (
              <p className="galat" id="galat-hargaTengkulak">
                {galat.hargaTengkulak}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.tanggalPanen ? 'bahaya' : ''}`}>
            <label htmlFor="tanggalPanen">Tanggal panen</label>
            <input
              id="tanggalPanen"
              type="date"
              value={form.tanggalPanen}
              onChange={ubah('tanggalPanen')}
              aria-invalid={galat.tanggalPanen ? 'true' : undefined}
              aria-describedby={galat.tanggalPanen ? 'galat-tanggalPanen' : undefined}
            />
            {galat.tanggalPanen ? (
              <p className="galat" id="galat-tanggalPanen">
                {galat.tanggalPanen}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.asalKebun ? 'bahaya' : ''}`}>
            <label htmlFor="asalKebun">Asal kebun</label>
            <input
              id="asalKebun"
              value={form.asalKebun}
              onChange={ubah('asalKebun')}
              placeholder="Cisarua, Bogor"
              aria-invalid={galat.asalKebun ? 'true' : undefined}
              aria-describedby={galat.asalKebun ? 'galat-asalKebun' : undefined}
            />
            {galat.asalKebun ? (
              <p className="galat" id="galat-asalKebun">
                {galat.asalKebun}
              </p>
            ) : null}
          </div>

          <div className={`kolom ${galat.petani ? 'bahaya' : ''}`}>
            <label htmlFor="petani">Petani atau kelompok tani</label>
            <input
              id="petani"
              value={form.petani}
              onChange={ubah('petani')}
              placeholder="Kelompok Tani Sumber Rejeki"
              aria-invalid={galat.petani ? 'true' : undefined}
              aria-describedby={galat.petani ? 'galat-petani' : undefined}
            />
            {galat.petani ? (
              <p className="galat" id="galat-petani">
                {galat.petani}
              </p>
            ) : null}
          </div>

          {Number(form.hargaPlatform) > 0 ? (
            <div className="hitung">
              <dl>
                <div>
                  <dt>Diterima petani per kg</dt>
                  <dd>{rupiah(hargaPetani(Number(form.hargaPlatform)))}</dd>
                </div>
                <div>
                  <dt>Komisi platform per kg</dt>
                  <dd>{rupiah(Number(form.hargaPlatform) * KOMISI)}</dd>
                </div>
                <div>
                  <dt>Perkiraan tiba</dt>
                  <dd>{form.tanggalPanen ? formatTanggal(perkiraanTiba({ tanggalPanen: form.tanggalPanen })) : '-'}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          <div className="form-aksi">
            <button type="submit" className="tombol tombol-utama">
              Pasang panen
            </button>
            <p className="bantuan" style={{ margin: 0 }} aria-live="polite">
              {sukses}
            </p>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-kepala">
          <h2>Panen yang terpasang</h2>
          <p>Total {punyaSaya.length} baris</p>
        </div>
        {punyaSaya.length === 0 ? (
          <Kosong
            judul="Belum ada panen."
            lanjut="Isi formulir di atas. Setelah tersimpan, buka Katalog untuk melihat perbandingan harganya."
          />
        ) : (
          <div className="pesanan">
            {punyaSaya.map((t) => (
              <article className="pesanan-butir" key={t.id}>
                <div className="pesanan-atas">
                  <span className="pesanan-id">
                    {t.id} · {t.komoditas}
                  </span>
                  <Status status={sisaVolume(t, state.pesanan) > 0 ? STATUS.TERSEDIA : 'habis'} />
                </div>
                <dl className="pesanan-isi">
                  <div>
                    <dt>Volume</dt>
                    <dd>{t.volume} kg</dd>
                  </div>
                  <div>
                    <dt>Sisa</dt>
                    <dd>{sisaVolume(t, state.pesanan)} kg</dd>
                  </div>
                  <div>
                    <dt>Harga platform</dt>
                    <dd>{rupiah(t.hargaPlatform)}/kg</dd>
                  </div>
                  <div>
                    <dt>Diterima petani</dt>
                    <dd>{rupiah(hargaPetani(t.hargaPlatform))}/kg</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- F-3 pre-order ---------------- */
export function PreOrder({ state, aksi, pilihan, setPilihan }) {
  const { tanaman, pesanan } = state;
  const opsi = tanaman.filter((t) => sisaVolume(t, pesanan) > 0);

  const [volume, setVolume] = useState('');
  const [katering, setKatering] = useState('');
  const [galat, setGalat] = useState({});
  const [sukses, setSukses] = useState('');

  const terpilih = tanaman.find((t) => t.id === pilihan) || null;
  const namaTerpilih = terpilih ? terpilih.komoditas : '';
  const sisa = terpilih ? sisaVolume(terpilih, pesanan) : 0;
  const vol = Number(volume);
  const nilai = terpilih && vol > 0 ? vol * terpilih.hargaPlatform : 0;

  const kirim = (e) => {
    e.preventDefault();
    const g = {};
    if (!terpilih) g.tanaman = 'Pilih komoditas lebih dulu.';
    if (!(vol > 0)) g.volume = 'Volume harus lebih dari 0 kg.';
    else if (terpilih && vol > sisa) g.volume = `Melebihi sisa volume (${sisa} kg).`;
    if (!katering.trim()) g.katering = 'Isi nama katering.';
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setSukses('');
      return;
    }

    aksi.buatPesanan({
      tanamanId: terpilih.id,
      komoditas: namaTerpilih,
      katering: katering.trim(),
      volume: vol,
      nilai,
      komisi: nilai * KOMISI,
      bagianPetani: nilai * (1 - KOMISI),
      perkiraanTiba: perkiraanTiba(terpilih),
    });
    setSukses(
      `Pre-order ${vol} kg ${namaTerpilih} tercatat dengan status menunggu verifikasi.`
    );
    setVolume('');
    setPilihan('');
  };

  const pesananSaya = pesanan;

  return (
    <>
      <Kepala
        judul="Pre-order panen"
        catatan="Pesanan dikirim ke admin untuk diverifikasi. Sayur baru dipetik setelah pesanan masuk."
      />
      <div className="panel">
        <div className="panel-kepala">
          <h2>Buat pre-order</h2>
          <p>Data simulasi</p>
        </div>

        {opsi.length === 0 ? (
          <Kosong
            judul="Belum ada panen yang bisa dipesan."
            lanjut="Minta peran Petani memasang panen lebih dulu, atau reset data dari Pengaturan."
          />
        ) : (
          <form className="form" onSubmit={kirim} noValidate>
            <div className={`kolom penuh ${galat.tanaman ? 'bahaya' : ''}`}>
              <label htmlFor="pilihTanaman">Komoditas</label>
              <select
                id="pilihTanaman"
                value={pilihan}
                onChange={(e) => {
                  setPilihan(e.target.value);
                  setGalat((g) => ({ ...g, tanaman: undefined, volume: undefined }));
                }}
                aria-invalid={galat.tanaman ? 'true' : undefined}
                aria-describedby={galat.tanaman ? 'galat-tanaman' : undefined}
              >
                <option value="">Pilih komoditas</option>
                {opsi.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.komoditas} · sisa {sisaVolume(t, pesanan)} kg · {rupiah(t.hargaPlatform)}/kg
                  </option>
                ))}
              </select>
              {galat.tanaman ? (
                <p className="galat" id="galat-tanaman">
                  {galat.tanaman}
                </p>
              ) : null}
            </div>

            <div className={`kolom ${galat.volume ? 'bahaya' : ''}`}>
              <label htmlFor="volumePesan">Volume (kg)</label>
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
                aria-describedby={galat.volume ? 'galat-volume-pesan' : undefined}
              />
              {galat.volume ? (
                <p className="galat" id="galat-volume-pesan">
                  {galat.volume}
                </p>
              ) : null}
            </div>

            <div className={`kolom ${galat.katering ? 'bahaya' : ''}`}>
              <label htmlFor="katering">Nama katering</label>
              <input
                id="katering"
                value={katering}
                onChange={(e) => {
                  setKatering(e.target.value);
                  setGalat((g) => ({ ...g, katering: undefined }));
                }}
                placeholder="Katering Dapur Bu Sartika"
                aria-invalid={galat.katering ? 'true' : undefined}
                aria-describedby={galat.katering ? 'galat-katering' : undefined}
              />
              {galat.katering ? (
                <p className="galat" id="galat-katering">
                  {galat.katering}
                </p>
              ) : null}
            </div>

            {terpilih ? (
              <div className="hitung">
                <dl>
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
                </dl>
                <p className="rumus">
                  Nilai = volume x harga platform. Komisi = 15% dari nilai. Perkiraan tiba = tanggal
                  panen + 1 hari.
                </p>
              </div>
            ) : null}

            <div className="form-aksi">
              <button type="submit" className="tombol tombol-utama">
                Kirim pre-order
              </button>
              <p className="bantuan" style={{ margin: 0 }} aria-live="polite">
                {sukses}
              </p>
            </div>
          </form>
        )}
      </div>

      <div className="panel">
        <div className="panel-kepala">
          <h2>Pesanan yang tercatat</h2>
          <p>{pesananSaya.length} pesanan</p>
        </div>
        {pesananSaya.length === 0 ? (
          <Kosong
            judul="Belum ada pesanan."
            lanjut="Pilih komoditas di atas, isi volume, lalu kirim. Status awal selalu menunggu verifikasi."
          />
        ) : (
          <div className="pesanan">
            {pesananSaya.map((p) => {
              const t = tanamanDari(state, p.tanamanId);
              return (
                <article className="pesanan-butir" key={p.id}>
                  <div className="pesanan-atas">
                    <span className="pesanan-id">
                      {p.id} · {p.komoditas}
                    </span>
                    <Status status={p.status} />
                  </div>
                  <dl className="pesanan-isi">
                    <div>
                      <dt>Katering</dt>
                      <dd>{p.katering}</dd>
                    </div>
                    <div>
                      <dt>Volume</dt>
                      <dd>{p.volume} kg</dd>
                    </div>
                    <div>
                      <dt>Nilai</dt>
                      <dd>{rupiah(nilaiPesanan(p))}</dd>
                    </div>
                    <div>
                      <dt>Bagian petani</dt>
                      <dd>{rupiah(p.nilai * (1 - KOMISI))}</dd>
                    </div>
                    <div>
                      <dt>Perkiraan tiba</dt>
                      <dd>{formatTanggal(p.perkiraanTiba)}</dd>
                    </div>
                    <div>
                      <dt>Asal kebun</dt>
                      <dd>{t ? t.asalKebun : '-'}</dd>
                    </div>
                  </dl>
                  <ul className="jejak" aria-label="Riwayat status">
                    {p.jejak.map((j, i) => (
                      <li key={`${p.id}-${i}`}>
                        <Status status={j.status} /> {formatWaktu(j.waktu)}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- F-4 verifikasi ---------------- */
export function Verifikasi({ state, aksi }) {
  const [draft, setDraft] = useState({});
  const [galat, setGalat] = useState({});

  const menunggu = state.pesanan.filter((p) => p.status === STATUS.MENUNGGU);
  const terverifikasi = state.pesanan.filter((p) => p.status === STATUS.DIVERIFIKASI);
  const berangkat = state.pesanan.filter((p) => p.status === STATUS.BERANGKAT);

  const ubahDraft = (id, kunci, nilai) => {
    setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), [kunci]: nilai } }));
    setGalat((g) => ({ ...g, [id]: undefined }));
  };

  const tetapkan = (p) => {
    const d = draft[p.id] || {};
    const g = {};
    const kurir = (d.kurir || '').trim();
    const jadwal = d.jadwal || p.perkiraanTiba;
    if (!kurir) g.kurir = 'Isi nama kurir.';
    if (!jadwal) g.jadwal = 'Pilih tanggal berangkat.';
    if (Object.keys(g).length > 0) {
      setGalat((lama) => ({ ...lama, [p.id]: g }));
      return;
    }
    aksi.ubahStatus(p.id, STATUS.BERANGKAT, {
      kurir,
      jadwalBerangkat: jadwal,
    });
    setDraft((lama) => ({ ...lama, [p.id]: {} }));
  };

  return (
    <>
      <Kepala
        judul="Verifikasi dan pengiriman"
        catatan="Verifikasi hanya sekali. Penolakan mengembalikan volume ke panen. Status tiba hanya setelah berangkat."
      />

      <div className="panel">
        <div className="panel-kepala">
          <h2>Menunggu verifikasi</h2>
          <p>{menunggu.length} pesanan</p>
        </div>
        {menunggu.length === 0 ? (
          <Kosong
            judul="Tidak ada pesanan baru."
            lanjut="Pesanan dari peran Katering akan muncul di sini dengan status menunggu verifikasi."
          />
        ) : (
          <div className="pesanan">
            {menunggu.map((p) => (
              <article className="pesanan-butir" key={p.id}>
                <div className="pesanan-atas">
                  <span className="pesanan-id">
                    {p.id} · {p.komoditas}
                  </span>
                  <Status status={p.status} />
                </div>
                <dl className="pesanan-isi">
                  <div>
                    <dt>Katering</dt>
                    <dd>{p.katering}</dd>
                  </div>
                  <div>
                    <dt>Volume</dt>
                    <dd>{p.volume} kg</dd>
                  </div>
                  <div>
                    <dt>Nilai</dt>
                    <dd>{rupiah(p.nilai)}</dd>
                  </div>
                  <div>
                    <dt>Komisi 15%</dt>
                    <dd>{rupiah(p.nilai * KOMISI)}</dd>
                  </div>
                  <div>
                    <dt>Perkiraan tiba</dt>
                    <dd>{formatTanggal(p.perkiraanTiba)}</dd>
                  </div>
                </dl>
                <div className="pesanan-aksi">
                  <button
                    type="button"
                    className="tombol tombol-utama tombol-kecil"
                    onClick={() => aksi.ubahStatus(p.id, STATUS.DIVERIFIKASI)}
                  >
                    Verifikasi {p.id}
                  </button>
                  <button
                    type="button"
                    className="tombol tombol-kecil"
                    onClick={() => aksi.ubahStatus(p.id, STATUS.DIBATALKAN)}
                  >
                    Tolak dan kembalikan volume
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-kepala">
          <h2>Siap diberangkatkan</h2>
          <p>{terverifikasi.length} pesanan</p>
        </div>
        {terverifikasi.length === 0 ? (
          <Kosong
            judul="Belum ada pesanan terverifikasi."
            lanjut="Verifikasi pesanan di panel atas, lalu tetapkan kurir dan jadwal berangkat di sini."
          />
        ) : (
          <div className="pesanan">
            {terverifikasi.map((p) => {
              const g = galat[p.id] || {};
              const d = draft[p.id] || {};
              return (
                <article className="pesanan-butir" key={p.id}>
                  <div className="pesanan-atas">
                    <span className="pesanan-id">
                      {p.id} · {p.komoditas} · {p.volume} kg
                    </span>
                    <Status status={p.status} />
                  </div>
                  <p className="komoditas-meta">
                    {p.katering} · nilai {rupiah(p.nilai)} · perkiraan tiba{' '}
                    {formatTanggal(p.perkiraanTiba)}
                  </p>
                  <div className="form" style={{ marginTop: '10px' }}>
                    <div className={`kolom ${g.kurir ? 'bahaya' : ''}`}>
                      <label htmlFor={`kurir-${p.id}`}>Nama kurir</label>
                      <input
                        id={`kurir-${p.id}`}
                        value={d.kurir || ''}
                        onChange={(e) => ubahDraft(p.id, 'kurir', e.target.value)}
                        placeholder="Kurir Asep"
                        aria-invalid={g.kurir ? 'true' : undefined}
                        aria-describedby={g.kurir ? `galat-kurir-${p.id}` : undefined}
                      />
                      {g.kurir ? (
                        <p className="galat" id={`galat-kurir-${p.id}`}>
                          {g.kurir}
                        </p>
                      ) : null}
                    </div>
                    <div className={`kolom ${g.jadwal ? 'bahaya' : ''}`}>
                      <label htmlFor={`jadwal-${p.id}`}>Tanggal berangkat</label>
                      <input
                        id={`jadwal-${p.id}`}
                        type="date"
                        value={d.jadwal || p.perkiraanTiba}
                        onChange={(e) => ubahDraft(p.id, 'jadwal', e.target.value)}
                        aria-invalid={g.jadwal ? 'true' : undefined}
                        aria-describedby={g.jadwal ? `galat-jadwal-${p.id}` : undefined}
                      />
                      {g.jadwal ? (
                        <p className="galat" id={`galat-jadwal-${p.id}`}>
                          {g.jadwal}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="pesanan-aksi">
                    <button
                      type="button"
                      className="tombol tombol-utama tombol-kecil"
                      onClick={() => tetapkan(p)}
                    >
                      Tetapkan kurir dan berangkatkan {p.id}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-kepala">
          <h2>Dalam pengiriman</h2>
          <p>{berangkat.length} pesanan</p>
        </div>
        {berangkat.length === 0 ? (
          <Kosong
            judul="Tidak ada pengiriman aktif."
            lanjut="Setelah kurir ditetapkan, pesanan pindah ke sini dan bisa ditandai tiba."
          />
        ) : (
          <div className="pesanan">
            {berangkat.map((p) => (
              <article className="pesanan-butir" key={p.id}>
                <div className="pesanan-atas">
                  <span className="pesanan-id">
                    {p.id} · {p.komoditas} · {p.volume} kg
                  </span>
                  <Status status={p.status} />
                </div>
                <dl className="pesanan-isi">
                  <div>
                    <dt>Katering</dt>
                    <dd>{p.katering}</dd>
                  </div>
                  <div>
                    <dt>Kurir</dt>
                    <dd>{p.kurir}</dd>
                  </div>
                  <div>
                    <dt>Jadwal</dt>
                    <dd>{formatTanggal(p.jadwalBerangkat)}</dd>
                  </div>
                  <div>
                    <dt>Urutan rute</dt>
                    <dd>{p.urutanRute}</dd>
                  </div>
                </dl>
                <div className="pesanan-aksi">
                  <button
                    type="button"
                    className="tombol tombol-teal tombol-kecil"
                    onClick={() => aksi.ubahStatus(p.id, STATUS.TIBA)}
                  >
                    Tandai tiba {p.id}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- F-5 rute ---------------- */
export function Rute({ state }) {
  const aktif = state.pesanan
    .filter((p) => p.status === STATUS.BERANGKAT)
    .sort((a, b) =>
      a.jadwalBerangkat === b.jadwalBerangkat
        ? a.urutanRute - b.urutanRute
        : a.jadwalBerangkat.localeCompare(b.jadwalBerangkat)
    );

  const grup = aktif.reduce((hasil, p) => {
    const kunci = p.jadwalBerangkat || 'tanpa-jadwal';
    hasil[kunci] = hasil[kunci] || [];
    hasil[kunci].push(p);
    return hasil;
  }, {});

  return (
    <>
      <Kepala
        judul="Rute kurir"
        catatan="Urutan antar untuk pesanan yang berangkat di hari yang sama. Nomor mengikuti urutan, bukan hiasan."
      />
      {aktif.length === 0 ? (
        <div className="panel">
          <Kosong
            judul="Belum ada rute aktif."
            lanjut="Verifikasi pesanan lalu tetapkan kurir dan tanggal berangkat. Rute akan tersusun otomatis dari pesanan hari itu."
          />
        </div>
      ) : (
        Object.keys(grup)
          .sort()
          .map((tanggal) => (
            <div className="panel" key={tanggal}>
              <div className="panel-kepala">
                <h2>Berangkat {formatTanggal(tanggal)}</h2>
                <p>{grup[tanggal].length} titik antar</p>
              </div>
              <ol className="rute">
                {grup[tanggal].map((p, i) => (
                  <li key={p.id}>
                    <span className="rute-nomor">{i + 1}.</span>
                    <span className="rute-tujuan">{p.katering}</span>
                    <Status status={p.status} />
                    <span className="rute-isi">
                      {p.id} · {p.komoditas} {p.volume} kg · kurir {p.kurir || 'belum ditetapkan'}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))
      )}
    </>
  );
}

/* ---------------- F-6 dashboard ---------------- */
export function Dashboard({ state }) {
  const tiba = state.pesanan.filter((p) => p.status === STATUS.TIBA);
  const gmv = tiba.reduce((s, p) => s + p.nilai, 0);
  const komisi = gmv * KOMISI;
  const bagianPetani = gmv * (1 - KOMISI);
  const skenarioTengkulak = tiba.reduce((s, p) => {
    const t = tanamanDari(state, p.tanamanId);
    return s + (t ? t.hargaTengkulak * p.volume : 0);
  }, 0);
  const margin = skenarioTengkulak > 0 ? ((bagianPetani - skenarioTengkulak) / skenarioTengkulak) * 100 : null;

  const dipanen = state.tanaman.reduce((s, t) => s + t.volume, 0);
  const terpesan = state.pesanan
    .filter((p) => p.status !== STATUS.DIBATALKAN)
    .reduce((s, p) => s + p.volume, 0);
  const takTerpesan = Math.max(0, dipanen - terpesan);
  const limbah = dipanen > 0 ? (takTerpesan / dipanen) * 100 : null;

  return (
    <>
      <Kepala
        judul="Dashboard traksi"
        catatan="Semua angka dihitung dari pesanan yang berstatus tiba. Tidak ada angka yang ditulis manual."
      />

      <div className="panel">
        <div className="panel-kepala">
          <h2>Ringkasan</h2>
          <p>Data simulasi</p>
        </div>

        {tiba.length === 0 ? (
          <Kosong
            judul="Belum ada pesanan tiba."
            lanjut="Dashboard akan terisi setelah admin menandai pesanan tiba di panel pengiriman."
          />
        ) : null}

        <dl className="statistik" style={{ marginTop: tiba.length === 0 ? '18px' : 0 }}>
          <div>
            <dt>GMV pesanan tiba</dt>
            <dd>{rupiah(gmv)}</dd>
          </div>
          <div>
            <dt>Komisi platform 15%</dt>
            <dd>{rupiah(komisi)}</dd>
          </div>
          <div>
            <dt>Margin petani vs tengkulak</dt>
            <dd>{margin === null ? '-' : `${margin >= 0 ? '+' : ''}${persen(margin)}`}</dd>
          </div>
          <div>
            <dt>Sisa panen tak terpesan</dt>
            <dd>{limbah === null ? '-' : persen(limbah)}</dd>
          </div>
        </dl>

        <div className="dasar">
          <h3>Dasar perhitungan</h3>
          <dl>
            <div>
              <dt>Pesanan tiba</dt>
              <dd>{tiba.length} pesanan</dd>
            </div>
            <div>
              <dt>Nilai pesanan tiba (GMV)</dt>
              <dd>{rupiah(gmv)}</dd>
            </div>
            <div>
              <dt>Bagian petani, 85% dari GMV</dt>
              <dd>{rupiah(bagianPetani)}</dd>
            </div>
            <div>
              <dt>Nilai skenario tengkulak, volume sama</dt>
              <dd>{rupiah(skenarioTengkulak)}</dd>
            </div>
            <div>
              <dt>Margin petani</dt>
              <dd>
                {margin === null
                  ? 'Belum bisa dihitung'
                  : `${bagianPetani >= skenarioTengkulak ? '+' : ''}${persen(margin)}`}
              </dd>
            </div>
            <div>
              <dt>Volume dipanen</dt>
              <dd>{dipanen} kg</dd>
            </div>
            <div>
              <dt>Volume terpesan, tanpa yang dibatalkan</dt>
              <dd>{terpesan} kg</dd>
            </div>
            <div>
              <dt>Volume tak terpesan</dt>
              <dd>{takTerpesan} kg</dd>
            </div>
          </dl>
          <p className="rumus">
            GMV = jumlah nilai pesanan tiba. Komisi = 15% x GMV. Margin petani = (bagian petani
            dikurangi nilai tengkulak) dibagi nilai tengkulak. Sisa panen = volume tak terpesan
            dibagi volume dipanen.
          </p>
          <p className="sumber">
            Target studi kasus: margin petani +20%, limbah mendekati 0% dari sebelumnya 30%, komisi
            15%. Angka di atas adalah hasil data simulasi, bukan hasil lapangan.
          </p>
        </div>
      </div>
    </>
  );
}

/* ---------------- pengaturan ---------------- */
export function Pengaturan({ state, aksi, tersimpan }) {
  const [tanya, setTanya] = useState(false);

  const reset = () => {
    aksi.reset();
    setTanya(false);
  };

  return (
    <>
      <Kepala judul="Pengaturan" catatan="Tidak ada server. Semua data tinggal di peramban ini." />

      <div className="panel">
        <div className="panel-kepala">
          <h2>Data demo</h2>
          <p aria-live="polite">{tersimpan}</p>
        </div>
        <div className="dasar" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
          <dl>
            <div>
              <dt>Panen terpasang</dt>
              <dd>{state.tanaman.length} baris</dd>
            </div>
            <div>
              <dt>Pesanan tercatat</dt>
              <dd>{state.pesanan.length} pesanan</dd>
            </div>
            <div>
              <dt>Penyimpanan</dt>
              <dd>localStorage panenlangsung:v1</dd>
            </div>
          </dl>
        </div>

        <div style={{ marginTop: '18px' }}>
          <button type="button" className="tombol" onClick={() => setTanya(true)}>
            Reset data demo
          </button>
          {tanya ? (
            <div className="konfirmasi" role="alertdialog" aria-labelledby="judul-konfirmasi">
              <p id="judul-konfirmasi">
                Hapus semua panen dan pesanan, lalu kembalikan ke data dummy awal?
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
          ) : null}
        </div>
        <p className="bantuan">
          Reset berguna sebelum presentasi. Data awal berisi enam komoditas contoh dan belum ada
          pesanan.
        </p>
      </div>

      <div className="panel">
        <div className="panel-kepala">
          <h2>Tentang demo ini</h2>
        </div>
        <p style={{ marginBottom: '8px' }}>
          Ini demo simulasi dengan data dummy. Tidak ada autentikasi, pembayaran, atau panggilan
          jaringan keluar. Setelah halaman dimuat, aplikasi tetap berjalan tanpa internet.
        </p>
        <p style={{ margin: 0, color: '#4b5a6e', fontSize: '0.9rem' }}>
          Ganti peran lewat tombol di atas. Perpindahan peran hanya simulasi tampilan, bukan login,
          dan tidak menghapus data.
        </p>
      </div>
    </>
  );
}
