import { useState } from 'react';
import { STATUS, TAHAP, formatTanggal, formatWaktu, rupiah, sisaVolume } from '../data.js';
import { Grade, Kepala, Kosong, Kpi, Panel, Progres, Status, Tahap, usia } from '../ui.jsx';
import Foto from '../Foto.jsx';

function jamMenunggu(p) {
  const awal = p.jejak[0].waktu;
  return (Date.now() - new Date(awal).getTime()) / 3600000;
}

export default function Verifikasi({ state, aksi }) {
  const [tolak, setTolak] = useState({ id: '', alasan: '' });
  const [tugas, setTugas] = useState({});
  const [galat, setGalat] = useState({});
  const [catatanKlaim, setCatatanKlaim] = useState({});
  const [lihat, setLihat] = useState(null);

  const menunggu = state.pesanan.filter((p) => p.status === STATUS.MENUNGGU);
  const siap = state.pesanan.filter((p) => p.status === STATUS.DIVERIFIKASI);
  const jalan = state.pesanan.filter((p) => p.status === STATUS.BERANGKAT);
  const klaim = state.pesanan.filter((p) => p.klaim && p.klaim.status === 'menunggu');
  const waktuBukti = (p) => p.buktiFnb?.waktu || p.bukti?.waktu || '';
  const bukti = [...state.pesanan]
    .filter((p) => p.status === STATUS.TIBA)
    .sort((a, b) => waktuBukti(b).localeCompare(waktuBukti(a)))
    .slice(0, 8);
  const tertua = menunggu.length
    ? Math.max(...menunggu.map((p) => jamMenunggu(p)))
    : 0;

  const ubahTugas = (id, kunci, nilai) => {
    setTugas((t) => ({ ...t, [id]: { ...(t[id] || {}), [kunci]: nilai } }));
    setGalat((g) => ({ ...g, [id]: undefined }));
  };

  const beban = (kurirId, tanggal, kecuali) =>
    state.pesanan
      .filter(
        (p) =>
          p.id !== kecuali &&
          p.kurirId === kurirId &&
          p.jadwalBerangkat === tanggal &&
          p.status !== STATUS.DIBATALKAN
      )
      .reduce((s, p) => s + p.volume, 0);

  const kirimTugas = (p) => {
    const t = tugas[p.id] || {};
    const kurirId = t.kurirId || '';
    const jadwal = t.jadwal || p.perkiraanTiba;
    const k = state.kurir.find((x) => x.id === kurirId);
    const g = {};
    if (!k) g.kurir = 'Pilih kurir.';
    if (!jadwal) g.jadwal = 'Pilih tanggal berangkat.';
    if (k) {
      const total = beban(kurirId, jadwal, p.id) + p.volume;
      if (total > k.kapasitas) {
        g.kurir = `Melebihi kapasitas ${k.nama}: ${total} kg dari ${k.kapasitas} kg.`;
      }
    }
    if (Object.keys(g).length > 0) {
      setGalat((lama) => ({ ...lama, [p.id]: g }));
      return;
    }
    aksi.tugaskanKurir(p.id, {
      kurirId,
      kurirNama: k.nama,
      jadwal,
      catatan: `${k.nama}, ${k.kendaraan}`,
    });
    setTugas((lama) => ({ ...lama, [p.id]: {} }));
  };

  return (
    <>
      <Kepala
        judul="Verifikasi dan penugasan"
        keterangan="Verifikasi sekali. Penolakan wajib beralasan. Penugasan kurir dibatasi kapasitas kendaraan."
      />

      <div className="kpi-grid kpi-grid-4">
        <Kpi label="Menunggu verifikasi" nilai={menunggu.length} catatan="Antrean masuk" />
        <Kpi
          label="Menunggu terlama"
          nilai={menunggu.length ? usia(tertua) : '-'}
          catatan="Dihitung dari waktu pesanan masuk"
        />
        <Kpi label="Siap ditugaskan" nilai={siap.length} catatan="Sudah diverifikasi" />
        <Kpi label="Sedang jalan" nilai={jalan.length} catatan="Kurir sudah membawa" aksen />
      </div>

      <Panel judul="Antrean verifikasi" keterangan={`${menunggu.length} pesanan`}>
        {menunggu.length === 0 ? (
          <Kosong
            judul="Antrean bersih."
            lanjut="Pesanan baru dari pembeli FnB akan muncul di sini. Sementara itu cek panel penugasan di bawah."
          />
        ) : (
          <div className="daftar-verifikasi">
            {menunggu.map((p) => {
              const jam = jamMenunggu(p);
              return (
                <article className="verif-baris" key={p.id}>
                  <div className="verif-identitas">
                    <h3>
                      {p.id} · {p.komoditas} <Grade grade={p.grade} />
                    </h3>
                    <p>
                      {p.fnb} · {p.volume} kg · {rupiah(p.nilai)}
                    </p>
                    <p className="label-kecil">
                      Masuk {formatWaktu(p.jejak[0].waktu)} · menunggu {usia(jam)}
                    </p>
                    {p.catatanFnb ? (
                      <p className="verif-catatan">Catatan FnB: {p.catatanFnb}</p>
                    ) : null}
                  </div>
                  <div className="verif-aksi">
                    <button
                      type="button"
                      className="tombol tombol-utama tombol-kecil"
                      onClick={() => aksi.verifikasi(p.id)}
                    >
                      Verifikasi {p.id}
                    </button>
                    <button
                      type="button"
                      className="tombol tombol-kecil"
                      onClick={() =>
                        setTolak((t) => (t.id === p.id ? { id: '', alasan: '' } : { id: p.id, alasan: '' }))
                      }
                    >
                      Tolak
                    </button>
                  </div>
                  {tolak.id === p.id ? (
                    <div className="tolak-kotak">
                      <label htmlFor={`alasan-${p.id}`}>Alasan penolakan</label>
                      <input
                        id={`alasan-${p.id}`}
                        value={tolak.alasan}
                        onChange={(e) => setTolak({ id: p.id, alasan: e.target.value })}
                        placeholder="Contoh: volume tidak sesuai kesepakatan"
                      />
                      <div className="aksi-baris">
                        <button
                          type="button"
                          className="tombol tombol-kecil"
                          disabled={!tolak.alasan.trim()}
                          onClick={() => {
                            aksi.tolak(p.id, tolak.alasan.trim());
                            setTolak({ id: '', alasan: '' });
                          }}
                        >
                          Konfirmasi tolak
                        </button>
                        <button
                          type="button"
                          className="tombol tombol-kecil"
                          onClick={() => setTolak({ id: '', alasan: '' })}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel judul="Siap ditugaskan" keterangan={`${siap.length} pesanan terverifikasi`}>
        {siap.length === 0 ? (
          <Kosong
            judul="Tidak ada pesanan menunggu kurir."
            lanjut="Verifikasi pesanan di panel atas, lalu pilih kurir dan tanggal berangkat di sini."
          />
        ) : (
          <div className="daftar-verifikasi">
            {siap.map((p) => {
              const t = tugas[p.id] || {};
              const kurirId = t.kurirId || '';
              const jadwal = t.jadwal || p.perkiraanTiba;
              const k = state.kurir.find((x) => x.id === kurirId);
              const total = k ? beban(kurirId, jadwal, p.id) + p.volume : 0;
              const g = galat[p.id] || {};
              return (
                <article className="verif-baris" key={p.id}>
                  <div className="verif-identitas">
                    <h3>
                      {p.id} · {p.komoditas} · {p.volume} kg
                    </h3>
                    <p>
                      {p.fnb} · tiba target {formatTanggal(p.perkiraanTiba)} ·{' '}
                      {rupiah(p.nilai)}
                    </p>
                    <p className="label-kecil">
                      Panen {formatTanggal(state.tanaman.find((x) => x.id === p.tanamanId)?.tanggalPanen)}
                    </p>
                  </div>

                  <div className="tugas-form">
                    <div className={`medan ${g.kurir ? 'medan-galat' : ''}`}>
                      <label htmlFor={`kurir-${p.id}`}>Kurir</label>
                      <select
                        id={`kurir-${p.id}`}
                        value={kurirId}
                        onChange={(e) => ubahTugas(p.id, 'kurirId', e.target.value)}
                        aria-invalid={g.kurir ? 'true' : undefined}
                      >
                        <option value="">Pilih kurir</option>
                        {state.kurir.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.nama} · {x.kendaraan} · {x.kapasitas} kg
                          </option>
                        ))}
                      </select>
                      {g.kurir ? <p className="galat">{g.kurir}</p> : null}
                    </div>
                    <div className={`medan ${g.jadwal ? 'medan-galat' : ''}`}>
                      <label htmlFor={`jadwal-${p.id}`}>Tanggal berangkat</label>
                      <input
                        id={`jadwal-${p.id}`}
                        type="date"
                        value={jadwal}
                        onChange={(e) => ubahTugas(p.id, 'jadwal', e.target.value)}
                      />
                      {g.jadwal ? <p className="galat">{g.jadwal}</p> : null}
                    </div>
                    {k ? (
                      <div className="kapasitas">
                        <span className="label-kecil">
                          Muatan {k.nama} pada {formatTanggal(jadwal)}
                        </span>
                        <p className="angka-baris">
                          {total} / {k.kapasitas} kg
                        </p>
                        <Progres
                          nilai={total}
                          maks={k.kapasitas}
                          label={`${total} dari ${k.kapasitas} kg terpakai`}
                        />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="tombol tombol-utama tombol-kecil"
                      onClick={() => kirimTugas(p)}
                    >
                      Tugaskan kurir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel
        judul="Sedang berjalan"
        keterangan={`${jalan.length} pesanan di tangan kurir. Kurir mencatat bukti; admin bisa menutup bila bukti tidak tercatat.`}
      >
        {jalan.length === 0 ? (
          <Kosong
            judul="Tidak ada pengiriman aktif."
            lanjut="Setelah kurir ditugaskan, pesanan pindah ke sini dan bisa dipantau sampai tiba."
          />
        ) : (
          <div className="tabel">
            {jalan.map((p) => (
              <div className="tabel-baris tabel-baris-jalan" key={p.id}>
                <div>
                  <h3>
                    {p.id} · {p.komoditas} · {p.volume} kg
                  </h3>
                  <p className="label-kecil">
                    {p.fnb} · {p.kurir} · titik {p.urutanRute || '-'}
                  </p>
                </div>
                <div className="tabel-lencana">
                  <Tahap tahap={p.tahapKurir} />
                </div>
                <div className="tabel-aksi">
                  {p.tahapKurir === TAHAP.GAGAL ? (
                    <button
                      type="button"
                      className="tombol tombol-kecil"
                      onClick={() =>
                        aksi.batalkanSetelahJalan(
                          p.id,
                          `Gagal antar: ${p.alasanGagal || 'tanpa catatan'}`
                        )
                      }
                    >
                      Tutup sebagai batal
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="tombol tombol-kecil"
                      onClick={() => aksi.tandaiTiba(p.id)}
                    >
                      Tutup sebagai tiba
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        judul="Bukti terima"
        keterangan="Foto dan catatan dari kurir, plus bukti terima yang diunggah FnB. Klik foto untuk memperbesar."
      >
        {bukti.length === 0 ? (
          <Kosong
            judul="Belum ada bukti terima."
            lanjut="Setelah kurir menyelesaikan antar, foto dan catatan penerima muncul di sini."
          />
        ) : (
          <div className="tabel">
            {bukti.map((p) => (
              <div className="tabel-baris tabel-baris-bukti" key={p.id}>
                <div className="bukti-foto-sel">
                  {p.bukti?.foto ? (
                    <button
                      type="button"
                      className="foto-thumb foto-thumb-kecil"
                      title="Foto dari kurir"
                      onClick={() => setLihat({ src: p.bukti.foto, judul: `${p.id} · ${p.fnb}` })}
                    >
                      <img src={p.bukti.foto} alt={`Bukti kurir ${p.id}`} />
                    </button>
                  ) : (
                    <span className="foto-kosong">Tanpa foto</span>
                  )}
                  {p.buktiFnb?.foto ? (
                    <button
                      type="button"
                      className="foto-thumb foto-thumb-kecil"
                      title="Foto dari FnB"
                      onClick={() =>
                        setLihat({ src: p.buktiFnb.foto, judul: `${p.id} · bukti FnB` })
                      }
                    >
                      <img src={p.buktiFnb.foto} alt={`Bukti FnB ${p.id}`} />
                    </button>
                  ) : null}
                </div>
                <div>
                  <h3>
                    {p.id} · {p.fnb}
                  </h3>
                  <p className="label-kecil">
                    Kurir:{' '}
                    {p.bukti?.penerima === 'Ditutup admin'
                      ? 'ditutup admin, bukti tidak tercatat'
                      : `diterima ${p.bukti?.penerima || '-'}`}{' '}
                    · {formatWaktu(p.bukti?.waktu || p.jejak.at(-1).waktu)}
                  </p>
                  <p className="label-kecil">
                    FnB:{' '}
                    {p.buktiFnb
                      ? `bukti diunggah ${formatWaktu(p.buktiFnb.waktu)}${
                          p.buktiFnb.foto ? '' : ' (tanpa foto)'
                        }`
                      : 'belum unggah bukti terima'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        judul="Klaim masuk"
        keterangan={`${klaim.length} klaim menunggu keputusan. Klaim hanya bisa diajukan setelah barang tiba.`}
      >
        {klaim.length === 0 ? (
          <Kosong
            judul="Tidak ada klaim."
            lanjut="Pembeli FnB bisa mengajukan klaim maksimal 2 jam setelah serah terima."
          />
        ) : (
          <div className="daftar-klaim">
            {klaim.map((p) => (
              <div className="klaim-baris" key={p.id}>
                <div>
                  <h3>
                    {p.id} · {p.komoditas} <Grade grade={p.grade} />
                  </h3>
                  <p className="label-kecil">
                    {p.fnb} · {p.klaim.jenis}
                    {p.klaim.berat > 0 ? ` · ${p.klaim.berat} kg` : ''} · {formatWaktu(p.klaim.waktu)}
                  </p>
                  <p>{p.klaim.catatan}</p>
                </div>
                <div className="klaim-keputusan">
                  <input
                    value={catatanKlaim[p.id] || ''}
                    onChange={(e) => setCatatanKlaim((c) => ({ ...c, [p.id]: e.target.value }))}
                    placeholder="Catatan keputusan (opsional)"
                    aria-label={`Catatan keputusan untuk ${p.id}`}
                  />
                  <div className="klaim-aksi">
                    <button
                      type="button"
                      className="tombol tombol-kecil"
                      onClick={() => aksi.putuskanKlaim(p.id, 'ditolak', catatanKlaim[p.id] || '')}
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      className="tombol tombol-utama tombol-kecil"
                      onClick={() => aksi.putuskanKlaim(p.id, 'diterima', catatanKlaim[p.id] || '')}
                    >
                      Setujui klaim
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel judul="Kinerja antrean" keterangan="Ringkas untuk hari ini.">
        <dl className="rincian rincian-grid">
          <div>
            <dt>Pesanan tiba</dt>
            <dd>{state.pesanan.filter((p) => p.status === STATUS.TIBA).length}</dd>
          </div>
          <div>
            <dt>Pesanan dibatalkan</dt>
            <dd>{state.pesanan.filter((p) => p.status === STATUS.DIBATALKAN).length}</dd>
          </div>
          <div>
            <dt>Gagal antar</dt>
            <dd>{state.pesanan.filter((p) => p.tahapKurir === TAHAP.GAGAL).length}</dd>
          </div>
          <div>
            <dt>Sisa volume panen</dt>
            <dd>{state.tanaman.reduce((s, t) => s + sisaVolume(t, state.pesanan), 0)} kg</dd>
          </div>
        </dl>
      </Panel>

      {lihat ? (
        <Foto src={lihat.src} judul={lihat.judul} onTutup={() => setLihat(null)} />
      ) : null}
    </>
  );
}
