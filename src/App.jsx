import { useEffect, useMemo, useState } from 'react';
import { PERAN } from './data.js';
import { useSimpanan } from './store.js';
import Landing from './Landing.jsx';
import Intro from './Intro.jsx';
import Dokumen from './Dokumen.jsx';
import Tur from './Tur.jsx';
import { Beta, Ikon } from './ui.jsx';
import Panen from './views/Panen.jsx';
import Katalog from './views/Katalog.jsx';
import PreOrder from './views/PreOrder.jsx';
import Pesanan from './views/Pesanan.jsx';
import Verifikasi from './views/Verifikasi.jsx';
import Rute from './views/Rute.jsx';
import Kurir from './views/Kurir.jsx';
import Dashboard from './views/Dashboard.jsx';
import Pengaturan from './views/Pengaturan.jsx';
import Panduan from './views/Panduan.jsx';
import Pendapatan from './views/Pendapatan.jsx';

const TAB = {
  panen: { label: 'Panen saya', ikon: 'daun' },
  katalog: { label: 'Katalog', ikon: 'bakul' },
  preorder: { label: 'Pre-order', ikon: 'papan' },
  pesanan: { label: 'Pesanan', ikon: 'jam' },
  verifikasi: { label: 'Verifikasi', ikon: 'tanda' },
  rute: { label: 'Rute', ikon: 'rute' },
  tugas: { label: 'Tugas', ikon: 'truk' },
  dashboard: { label: 'Dashboard', ikon: 'grafik' },
  pengaturan: { label: 'Pengaturan', ikon: 'setel' },
  panduan: { label: 'Cara pakai', ikon: 'buku' },
  pendapatan: { label: 'Pendapatan', ikon: 'grafik' },
};

const TAB_PERAN = {
  petani: ['panen', 'katalog', 'pendapatan', 'panduan'],
  fnb: ['katalog', 'preorder', 'pesanan', 'panduan'],
  admin: ['dashboard', 'verifikasi', 'rute', 'panduan'],
  kurir: ['tugas', 'rute', 'panduan'],
};

function Merek() {
  return (
    <a className="merek" href="#/">
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 21c0-6 3-9.5 8-10-0.5 6-3.5 9.5-8 10Z"
          fill="#34d3a3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M12 21C12 14 9 10.5 4 10c0.5 6 3.5 10 8 11Z"
          fill="#f3f0df"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span>PanenLangsung</span>
    </a>
  );
}

