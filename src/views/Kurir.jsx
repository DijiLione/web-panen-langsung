import { useState } from 'react';
import { STATUS, TAHAP, formatTanggal, formatWaktu, rupiah } from '../data.js';
import { Ikon, Kepala, Kosong, Kpi, Panel, Tahap } from '../ui.jsx';
import Foto from '../Foto.jsx';
import { bacaGambar } from '../gambar.js';

const URUT_TAHAP = [
  { tahap: TAHAP.DITUGASKAN, label: 'Ditugaskan' },
  { tahap: TAHAP.DIAMBIL, label: 'Diambil' },
  { tahap: TAHAP.JALAN, label: 'Di jalan' },
  { tahap: TAHAP.TERKIRIM, label: 'Terkirim' },
];

function indeksTahap(tahap) {
  return URUT_TAHAP.findIndex((x) => x.tahap === tahap);
}

export default function Kurir({ state, aksi, kurirAktif }) {
  const [ambil, setAmbil] = useState({});
  const [galat, setGalat] = useState({});
  const [lihat, setLihat] = useState(null);

  const kurir = state.kurir.find((k) => k.id === kurirAktif) || state.kurir[0];
  const tugas = state.pesanan.filter(
    (p) => p.kurirId === kurir.id && p.status === STATUS.BERANGKAT
  );
  const selesai = state.pesanan
    .filter((p) => p.kurirId === kurir.id && p.status === STATUS.TIBA)
    .sort((a, b) => (b.bukti?.waktu || '').localeCompare(a.bukti?.waktu || ''));
  const berat = tugas.reduce((s, p) => s + p.volume, 0);

  const ubahBukti = (id, kunci, nilai) => {
    setAmbil((a) => ({ ...a, [id]: { ...(a[id] || {}), [kunci]: nilai } }));
    setGalat((g) => ({ ...g, [id]: undefined }));
  };

  const selesaikan = (p) => {
    const b = ambil[p.id] || {};
    if (!b.penerima || !b.penerima.trim()) {
      setGalat((g) => ({ ...g, [p.id]: 'Isi nama penerima barang.' }));
      return;
    }
    if (!b.foto) {
      setGalat((g) => ({ ...g, [p.id]: 'Lampirkan foto bukti tiba sebelum menutup pesanan.' }));
      return;
    }
    aksi.selesaikanAntar(p.id, {
      penerima: b.penerima.trim(),
      catatan: (b.catatan || '').trim(),
      foto: b.foto || '',
      waktu: new Date().toISOString(),
    });
    setAmbil((a) => ({ ...a, [p.id]: {} }));
  };

  const pilihFoto = async (p, file) => {
    try {
      const data = await bacaGambar(file);
      ubahBukti(p.id, 'foto', data);
    } catch (e) {
      setGalat((g) => ({ ...g, [p.id]: e.message }));
    }
  };

  const laporkanGagal = (p) => {
    const b = ambil[p.id] || {};
    if (!b.alasan || !b.alasan.trim()) {
      setGalat((g) => ({ ...g, [p.id]: 'Tulis alasan gagal antar.' }));
      return;
    }
    aksi.gagalAntar(p.id, b.alasan.trim());
    setAmbil((a) => ({ ...a, [p.id]: {} }));
  };

  return (
    <>
      <Kepala
        judul={`Tugas ${kurir.nama}`}
        keterangan={`${kurir.kendaraan} · ${kurir.area} · kapasitas ${kurir.kapasitas} kg`}
      />

      <div className="kpi-grid kpi-grid-3">
        <Kpi label="Tugas aktif" nilai={tugas.length} catatan={`${berat} kg diangkut`} />
        <Kpi label="Selesai" nilai={selesai.length} catatan="Total yang sudah diterima FnB" />
        <Kpi
          label="Bukti terakhir"
          nilai={selesai[0] ? selesai[0].bukti?.penerima || '-' : '-'}
          catatan={selesai[0] ? formatWaktu(selesai[0].bukti?.waktu) : 'Belum ada'}
          aksen
        />
      </div>

      <Panel judul="Tugas hari ini" keterangan="Ikuti urutan. Setiap langkah tercatat waktunya.">
        {tugas.length === 0 ? (
          <Kosong
            judul="Belum ada tugas untukmu."
            lanjut="Admin akan menugaskan setelah pesanan diverifikasi. Cek lagi setelah itu."
          />
        ) : (
          <div className="daftar-tugas">
            {tugas.map((p) => {
              const b = ambil[p.id] || {};
              const g = galat[p.id];
              const aktif = indeksTahap(p.tahapKurir);
              return (
                <article className="tugas-kartu" key={p.id}>
                  <div className="tugas-atas">
                    <div>
                      <h3>
                        {p.fnb} <span className="label-kecil">titik {p.urutanRute || '-'}</span>
                      </h3>
                      <p className="label-kecil">
                        {p.id} · {p.komoditas} · {p.volume} kg · {rupiah(p.nilai)}
                      </p>
                    </div>
                    <Tahap tahap={p.tahapKurir} />
                  </div>

                  <ol className="langkah" aria-label="Tahapan pengiriman">
                    {URUT_TAHAP.map((t, i) => (
                      <li
                        key={t.tahap}
                        className={
                          i < aktif ? 'langkah-selesai' : i === aktif ? 'langkah-aktif' : ''
                        }
                      >
                        <span className="langkah-nomor">{i + 1}</span>
                        <span>{t.label}</span>
                      </li>
                    ))}
                  </ol>

                  <p className="label-kecil">
                    Panen {formatTanggal(
                      state.tanaman.find((t) => t.id === p.tanamanId)?.tanggalPanen
                    )}{' '}
                    · dari {state.tanaman.find((t) => t.id === p.tanamanId)?.asalKebun}
                  </p>

                  {p.tahapKurir === TAHAP.DITUGASKAN ? (
                    <div className="tugas-aksi">
                      <button
                        type="button"
                        className="tombol tombol-utama tombol-kecil"
                        onClick={() =>
                          aksi.ubahTahapKurir(p.id, TAHAP.DIAMBIL, 'Barang dimuat di kebun')
                        }
                      >
                        Konfirmasi ambil di kebun
                      </button>
                    </div>
                  ) : null}

                  {p.tahapKurir === TAHAP.DIAMBIL ? (
                    <div className="tugas-aksi">
                      <button
                        type="button"
                        className="tombol tombol-utama tombol-kecil"
                        onClick={() =>
                          aksi.ubahTahapKurir(p.id, TAHAP.JALAN, 'Berangkat ke tujuan')
                        }
                      >
                        Mulai antar
                      </button>
                    </div>
                  ) : null}

                  {p.tahapKurir === TAHAP.JALAN ? (
                    <div className="bukti-form">
                      <div className="medan">
                        <label htmlFor={`penerima-${p.id}`}>Nama penerima</label>
                        <input
                          id={`penerima-${p.id}`}
                          value={b.penerima || ''}
                          onChange={(e) => ubahBukti(p.id, 'penerima', e.target.value)}
                          placeholder="Nama yang menerima barang"
                        />
                      </div>
                      <div className="medan">
                        <label htmlFor={`catatan-${p.id}`}>Catatan serah terima</label>
                        <input
                          id={`catatan-${p.id}`}
                          value={b.catatan || ''}
                          onChange={(e) => ubahBukti(p.id, 'catatan', e.target.value)}
                          placeholder="Jumlah krat, kondisi barang"
                        />
                      </div>
                      <div className="medan medan-penuh kurir-foto">
                        <label htmlFor={`foto-${p.id}`}>Foto bukti tiba (wajib, dari berkas)</label>
                        {b.foto ? (
                          <div className="kurir-foto-pratinjau">
                            <button
                              type="button"
                              className="foto-thumb"
                              onClick={() =>
                                setLihat({ src: b.foto, judul: `${p.id} · ${p.fnb}` })
                              }
                            >
                              <img src={b.foto} alt={`Pratinjau bukti ${p.id}`} />
                            </button>
                            <div>
                              <p className="label-kecil">Foto siap dikirim bersama bukti terima.</p>
                              <button
                                type="button"
                                className="tombol tombol-kecil"
                                onClick={() => ubahBukti(p.id, 'foto', '')}
                              >
                                Hapus foto
                              </button>
                            </div>
                          </div>
                        ) : (
                          <input
                            id={`foto-${p.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => pilihFoto(p, e.target.files?.[0])}
                          />
                        )}
                        <p className="petunjuk">
                          Wajib. Foto dari kamera atau galeri, otomatis dikecilkan sebelum
                          disimpan.
                        </p>
                      </div>

                      <div className="medan">
                        <label htmlFor={`gagal-${p.id}`}>Kalau gagal, tulis alasan</label>
                        <input
                          id={`gagal-${p.id}`}
                          value={b.alasan || ''}
                          onChange={(e) => ubahBukti(p.id, 'alasan', e.target.value)}
                          placeholder="Contoh: dapur tutup, tidak ada penerima"
                        />
                      </div>
                      {g ? <p className="galat">{g}</p> : null}
                      <div className="aksi-baris">
                        <button
                          type="button"
                          className="tombol tombol-utama tombol-kecil"
                          onClick={() => selesaikan(p)}
                        >
                          Selesaikan antar
                        </button>
                        <button
                          type="button"
                          className="tombol tombol-kecil"
                          onClick={() => laporkanGagal(p)}
                        >
                          Laporkan gagal
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {p.tahapKurir === TAHAP.GAGAL ? (
                    <p className="alasan">Gagal antar: {p.alasanGagal}. Menunggu admin menutup.</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel judul="Selesai diantar" keterangan="Termasuk bukti terima yang dicatat kurir.">
        {selesai.length === 0 ? (
          <Kosong
            judul="Belum ada pengiriman selesai."
            lanjut="Setelah kamu menyelesaikan antar, penerima dan waktunya tercatat di sini."
          />
        ) : (
          <div className="tabel">
            {selesai.map((p) => (
              <div className="tabel-baris" key={p.id}>
                <div>
                  <h3>
                    {p.id} · {p.fnb}
                  </h3>
                  <p className="label-kecil">
                    {p.komoditas} {p.volume} kg ·{' '}
                    {p.bukti?.penerima === 'Ditutup admin'
                      ? 'ditutup admin, bukti tidak tercatat'
                      : `diterima ${p.bukti?.penerima || '-'}`}
                  </p>
                </div>
                <div className="label-kecil">{formatWaktu(p.bukti?.waktu || p.jejak.at(-1).waktu)}</div>
                <div className="bukti-foto-sel">
                  {p.bukti?.foto ? (
                    <button
                      type="button"
                      className="foto-thumb foto-thumb-kecil"
                      onClick={() => setLihat({ src: p.bukti.foto, judul: `${p.id} · ${p.fnb}` })}
                    >
                      <img src={p.bukti.foto} alt={`Bukti ${p.id}`} />
                    </button>
                  ) : (
                    <span className="label-kecil">Tanpa foto</span>
                  )}
                  <span className="tanda-selesai">
                    <Ikon nama="tanda" ukuran={16} /> Terkirim
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {lihat ? (
        <Foto src={lihat.src} judul={lihat.judul} onTutup={() => setLihat(null)} />
      ) : null}
    </>
  );
}
