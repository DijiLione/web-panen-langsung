import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KUNCI, dataAwal, sinkronTanaman } from './data.js';

function baca() {
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) return dataAwal();
    const isi = JSON.parse(mentah);
    if (!isi || !Array.isArray(isi.tanaman) || !Array.isArray(isi.pesanan)) return dataAwal();
    return sinkronTanaman({
      tanaman: isi.tanaman,
      pesanan: isi.pesanan,
      peranAktif: isi.peranAktif || 'petani',
    });
  } catch (e) {
    return dataAwal();
  }
}

export function useSimpanan() {
  const [state, setState] = useState(baca);

  const [tersimpan, setTersimpan] = useState('');
  const lewat = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(KUNCI, JSON.stringify(state));
      setTersimpan('Tersimpan otomatis di peramban ini');
      clearTimeout(lewat.current);
      lewat.current = setTimeout(() => setTersimpan(''), 2400);
    } catch (e) {
      setTersimpan('Gagal menyimpan ke peramban');
    }
  }, [state]);

  const ubah = useCallback((fn) => {
    setState((lama) => sinkronTanaman(fn(lama)));
  }, []);

  const reset = useCallback(() => {
    setState(dataAwal());
  }, []);

  const aksi = useMemo(
    () => ({
      setPeran: (peranAktif) => ubah((s) => ({ ...s, peranAktif })),

      tambahTanaman: (baru) =>
        ubah((s) => {
          const nomor = s.tanaman.length + 1;
          return {
            ...s,
            tanaman: [
              ...s.tanaman,
              { ...baru, id: `T-${String(nomor).padStart(2, '0')}`, status: 'tersedia' },
            ],
          };
        }),

      buatPesanan: (baru) =>
        ubah((s) => {
          const nomor = s.pesanan.length + 1;
          return {
            ...s,
            pesanan: [
              ...s.pesanan,
              {
                ...baru,
                id: `P-${String(nomor).padStart(2, '0')}`,
                status: 'menunggu_verifikasi',
                kurir: '',
                jadwalBerangkat: '',
                urutanRute: 0,
                jejak: [{ status: 'menunggu_verifikasi', waktu: new Date().toISOString() }],
              },
            ],
          };
        }),

      ubahStatus: (id, statusBaru, tambahan = {}) =>
        ubah((s) => {
          const pesanan = s.pesanan.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...tambahan,
                  status: statusBaru,
                  jejak: [...p.jejak, { status: statusBaru, waktu: new Date().toISOString() }],
                }
              : p
          );
          const berangkat = pesanan.filter((p) => p.status === 'berangkat');
          return {
            ...s,
            pesanan: pesanan.map((p) => {
              if (p.status !== 'berangkat') return p;
              const sekelas = berangkat
                .filter((x) => x.jadwalBerangkat === p.jadwalBerangkat)
                .sort((a, b) => a.id.localeCompare(b.id));
              return { ...p, urutanRute: sekelas.findIndex((x) => x.id === p.id) + 1 };
            }),
          };
        }),

      reset,
    }),
    [ubah, reset]
  );

  return { state, aksi, tersimpan };
}
