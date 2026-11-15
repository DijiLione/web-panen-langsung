import { useMemo, useState } from 'react';
import { STATUS, formatTanggal, formatWaktu, rupiah } from '../data.js';
import { Grade, GarisWaktu, Ikon, Kepala, Kosong, Panel, Status, Tahap } from '../ui.jsx';
import Foto from '../Foto.jsx';
import { bacaGambar } from '../gambar.js';

const FILTER = [
  { id: 'semua', label: 'Semua' },
  { id: STATUS.MENUNGGU, label: 'Menunggu' },
  { id: STATUS.DIVERIFIKASI, label: 'Terverifikasi' },
  { id: STATUS.BERANGKAT, label: 'Di jalan' },
  { id: STATUS.TIBA, label: 'Tiba' },
  { id: STATUS.DIBATALKAN, label: 'Dibatalkan' },
];

const JENIS_KLAIM = ['Kurang berat', 'Barang rusak', 'Salah grade', 'Lainnya'];

export default function Pesanan({ state, aksi, onDokumen }) {
  const [filter, setFilter] = useState('semua');
  const [form, setForm] = useState(null);
  const [galat, setGalat] = useState('');
  const [lihat, setLihat] = useState(null);
  const [fnbForm, setFnbForm] = useState(null);

  const bukaForm = (id) => {
    setForm({ id, jenis: JENIS_KLAIM[0], berat: '', catatan: '' });
    setGalat('');
  };

  const ubahForm = (kunci, nilai) => {
    setForm((f) => ({ ...f, [kunci]: nilai }));
    setGalat('');
  };

  const kirimKlaim = (p) => {
    if (!form.catatan.trim()) {
      setGalat('Tuliskan kondisi barang secara singkat.');
      return;
    }
    aksi.ajukanKlaim(p.id, {
      jenis: form.jenis,
      berat: Math.max(0, Number(form.berat) || 0),
      catatan: form.catatan.trim(),
    });
    setForm(null);
    setGalat('');
  };

  const bukaBuktiFnb = (id) =>
    setFnbForm({ id, foto: '', catatan: '', galat: '' });

  const pilihFotoFnb = async (e) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    try {
      const foto = await bacaGambar(berkas);
      setFnbForm((f) => ({ ...f, foto, galat: '' }));
    } catch (err) {
      setFnbForm((f) => ({ ...f, galat: err.message }));
    }
  };

  const simpanBuktiFnb = (p) => {
    aksi.catatBuktiFnb(p.id, {
      penerima: p.fnb,
      catatan: fnbForm.catatan.trim() || 'Barang diterima sesuai surat jalan.',
      foto: fnbForm.foto || (p.buktiFnb?.foto ?? ''),
      waktu: new Date().toISOString(),
    });
    setFnbForm(null);
  };

  const daftar = useMemo(() => {
    const hasil =
      filter === 'semua' ? state.pesanan : state.pesanan.filter((p) => p.status === filter);
    return [...hasil].sort((a, b) => b.jejak[0].waktu.localeCompare(a.jejak[0].waktu));
  }, [state.pesanan, filter]);

  const hitung = (id) =>
    id === 'semua' ? state.pesanan.length : state.pesanan.filter((p) => p.status === id).length;

  return (
    <>
      <Kepala
        judul="Pesanan"
        keterangan="Pantau status, kurir, dan bukti terima. Riwayat diambil dari setiap perubahan yang tercatat."
      />

      <div className="filter-baris" role="group" aria-label="Filter status pesanan">
        {FILTER.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip-filter"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span>{hitung(f.id)}</span>
          </button>
        ))}
      </div>

      {daftar.length === 0 ? (
        <Panel>
          <Kosong
            judul="Belum ada pesanan pada filter ini."
            lanjut="Pilih filter Semua, atau buat pre-order baru dari katalog."
          />
        </Panel>
      ) : (
        <div className="daftar-pesanan">
          {daftar.map((p) => (
            <article className="pesanan-kartu" key={p.id}>
              <div className="pesanan-atas">
                <div>
                  <h3>
                    {p.id} · {p.komoditas} <Grade grade={p.grade} />
                  </h3>
                  <p>
                    {p.fnb} · {p.volume} kg · {rupiah(p.nilai)}
                  </p>
                </div>
                <div className="pesanan-lencana">
                  <Status status={p.status} />
                  {p.status === STATUS.BERANGKAT ? <Tahap tahap={p.tahapKurir} /> : null}
                </div>
              </div>

              <dl className="rincian rincian-grid">
                <div>
                  <dt>Pembeli FnB</dt>
                  <dd>{p.fnb}</dd>
                </div>
                <div>
                  <dt>Volume</dt>
                  <dd>{p.volume} kg</dd>
                </div>
                <div>
                  <dt>Bagian petani</dt>
                  <dd>{rupiah(p.bagianPetani)}</dd>
                </div>
                <div>
                  <dt>Komisi 15%</dt>
                  <dd>{rupiah(p.komisi)}</dd>
                </div>
                <div>
                  <dt>Perkiraan tiba</dt>
                  <dd>{formatTanggal(p.perkiraanTiba)}</dd>
                </div>
                <div>
                  <dt>Kurir</dt>
                  <dd>{p.kurir || 'Belum ditugaskan'}</dd>
                </div>
                {p.jadwalBerangkat ? (
                  <div>
                    <dt>Jadwal berangkat</dt>
                    <dd>{formatTanggal(p.jadwalBerangkat)}</dd>
                  </div>
                ) : null}
                {p.urutanRute ? (
                  <div>
                    <dt>Urutan rute</dt>
                    <dd>Titik {p.urutanRute}</dd>
                  </div>
                ) : null}
              </dl>

              {p.bukti ? (
                <div className="bukti">
                  <Ikon nama="tanda" ukuran={16} />
                  <div>
                    <strong>
                      {p.bukti.penerima === 'Ditutup admin'
                        ? 'Bukti terima dari kurir · ditutup admin'
                        : `Bukti terima dari kurir · ${p.bukti.penerima}`}
                    </strong>
                    <p>
                      {formatWaktu(p.bukti.waktu)}
                      {p.bukti.catatan ? ` · ${p.bukti.catatan}` : ''}
                    </p>
                    {p.bukti.foto ? (
                      <p className="label-kecil">Klik foto untuk memperbesar.</p>
                    ) : (
                      <p className="label-kecil">Kurir tidak melampirkan foto.</p>
                    )}
                  </div>
                  {p.bukti.foto ? (
                    <button
                      type="button"
                      className="foto-thumb"
                      title="Foto dari kurir"
                      onClick={() =>
                        setLihat({ src: p.bukti.foto, judul: `${p.id} · bukti terima dari kurir` })
                      }
                    >
                      <img src={p.bukti.foto} alt={`Bukti kurir ${p.id}`} />
                    </button>
                  ) : (
                    <span className="foto-kosong">Tanpa foto</span>
                  )}
                </div>
              ) : null}

              {p.status === STATUS.TIBA ? (
                <div className="bukti bukti-fnb">
                  <Ikon nama="tanda" ukuran={16} />
                  <div className="bukti-isi">
                    <strong>Bukti terima FnB</strong>
                    {p.buktiFnb ? (
                      <p className="label-kecil">
                        {p.buktiFnb.penerima} · {formatWaktu(p.buktiFnb.waktu)}
                        {p.buktiFnb.catatan ? ` · ${p.buktiFnb.catatan}` : ''}
                      </p>
                    ) : (
                      <p className="label-kecil">Belum ada. Unggah foto barang saat diterima.</p>
                    )}

                    {p.buktiFnb?.foto && fnbForm?.id !== p.id ? (
                      <button
                        type="button"
                        className="foto-thumb"
                        onClick={() =>
                          setLihat({
                            src: p.buktiFnb.foto,
                            judul: `${p.id} · bukti terima FnB`,
                          })
                        }
                      >
                        <img src={p.buktiFnb.foto} alt={`Bukti terima FnB ${p.id}`} />
                      </button>
                    ) : null}

                    {fnbForm?.id === p.id ? (
                      <div className="bukti-form">
                        <label htmlFor={`fnb-foto-${p.id}`}>Foto barang saat diterima (dari berkas)</label>
                        <input
                          id={`fnb-foto-${p.id}`}
                          type="file"
                          accept="image/*"
                          onChange={pilihFotoFnb}
                        />
                        {fnbForm.galat ? <p className="galat">{fnbForm.galat}</p> : null}
                        {fnbForm.foto ? (
                          <img
                            className="bukti-pratinjau"
                            src={fnbForm.foto}
                            alt={`Pratinjau bukti FnB ${p.id}`}
                          />
                        ) : null}
                        <label htmlFor={`fnb-catatan-${p.id}`}>Catatan singkat (opsional)</label>
                        <input
                          id={`fnb-catatan-${p.id}`}
                          type="text"
                          value={fnbForm.catatan}
                          onChange={(e) =>
                            setFnbForm((f) => ({ ...f, catatan: e.target.value }))
                          }
                          placeholder="Contoh: 4 krat, isi sesuai surat jalan."
                        />
                        <div className="klaim-aksi">
                          <button
                            type="button"
                            className="tombol tombol-kecil"
                            onClick={() => setFnbForm(null)}
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            className="tombol tombol-utama tombol-kecil"
                            onClick={() => simpanBuktiFnb(p)}
                          >
                            Simpan bukti
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="tombol tombol-garis tombol-kecil"
                        onClick={() => bukaBuktiFnb(p.id)}
                      >
                        {p.buktiFnb ? 'Perbarui bukti terima' : 'Unggah bukti terima'}
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              {p.alasanBatal ? <p className="alasan">Dibatalkan: {p.alasanBatal}</p> : null}
              {p.alasanGagal ? <p className="alasan">Gagal antar: {p.alasanGagal}</p> : null}

              {p.klaim ? (
                <div className={`klaim klaim-${p.klaim.status}`}>
                  <div>
                    <strong>Klaim · {p.klaim.jenis}</strong>
                    <p className="label-kecil">
                      {p.klaim.berat > 0 ? `${p.klaim.berat} kg · ` : ''}
                      {formatWaktu(p.klaim.waktu)}
                      {p.klaim.keputusan ? ` · ${p.klaim.keputusan}` : ''}
                    </p>
                    <p>{p.klaim.catatan}</p>
                  </div>
                  <span className="klaim-status">
                    {p.klaim.status === 'menunggu'
                      ? 'Menunggu keputusan'
                      : p.klaim.status === 'diterima'
                        ? 'Klaim diterima'
                        : 'Klaim ditolak'}
                  </span>
                </div>
              ) : null}

              {form && form.id === p.id ? (
                <div className="klaim-form">
                  <div className="klaim-form-baris">
                    <label htmlFor={`klaim-jenis-${p.id}`}>Jenis masalah</label>
                    <select
                      id={`klaim-jenis-${p.id}`}
                      value={form.jenis}
                      onChange={(e) => ubahForm('jenis', e.target.value)}
                    >
                      {JENIS_KLAIM.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={`klaim-berat-${p.id}`}>Berat terdampak (kg)</label>
                    <input
                      id={`klaim-berat-${p.id}`}
                      type="number"
                      min="0"
                      value={form.berat}
                      onChange={(e) => ubahForm('berat', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <label htmlFor={`klaim-catatan-${p.id}`}>Apa yang terjadi</label>
                  <textarea
                    id={`klaim-catatan-${p.id}`}
                    rows="2"
                    value={form.catatan}
                    onChange={(e) => ubahForm('catatan', e.target.value)}
                    placeholder="Contoh: timbangan 74 kg dari 80 kg, 2 ikat layu."
                  />
                  {galat ? <p className="galat">{galat}</p> : null}
                  <div className="klaim-aksi">
                    <button type="button" className="tombol tombol-kecil" onClick={() => setForm(null)}>
                      Batal
                    </button>
                    <button
                      type="button"
                      className="tombol tombol-utama tombol-kecil"
                      onClick={() => kirimKlaim(p)}
                    >
                      Kirim klaim
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="pesanan-aksi">
                <button
                  type="button"
                  className="tombol tombol-garis tombol-kecil"
                  onClick={() => onDokumen(p)}
                >
                  <Ikon nama="papan" ukuran={16} />
                  Invoice
                </button>
                {p.status === STATUS.TIBA && !p.klaim && !(form && form.id === p.id) ? (
                  <button
                    type="button"
                    className="tombol tombol-garis tombol-kecil"
                    onClick={() => bukaForm(p.id)}
                  >
                    Ajukan klaim
                  </button>
                ) : null}
              </div>

              <details className="lini-tutup">
                <summary>Riwayat {p.jejak.length + p.jejakKurir.length} kejadian</summary>
                <GarisWaktu jejak={p.jejak} jejakKurir={p.jejakKurir} bukti={p.bukti} />
              </details>
            </article>
          ))}
        </div>
      )}

      {lihat ? (
        <Foto src={lihat.src} judul={lihat.judul} onTutup={() => setLihat(null)} />
      ) : null}
    </>
  );
}