export default function App() {
  const { state, aksi, tersimpan } = useSimpanan();
  const [alamat, setAlamat] = useState(() => window.location.hash);
  const [mode, setMode] = useState(() =>
    window.location.hash.startsWith('#/app') ? 'app' : 'landing'
  );
  const [tab, setTab] = useState('dashboard');
  const [pilihan, setPilihan] = useState('');
  const [pintu, setPintu] = useState(true);
  const [dokumen, setDokumen] = useState(null);
  const [tur, setTur] = useState(true);

  const modeApp = mode === 'app';
  const peran = state.peranAktif;
  const infoPeran = PERAN.find((p) => p.id === peran) || PERAN[2];
  const daftarTab = useMemo(() => TAB_PERAN[peran] || TAB_PERAN.admin, [peran]);
  const kurirAktif = state.kurirAktif || 'K-01';
  const infoKurir = state.kurir.find((k) => k.id === kurirAktif) || state.kurir[0];

  useEffect(() => {
    const dengar = () => {
      const h = window.location.hash;
      if (h.startsWith('#/app')) setMode('app');
      else if (h === '' || h === '#' || h === '#/') {
        setMode('landing');
        setPintu(true);
      }
      setAlamat(h);
    };
    window.addEventListener('hashchange', dengar);
    return () => window.removeEventListener('hashchange', dengar);
  }, []);

  useEffect(() => {
    if (alamat.startsWith('#/app')) {
      window.scrollTo(0, 0);
      return;
    }
    if (alamat.length > 2) {
      const target = document.querySelector(alamat);
      if (target) target.scrollIntoView({ block: 'start' });
      return;
    }
    window.scrollTo(0, 0);
  }, [alamat]);

  useEffect(() => {
    try {
      setTur(!window.localStorage.getItem(`panenlangsung:tur:${peran}`));
    } catch (e) {
      setTur(false);
    }
  }, [peran]);

  useEffect(() => {
    const izin = [...daftarTab, 'pengaturan'];
    if (!izin.includes(tab)) setTab(infoPeran.tabAwal);
  }, [daftarTab, tab, infoPeran.tabAwal]);

  if (!modeApp) return <Landing />;

  const ke = (id, tujuan) => {
    const info = PERAN.find((p) => p.id === id);
    aksi.setPeran(id);
    setTab(tujuan || info.tabAwal);
    setPilihan('');
    window.scrollTo(0, 0);
  };

  if (pintu) {
    return (
      <Intro
        state={state}
        onMasuk={({ peran: id, tab: tujuan }) => {
          ke(id, tujuan);
          setPintu(false);
        }}
        onPanduan={() => {
          setTab('panduan');
          setPintu(false);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const tabAktif = [...daftarTab, 'pengaturan'].includes(tab) ? tab : daftarTab[0];
  const tutupTur = () => {
    try {
      window.localStorage.setItem(`panenlangsung:tur:${peran}`, '1');
    } catch (e) {
      /* abaikan */
    }
    setTur(false);
  };
  const gantiPeran = (id) => {
    const info = PERAN.find((p) => p.id === id);
    aksi.setPeran(id);
    setTab(info.tabAwal);
    setPilihan('');
  };

  return (
    <div className="aplikasi">
      <a className="lewat" href="#konten">
        Lewati ke konten utama
      </a>

      <aside className="sisi">
        <div className="sisi-atas">
          <Merek />
          <Beta kecil />
        </div>

        <div className="sisi-peran">
          <p className="label-kecil">Masuk sebagai</p>
          <div className="peran-daftar" role="group" aria-label="Pilih peran">
            {PERAN.map((p) => (
              <button
                key={p.id}
                type="button"
                className="peran-tombol"
                aria-pressed={peran === p.id}
                onClick={() => gantiPeran(p.id)}
              >
                {p.nama}
              </button>
            ))}
          </div>
          {peran === 'kurir' ? (
            <div className="pilih-kurir">
              <label htmlFor="kurirAktif">Kurir aktif</label>
              <select
                id="kurirAktif"
                value={kurirAktif}
                onChange={(e) => aksi.setKurirAktif(e.target.value)}
              >
                {state.kurir.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
              <p className="label-kecil">{infoKurir.kendaraan}, {infoKurir.kapasitas} kg</p>
            </div>
          ) : null}
        </div>

        <nav className="sisi-nav" aria-label="Menu aplikasi">
          {daftarTab.map((id) => (
            <button
              key={id}
              type="button"
              className="nav-tombol"
              aria-current={tabAktif === id ? 'page' : undefined}
              onClick={() => setTab(id)}
            >
              <Ikon nama={TAB[id].ikon} />
              <span>{TAB[id].label}</span>
            </button>
          ))}
          <button
            type="button"
            className="nav-tombol nav-setel"
            aria-current={tabAktif === 'pengaturan' ? 'page' : undefined}
            onClick={() => setTab('pengaturan')}
          >
            <Ikon nama="setel" />
            <span>Pengaturan</span>
          </button>
        </nav>

        <div className="sisi-kaki">
          <p className="sisi-catatan">{infoPeran.ringkas}</p>
          <button
            type="button"
            className="tombol tombol-garis tombol-kecil"
            onClick={() => {
              setPintu(true);
              window.scrollTo(0, 0);
            }}
          >
            <Ikon nama="kembali" ukuran={16} />
            Halaman pembuka
          </button>
          <a className="tombol tombol-garis tombol-kecil" href="#/">
            <Ikon nama="kembali" ukuran={16} />
            Landing
          </a>
        </div>
      </aside>

      <div className="isi">
        <header className="atas">
          <div className="atas-jalur">
            <span>{infoPeran.nama}</span>
            <span className="atas-pisah">/</span>
            <strong>{TAB[tabAktif].label}</strong>
          </div>
          <div className="atas-kanan">
            <span className="simpan" aria-live="polite">
              {tersimpan}
            </span>
            <button
              type="button"
              className="atas-tautan atas-tombol"
              onClick={() => {
                setPintu(true);
                window.scrollTo(0, 0);
              }}
            >
              Halaman pembuka
            </button>
            <a className="atas-tautan" href="#/">
              Lihat landing
            </a>
          </div>
        </header>

        <main className="utama" id="konten">
          {tur && tabAktif !== 'panduan' ? <Tur peran={peran} onTutup={tutupTur} /> : null}
          {tabAktif === 'panen' ? <Panen state={state} aksi={aksi} /> : null}
          {tabAktif === 'katalog' ? (
            <Katalog
              state={state}
              peran={peran}
              onPesan={(id) => {
                setPilihan(id);
                setTab('preorder');
              }}
            />
          ) : null}
          {tabAktif === 'preorder' ? (
            <PreOrder
              state={state}
              aksi={aksi}
              pilihan={pilihan}
              setPilihan={setPilihan}
              onLihatPesanan={() => setTab('pesanan')}
            />
          ) : null}
          {tabAktif === 'pesanan' ? (
            <Pesanan
              state={state}
              peran={peran}
              aksi={aksi}
              onDokumen={(pesanan) => setDokumen({ jenis: 'invoice', pesanan })}
            />
          ) : null}
          {tabAktif === 'verifikasi' ? <Verifikasi state={state} aksi={aksi} /> : null}
          {tabAktif === 'rute' ? (
            <Rute
              state={state}
              peran={peran}
              kurirAktif={kurirAktif}
              onDokumen={(pesanan) => setDokumen({ jenis: 'surat', pesanan })}
            />
          ) : null}
          {tabAktif === 'tugas' ? (
            <Kurir state={state} aksi={aksi} kurirAktif={kurirAktif} />
          ) : null}
          {tabAktif === 'dashboard' ? <Dashboard state={state} /> : null}
          {tabAktif === 'pengaturan' ? (
            <Pengaturan state={state} aksi={aksi} />
          ) : null}
          {tabAktif === 'panduan' ? <Panduan onKe={ke} /> : null}
          {tabAktif === 'pendapatan' ? <Pendapatan state={state} /> : null}
        </main>

        <footer className="kaki">
          <span>PanenLangsung beta tertutup</span>
          <span>Data contoh, tersimpan di peramban ini, tanpa server dan tanpa pembayaran.</span>
        </footer>
      </div>

      {dokumen ? (
        <Dokumen
          jenis={dokumen.jenis}
          pesanan={dokumen.pesanan}
          state={state}
          onTutup={() => setDokumen(null)}
        />
      ) : null}
    </div>
  );
}
