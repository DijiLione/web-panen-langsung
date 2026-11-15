import { useState } from 'react';
import { KOMISI, rupiah } from './data.js';

const PILIHAN = [
  { nama: 'Bayam', platform: 7100, tengkulak: 5000 },
  { nama: 'Wortel', platform: 12800, tengkulak: 9000 },
  { nama: 'Cabai merah', platform: 54000, tengkulak: 38000 },
  { nama: 'Tomat', platform: 10600, tengkulak: 7500 },
];

export default function Kalkulator() {
  const [indeks, setIndeks] = useState(0);
  const [volume, setVolume] = useState(60);

  const k = PILIHAN[indeks];
  const kg = Math.max(0, Number(volume) || 0);
  const nilai = kg * k.platform;
  const petani = Math.round(nilai * (1 - KOMISI));
  const komisi = nilai - petani;
  const tengkulak = kg * k.tengkulak;
  const selisih = petani - tengkulak;

  return (
    <div className="kalkulator">
      <div className="kalkulator-kendali">
        <label htmlFor="kalkulator-komoditas">Komoditas</label>
        <select
          id="kalkulator-komoditas"
          value={indeks}
          onChange={(e) => setIndeks(Number(e.target.value))}
        >
          {PILIHAN.map((p, i) => (
            <option key={p.nama} value={i}>
              {p.nama}
            </option>
          ))}
        </select>

        <label htmlFor="kalkulator-volume">Volume (kg)</label>
        <input
          id="kalkulator-volume"
          type="number"
          min="1"
          inputMode="numeric"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
        <div className="kalkulator-geser">
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={Math.min(300, kg)}
            onChange={(e) => setVolume(e.target.value)}
            aria-label="Atur volume dengan penggeser"
          />
        </div>
      </div>

      <dl className="kalkulator-hasil">
        <div>
          <dt>Dibayar FnB</dt>
          <dd>{rupiah(nilai)}</dd>
        </div>
        <div>
          <dt>Diterima petani</dt>
          <dd className="kalkulator-utama">{rupiah(petani)}</dd>
        </div>
        <div>
          <dt>Komisi platform 15%</dt>
          <dd>{rupiah(komisi)}</dd>
        </div>
        <div>
          <dt>Kalau lewat tengkulak</dt>
          <dd>{rupiah(tengkulak)}</dd>
        </div>
      </dl>

      <p className="kalkulator-catatan">
        Petani menerima <strong>{rupiah(selisih)}</strong> lebih banyak untuk {kg} kg {k.nama.toLowerCase()}.
      </p>
    </div>
  );
}
