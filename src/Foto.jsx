import { useEffect } from 'react';

export default function Foto({ src, judul, onTutup }) {
  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') onTutup();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onTutup]);

  return (
    <div
      className="foto-overlay"
      role="dialog"
      aria-label="Foto bukti terima"
      onClick={(e) => {
        if (e.target === e.currentTarget) onTutup();
      }}
    >
      <div className="foto-kartu">
        <div className="foto-kepala">
          <div>
            <strong>{judul || 'Foto bukti terima'}</strong>
            <span className="label-kecil">Dikirim kurir saat serah terima</span>
          </div>
          <button type="button" className="tombol tombol-utama tombol-kecil" onClick={onTutup}>
            Tutup
          </button>
        </div>
        <img src={src} alt={judul || 'Foto bukti terima'} />
      </div>
    </div>
  );
}
