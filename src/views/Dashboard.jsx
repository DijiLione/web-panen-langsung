import { useMemo } from 'react';
import {
  KOMISI,
  STATUS,
  TAHAP,
  formatTanggal,
  formatWaktu,
  persen,
  rupiah,
  sudahBerangkat,
} from '../data.js';
import { Grade, Kepala, Kpi, Kosong, Panel, Progres, Status, Tahap } from '../ui.jsx';

export default function Dashboard({ state }) {
  const m = useMemo(() => {
    const tiba = state.pesanan.filter((p) => p.status === STATUS.TIBA);
    const gmv = tiba.reduce((s, p) => s + p.nilai, 0);
    const komisi = gmv * KOMISI;
    const bagianPetani = gmv * (1 - KOMISI);
    const nilaiTengkulak = tiba.reduce((s, p) => {
      const t = state.tanaman.find((x) => x.id === p.tanamanId);
      return s + (t ? t.hargaTengkulak * p.volume : 0);
    }, 0);
    const margin =
      nilaiTengkulak > 0 ? ((bagianPetani - nilaiTengkulak) / nilaiTengkulak) * 100 : null;

    const dipanen = state.tanaman.reduce((s, t) => s + t.volume, 0);
    const terpakai = state.pesanan
      .filter((p) => p.status !== STATUS.DIBATALKAN || sudahBerangkat(p))
      .reduce((s, p) => s + p.volume, 0);
    const takTerpesan = Math.max(0, dipanen - terpakai);
    const gagal = state.pesanan
      .filter((p) => p.tahapKurir === TAHAP.GAGAL)
      .reduce((s, p) => s + p.volume, 0);
    const limbah = dipanen > 0 ? ((takTerpesan + gagal) / dipanen) * 100 : null;
    const isi = dipanen > 0 ? (terpakai / dipanen) * 100 : null;

    const onTime = tiba.filter((p) => {
      const capai = p.jejak.find((j) => j.status === STATUS.TIBA);
      return capai && capai.waktu.slice(0, 10) <= p.perkiraanTiba;
    }).length;
    const onTimePersen = tiba.length > 0 ? (onTime / tiba.length) * 100 : null;

    const perKomoditas = {};
    for (const p of tiba) {
      perKomoditas[p.komoditas] = (perKomoditas[p.komoditas] || 0) + p.nilai;
    }
    const komoditas = Object.entries(perKomoditas).sort((a, b) => b[1] - a[1]);
    const maksKomoditas = komoditas.length ? komoditas[0][1] : 1;

    const status = [
      STATUS.MENUNGGU,
      STATUS.DIVERIFIKASI,
      STATUS.BERANGKAT,
      STATUS.TIBA,
      STATUS.DIBATALKAN,
    ].reduce((akum, s) => {
      akum[s] = state.pesanan.filter((p) => p.status === s).length;
      return akum;
    }, {});

    const terbaru = [...state.pesanan]
      .sort((a, b) => b.jejak[0].waktu.localeCompare(a.jejak[0].waktu))
      .slice(0, 6);

    return {
      tiba,
      gmv,
      komisi,
      bagianPetani,
      nilaiTengkulak,
      margin,
      dipanen,
      terpakai,
      takTerpesan,
      gagal,
      limbah,
      isi,
      onTime,
      onTimePersen,
      komoditas,
      maksKomoditas,
      status,
      terbaru,
      aktif: state.pesanan.filter((p) => p.status === STATUS.BERANGKAT).length,
      rata: tiba.length ? gmv / tiba.length : 0,
    };
  }, [state]);

  return (
    <>
      <Kepala
        judul="Ringkasan operasi"
        keterangan="Semua angka dihitung dari pesanan dan panen yang tercatat. Tidak ada nilai yang ditempel."
      />

      <div className="kpi-grid kpi-grid-utama">
        <Kpi
          label="GMV selesai"
          nilai={rupiah(m.gmv)}
          catatan={`${m.tiba.length} pesanan tiba`}
          lebar
        />
        <Kpi
          label="Margin petani vs tengkulak"
          nilai={m.margin === null ? '-' : `${m.margin >= 0 ? '+' : ''}${persen(m.margin)}`}
          catatan="Bagian petani dibanding nilai tengkulak"
          aksen
        />
      </div>

      <div className="kpi-grid kpi-grid-3">
        <Kpi label="Komisi platform 15%" nilai={rupiah(m.komisi)} catatan="Dari nilai transaksi selesai" />
        <Kpi
          label="Isi panen terserap"
          nilai={m.isi === null ? '-' : persen(m.isi)}
          catatan={`${m.terpakai} kg dari ${m.dipanen} kg`}
        />
        <Kpi
          label="Tepat waktu"
          nilai={m.onTimePersen === null ? '-' : persen(m.onTimePersen)}
          catatan={`${m.onTime} dari ${m.tiba.length} pesanan tiba sesuai target`}
        />
        <Kpi label="Rata-rata pesanan" nilai={rupiah(m.rata)} catatan="Nilai per pesanan selesai" />
        <Kpi
          label="Limbah terhitung"
          nilai={m.limbah === null ? '-' : persen(m.limbah)}
          catatan={`${m.takTerpesan} kg tak terpesan, ${m.gagal} kg gagal antar`}
        />
        <Kpi label="Pengiriman aktif" nilai={m.aktif} catatan="Pesanan di tangan kurir" />
      </div>

      <div className="dua-kolom dua-kolom-dash">
        <Panel judul="GMV per komoditas" keterangan="Hanya dari pesanan yang sudah tiba.">
          {m.komoditas.length === 0 ? (
            <Kosong
              judul="Belum ada pesanan selesai."
              lanjut="Setelah kurir menyelesaikan antar, komoditas dan nilainya muncul di sini."
            />
          ) : (
            <div className="grafik">
              {m.komoditas.map(([nama, nilai]) => (
                <div className="grafik-baris" key={nama}>
                  <span className="grafik-label">{nama}</span>
                  <div className="grafik-rel">
                    <span style={{ width: `${(nilai / m.maksKomoditas) * 100}%` }} />
                  </div>
                  <span className="grafik-nilai">{rupiah(nilai)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="rumus">
            GMV = jumlah nilai pesanan berstatus tiba. Komisi = 15% x GMV. Bagian petani = 85% x GMV.
          </p>
        </Panel>

        <Panel judul="Sebaran status" keterangan="Lima status pesanan. Status panen tersedia dan habis dihitung terpisah.">
          <div className="fungel">
            {Object.entries(m.status).map(([s, n]) => (
              <div className="fungel-baris" key={s}>
                <Status status={s} />
                <div className="fungel-rel">
                  <span
                    style={{
                      width: `${state.pesanan.length ? (n / state.pesanan.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <strong>{n}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="dua-kolom dua-kolom-dash">
        <Panel judul="Dasar perhitungan" keterangan="Bisa diperiksa ulang dari riwayat pesanan.">
          <dl className="rincian">
            <div>
              <dt>Nilai pesanan tiba (GMV)</dt>
              <dd>{rupiah(m.gmv)}</dd>
            </div>
            <div>
              <dt>Bagian petani, 85% dari GMV</dt>
              <dd>{rupiah(m.bagianPetani)}</dd>
            </div>
            <div>
              <dt>Nilai tengkulak untuk volume yang sama</dt>
              <dd>{rupiah(m.nilaiTengkulak)}</dd>
            </div>
            <div>
              <dt>Volume dipanen</dt>
              <dd>{m.dipanen} kg</dd>
            </div>
            <div>
              <dt>Volume terpesan, termasuk yang gagal antar</dt>
              <dd>{m.terpakai} kg</dd>
            </div>
            <div>
              <dt>Volume tak terpesan</dt>
              <dd>{m.takTerpesan} kg</dd>
            </div>
            <div>
              <dt>Volume gagal antar</dt>
              <dd>{m.gagal} kg</dd>
            </div>
            <div>
              <dt>Limbah terhitung</dt>
              <dd>
                {m.limbah === null ? '-' : persen(m.limbah)} dari volume dipanen
              </dd>
            </div>
          </dl>
          <p className="catatan-bawah">
            Limbah = volume tak terpesan ditambah volume gagal antar, dibagi volume dipanen. Target
            studi kasus: margin petani +20%, limbah mendekati 0% dari sebelumnya 30%, komisi 15%.
          </p>
        </Panel>

        <Panel judul="Kinerja kurir" keterangan="Dihitung dari pesanan yang ditugaskan.">
          <div className="tabel">
            {state.kurir.map((k) => {
              const tugas = state.pesanan.filter((p) => p.kurirId === k.id);
              const selesai = tugas.filter((p) => p.status === STATUS.TIBA);
              const aktif = tugas.filter((p) => p.status === STATUS.BERANGKAT);
              const berat = selesai.reduce((s, p) => s + p.volume, 0);
              return (
                <div className="tabel-baris tabel-baris-kurir" key={k.id}>
                  <div>
                    <h3>{k.nama}</h3>
                    <p className="label-kecil">
                      {k.kendaraan} · {k.area}
                    </p>
                  </div>
                  <div>
                    <span className="label-kecil">Selesai</span>
                    <p className="angka-baris">{selesai.length}</p>
                  </div>
                  <div>
                    <span className="label-kecil">Aktif</span>
                    <p className="angka-baris">{aktif.length}</p>
                  </div>
                  <div>
                    <span className="label-kecil">Berat selesai</span>
                    <p className="angka-baris">{berat} kg</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel judul="Pesanan terbaru" keterangan="Enam aktivitas terakhir." padat>
        {m.terbaru.length === 0 ? (
          <Kosong
            judul="Belum ada pesanan."
            lanjut="Mulai dari peran FnB untuk membuat pre-order pertama."
          />
        ) : (
          <div className="tabel">
            {m.terbaru.map((p) => (
              <div className="tabel-baris tabel-baris-pesanan" key={p.id}>
                <div>
                  <h3>
                    {p.id} · {p.komoditas} <Grade grade={p.grade} />
                  </h3>
                  <p className="label-kecil">
                    {p.fnb} · {p.volume} kg · {formatWaktu(p.jejak[0].waktu)}
                  </p>
                </div>
                <div>
                  <Status status={p.status} />
                </div>
                <div className="angka-baris">{rupiah(p.nilai)}</div>
                <div className="label-kecil">
                  {p.status === STATUS.BERANGKAT ? <Tahap tahap={p.tahapKurir} /> : formatTanggal(p.perkiraanTiba)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
