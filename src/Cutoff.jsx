import { useEffect, useState } from 'react';
import { formatTanggal, isoLokal, tambahHari } from './data.js';

const JAM = 15;

function hitung() {
  const kini = new Date();
  const batas = new Date(kini);
  batas.setHours(JAM, 0, 0, 0);
  if (kini >= batas) batas.setDate(batas.getDate() + 1);
  return { ms: batas - kini, batas };
}

export default function Cutoff() {
  const [s, setS] = useState(hitung);

  useEffect(() => {
    const t = setInterval(() => setS(hitung()), 1000);
    return () => clearInterval(t);
  }, []);

  const total = Math.max(0, Math.floor(s.ms / 1000));
  const jam = Math.floor(total / 3600);
  const menit = Math.floor((total % 3600) / 60);
  const detik = String(total % 60).padStart(2, '0');
  const petik = tambahHari(isoLokal(s.batas), 1);
  const tiba = tambahHari(petik, 1);

  return (
    <div className="cutoff">
      <span className="cutoff-titik" aria-hidden="true" />
      <p className="cutoff-waktu">
        Pesan sebelum 15.00 · <strong>{jam} jam {menit} menit {detik} detik</strong>
      </p>
      <p className="cutoff-jadwal">
        Petik {formatTanggal(petik)} · tiba {formatTanggal(tiba)}
      </p>
    </div>
  );
}
