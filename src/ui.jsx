import { GRADE, LABEL, STATUS, TAHAP, formatTanggal, formatJam, formatWaktu } from './data.js';

export function Ikon({ nama, ukuran = 18 }) {
  const p = {
    width: ukuran,
    height: ukuran,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'square',
    strokeLinejoin: 'miter',
    'aria-hidden': 'true',
    focusable: 'false',
  };
  const isi = {
    daun: <path d="M12 21C12 13 16 8 21 7c0 8-4 13-9 14Zm0 0C12 13 8 8 3 7c0 8 4 13 9 14Z" />,
    bakul: (
      <>
        <path d="M4 9h16l-2 11H6L4 9Z" />
        <path d="M8 9V6a4 4 0 0 1 8 0v3" />
        <path d="M9 13v3M15 13v3" />
      </>
    ),
    papan: (
      <>
        <path d="M6 3h9l4 4v14H6V3Z" />
        <path d="M15 3v4h4M9 11h6M9 15h6M9 19h4" />
      </>
    ),
    rute: (
      <>
        <path d="M6 20V9a3 3 0 0 1 3-3h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h9" />
        <path d="M6 20h.01M18 18h.01" />
      </>
    ),
    grafik: (
      <>
        <path d="M4 20V4M4 20h16" />
        <path d="M8 16v-5M12 16V7M16 16v-3M20 16v-8" />
      </>
    ),
    setel: (
      <>
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
      </>
    ),
    truk: (
      <>
        <path d="M3 6h11v11H3V6Z" />
        <path d="M14 10h4l3 3v4h-7v-7Z" />
        <path d="M7 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      </>
    ),
    tanda: (
      <>
        <path d="M4 12l5 5L20 6" />
      </>
    ),
    silang: <path d="M6 6l12 12M18 6L6 18" />,
    jam: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    panah: <path d="M5 12h14M13 6l6 6-6 6" />,
    kembali: <path d="M19 12H5M11 18l-6-6 6-6" />,
    buku: (
      <>
        <path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z" />
        <path d="M20 4h-3a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h3V4Z" />
      </>
    ),
    cari: (
      <>
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="M16 16l5 5" />
      </>
    ),
  }[nama];
  return (
    <svg {...p} className="ikon">
      {isi}
    </svg>
  );
}

export function Kepala({ judul, keterangan, aksi }) {
  return (
    <div className="kepala">
      <div>
        <h1>{judul}</h1>
        {keterangan ? <p>{keterangan}</p> : null}
      </div>
      {aksi ? <div className="kepala-aksi">{aksi}</div> : null}
    </div>
  );
}

export function Beta({ kecil }) {
  return (
    <span className={`beta ${kecil ? 'beta-kecil' : ''}`} title="Versi beta tertutup">
      <span className="beta-titik" aria-hidden="true" />
      Beta tertutup
    </span>
  );
}

export function Status({ status }) {
  return <span className={`bidik bidik-${status}`}>{LABEL[status] || status}</span>;
}

export function Tahap({ tahap }) {
  return <span className={`bidik bidik-tahap-${tahap}`}>{LABEL[tahap] || tahap}</span>;
}

export function Grade({ grade }) {
  return <span className={`grade grade-${grade.toLowerCase()}`}>{GRADE[grade] || grade}</span>;
}

export function Panel({ judul, keterangan, aksi, children, padat }) {
  return (
    <section className={`panel ${padat ? 'panel-padat' : ''}`}>
      {(judul || aksi) && (
        <div className="panel-kepala">
          <div>
            {judul ? <h2>{judul}</h2> : null}
            {keterangan ? <p>{keterangan}</p> : null}
          </div>
          {aksi}
        </div>
      )}
      {children}
    </section>
  );
}

export function Kosong({ judul, lanjut, aksi }) {
  return (
    <div className="kosong">
      <p className="kosong-judul">{judul}</p>
      {lanjut ? <p>{lanjut}</p> : null}
      {aksi ? <div className="kosong-aksi">{aksi}</div> : null}
    </div>
  );
}

export function Kpi({ label, nilai, catatan, aksen, lebar }) {
  return (
    <div className={`kpi ${aksen ? 'kpi-aksen' : ''} ${lebar ? 'kpi-lebar' : ''}`}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-nilai">{nilai}</span>
      {catatan ? <span className="kpi-catatan">{catatan}</span> : null}
    </div>
  );
}

export function Progres({ nilai, maks, label }) {
  const persen = maks > 0 ? Math.min(100, Math.round((nilai / maks) * 100)) : 0;
  return (
    <div className="progres" role="img" aria-label={label || `${persen}%`}>
      <span style={{ width: `${persen}%` }} />
    </div>
  );
}

export function Baris({ children, kelas }) {
  return <div className={`tabel-baris ${kelas || ''}`}>{children}</div>;
}

export function GarisWaktu({ jejak, jejakKurir, bukti }) {
  const gabung = [
    ...jejak.map((j) => ({
      kunci: `s-${j.waktu}`,
      teks: LABEL[j.status] || j.status,
      waktu: j.waktu,
      jenis: 'status',
      status: j.status,
      catatan: j.catatan,
    })),
    ...jejakKurir.map((j) => ({
      kunci: `k-${j.waktu}`,
      teks: LABEL[j.tahap] || j.tahap,
      waktu: j.waktu,
      jenis: 'kurir',
      tahap: j.tahap,
      catatan: j.catatan,
    })),
  ].sort((a, b) => a.waktu.localeCompare(b.waktu));

  return (
    <ol className="lini" aria-label="Riwayat pesanan">
      {gabung.map((j) => (
        <li key={j.kunci} className={`lini-${j.jenis}`}>
          <span className="lini-waktu">{formatWaktu(j.waktu)}</span>
          <span className="lini-teks">
            {j.jenis === 'status' ? <Status status={j.status} /> : <Tahap tahap={j.tahap} />}
            {j.catatan ? <em>{j.catatan}</em> : null}
          </span>
        </li>
      ))}
      {bukti ? (
        <li className="lini-bukti">
          <span className="lini-waktu">{formatWaktu(bukti.waktu)}</span>
          <span className="lini-teks">
            Bukti terima: {bukti.penerima}
            {bukti.catatan ? <em>{bukti.catatan}</em> : null}
          </span>
        </li>
      ) : null}
    </ol>
  );
}

export function Stiker({ children }) {
  return <span className="stiker">{children}</span>;
}

export function tanggalAtau(iso) {
  return iso ? formatTanggal(iso) : '-';
}

export function jamAtau(iso) {
  return iso ? formatJam(iso) : '-';
}

export function usia(jam) {
  if (jam < 1) return 'baru saja';
  if (jam < 24) return `${Math.floor(jam)} jam`;
  return `${Math.floor(jam / 24)} hari`;
}

export const SEMUA_STATUS = [STATUS.MENUNGGU, STATUS.DIVERIFIKASI, STATUS.BERANGKAT, STATUS.TIBA, STATUS.DIBATALKAN];
export const SEMUA_TAHAP = [TAHAP.DITUGASKAN, TAHAP.DIAMBIL, TAHAP.JALAN, TAHAP.TERKIRIM, TAHAP.GAGAL];
