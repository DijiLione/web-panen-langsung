import { useEffect, useMemo, useState } from 'react';
import { PERAN } from './data.js';
import { useSimpanan } from './store.js';
import Landing from './Landing.jsx';
import {
  Dashboard,
  Katalog,
  PasangPanen,
  Pengaturan,
  PreOrder,
  Rute,
  Verifikasi,
} from './views.jsx';

const TAB_PERAN = {
  petani: [
    { id: 'katalog', label: 'Katalog' },
    { id: 'pasang', label: 'Pasang panen' },
  ],
  katering: [
    { id: 'katalog', label: 'Katalog' },
    { id: 'preorder', label: 'Pre-order' },
  ],
  admin: [
    { id: 'verifikasi', label: 'Verifikasi' },
    { id: 'rute', label: 'Rute' },
    { id: 'dashboard', label: 'Dashboard' },
  ],
};

function Merek() {
  return (
    <a className="merek" href="#/">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 21c0-6 3-9.5 8-10-0.5 6-3.5 9.5-8 10Z"
          fill="#11caa0"
          stroke="#0f172a"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M12 21C12 14 9 10.5 4 10c0.5 6 3.5 10 8 11Z"
          fill="#f3f0df"
          stroke="#0f172a"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      PanenLangsung
    </a>
  );
}

export default function App() {
  const { state, aksi, tersimpan } = useSimpanan();
  const [alamat, setAlamat] = useState(() => window.location.hash);
  const [mode, setMode] = useState(() =>
    window.location.hash.startsWith('#/demo') ? 'demo' : 'landing'
  );
  const [tab, setTab] = useState('katalog');
  const [pilihan, setPilihan] = useState('');

  const modeDemo = mode === 'demo';
  const peran = state.peranAktif;
  const daftarTab = useMemo(() => TAB_PERAN[peran] || TAB_PERAN.petani, [peran]);

  useEffect(() => {
    const dengar = () => {
      const h = window.location.hash;
      if (h.startsWith('#/demo')) setMode('demo');
      else if (h === '' || h === '#' || h === '#/') setMode('landing');
      setAlamat(h);
    };
    window.addEventListener('hashchange', dengar);
    return () => window.removeEventListener('hashchange', dengar);
  }, []);

  useEffect(() => {
    if (!modeDemo && alamat.length > 2) {
      const target = document.querySelector(alamat);
      if (target) target.scrollIntoView({ block: 'start' });
      return;
    }
    if (modeDemo && alamat.length > 2 && !alamat.startsWith('#/')) {
      const target = document.querySelector(alamat);
      if (target) target.scrollIntoView({ block: 'start' });
      return;
    }
    window.scrollTo(0, 0);
  }, [alamat, modeDemo]);

  useEffect(() => {
    const izin = [...daftarTab.map((t) => t.id), 'pengaturan'];
    if (!izin.includes(tab)) setTab(daftarTab[0].id);
  }, [daftarTab, tab]);

  if (!modeDemo) return <Landing />;

  const infoPeran = PERAN.find((p) => p.id === peran) || PERAN[0];
  const tabDiizinkan = (id) => id === 'pengaturan' || daftarTab.some((t) => t.id === id);
  const tabAktif = tabDiizinkan(tab) ? tab : daftarTab[0].id;

  const gantiPeran = (id) => {
    aksi.setPeran(id);
    setTab(TAB_PERAN[id][0].id);
    setPilihan('');
  };

  return (
    <div className="aplikasi">
      <a className="lewat" href="#konten">
        Lewati ke konten utama
      </a>

      <header className="bilah-atas">
        <div className="wrap">
          <div className="bilah-dalam">
            <div className="bilah-kiri">
              <Merek />
              <span className="lencana-simulasi">
                <span className="titik" aria-hidden="true" />
                Demo, data dummy
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span className="bilah-status" aria-live="polite">
                {tersimpan}
              </span>
              <a className="tombol tombol-kecil" href="#/" aria-label="Kembali ke landing">
                Kembali
              </a>
            </div>
          </div>

          <div className="peran" role="group" aria-label="Pilih peran simulasi">
            <span className="peran-label">Peran:</span>
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
            <span className="peran-label peran-catatan">Simulasi peran, bukan login.</span>
          </div>

          <nav className="tabs" aria-label="Menu demo">
            {daftarTab.map((t) => (
              <button
                key={t.id}
                type="button"
                className="tab"
                aria-current={tabAktif === t.id ? 'page' : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              className="tab"
              aria-current={tabAktif === 'pengaturan' ? 'page' : undefined}
              onClick={() => setTab('pengaturan')}
            >
              Pengaturan
            </button>
          </nav>
        </div>
      </header>

      <main className="utama" id="konten">
        <div className="wrap">
          <p className="catatan-kecil" style={{ marginBottom: '14px' }}>
            Peran {infoPeran.nama}: {infoPeran.tugas}
          </p>

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

          {tabAktif === 'pasang' ? <PasangPanen state={state} aksi={aksi} /> : null}

          {tabAktif === 'preorder' ? (
            <PreOrder state={state} aksi={aksi} pilihan={pilihan} setPilihan={setPilihan} />
          ) : null}

          {tabAktif === 'verifikasi' ? <Verifikasi state={state} aksi={aksi} /> : null}

          {tabAktif === 'rute' ? <Rute state={state} /> : null}

          {tabAktif === 'dashboard' ? <Dashboard state={state} /> : null}

          {tabAktif === 'pengaturan' ? (
            <Pengaturan state={state} aksi={aksi} tersimpan={tersimpan} />
          ) : null}
        </div>
      </main>

      <footer className="situs" style={{ borderTop: '1px solid #cdd6e2' }}>
        <div className="wrap" style={{ padding: '14px 20px', fontSize: '0.84rem', color: '#4b5a6e' }}>
          Demo simulasi PanenLangsung. Data fiktif, tersimpan di peramban ini, tanpa server dan tanpa
          pembayaran.
        </div>
      </footer>
    </div>
  );
}
