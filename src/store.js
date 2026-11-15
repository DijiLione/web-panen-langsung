import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KUNCI, STATUS, TAHAP, dataAwal, sinkronPesanan, sinkronTanaman } from './data.js';

function baca() {
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) return dataAwal();
    const isi = JSON.parse(mentah);
    if (!isi || !Array.isArray(isi.tanaman) || !Array.isArray(isi.pesanan)) return dataAwal();
    return sinkronPesanan(
      sinkronTanaman({
        tanaman: isi.tanaman,
        pesanan: isi.pesanan,
        kurir: Array.isArray(isi.kurir) ? isi.kurir : dataAwal().kurir,
        peranAktif: isi.peranAktif || 'admin',
        kurirAktif: isi.kurirAktif || 'K-01',
      })
    );
  } catch (e) {
    return dataAwal();
  }
}

const waktu = () => new Date().toISOString();

function urutkanRute(pesanan) {
  const grup = {};
  for (const p of pesanan) {
    if (p.status !== STATUS.BERANGKAT && p.status !== STATUS.TIBA) continue;
    if (!p.jadwalBerangkat || !p.kurirId) continue;
    const kunci = `${p.jadwalBerangkat}|${p.kurirId}`;
    (grup[kunci] = grup[kunci] || []).push(p);
  }
  const urutan = {};
  for (const kunci of Object.keys(grup)) {
    grup[kunci]
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((p, i) => {
        urutan[p.id] = i + 1;
      });
  }
  return pesanan.map((p) => (urutan[p.id] ? { ...p, urutanRute: urutan[p.id] } : p));
}

export function useSimpanan() {
  const [state, setState] = useState(baca);
  const [tersimpan, setTersimpan] = useState('');
  const lewat = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(KUNCI, JSON.stringify(state));
      setTersimpan('Tersimpan di peramban ini');
      clearTimeout(lewat.current);
      lewat.current = setTimeout(() => setTersimpan(''), 2600);
    } catch (e) {
      setTersimpan('Gagal menyimpan');
    }
  }, [state]);

  const ubah = useCallback((fn) => {
    setState((lama) => sinkronTanaman(fn(lama)));
  }, []);

  const aksi = useMemo(() => {
    const ubahPesanan = (id, fn) =>
      ubah((s) => ({
        ...s,
        pesanan: urutkanRute(s.pesanan.map((p) => (p.id === id ? fn(p) : p))),
      }));

    return {
      setPeran: (peranAktif) => ubah((s) => ({ ...s, peranAktif })),

      setKurirAktif: (kurirAktif) => ubah((s) => ({ ...s, kurirAktif })),

      tambahTanaman: (baru) =>
        ubah((s) => {
          const nomor = s.tanaman.length + 1;
          return {
            ...s,
            tanaman: [
              { ...baru, id: `T-${String(nomor).padStart(2, '0')}`, status: STATUS.TERSEDIA },
              ...s.tanaman,
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
                status: STATUS.MENUNGGU,
                kurirId: '',
                kurir: '',
                jadwalBerangkat: '',
                urutanRute: 0,
                tahapKurir: TAHAP.BELUM,
                bukti: null,
                buktiFnb: null,
                alasanGagal: '',
                alasanBatal: '',
                jejak: [{ status: STATUS.MENUNGGU, waktu: waktu() }],
                jejakKurir: [],
              },
            ],
          };
        }),

      verifikasi: (id) =>
        ubahPesanan(id, (p) => ({
          ...p,
          status: STATUS.DIVERIFIKASI,
          jejak: [...p.jejak, { status: STATUS.DIVERIFIKASI, waktu: waktu() }],
        })),

      tolak: (id, alasan) =>
        ubahPesanan(id, (p) => ({
          ...p,
          status: STATUS.DIBATALKAN,
          alasanBatal: alasan,
          jejak: [...p.jejak, { status: STATUS.DIBATALKAN, waktu: waktu(), catatan: alasan }],
        })),

      tugaskanKurir: (id, { kurirId, kurirNama, jadwal, catatan }) =>
        ubahPesanan(id, (p) => ({
          ...p,
          status: STATUS.BERANGKAT,
          kurirId,
          kurir: kurirNama,
          jadwalBerangkat: jadwal,
          tahapKurir: TAHAP.DITUGASKAN,
          jejak: [...p.jejak, { status: STATUS.BERANGKAT, waktu: waktu() }],
          jejakKurir: [
            ...p.jejakKurir,
            { tahap: TAHAP.DITUGASKAN, waktu: waktu(), catatan: catatan || kurirNama },
          ],
        })),

      ubahTahapKurir: (id, tahap, catatan) =>
        ubahPesanan(id, (p) => ({
          ...p,
          tahapKurir: tahap,
          jejakKurir: [...p.jejakKurir, { tahap, waktu: waktu(), catatan: catatan || '' }],
        })),

      selesaikanAntar: (id, bukti) =>
        ubahPesanan(id, (p) => ({
          ...p,
          status: STATUS.TIBA,
          tahapKurir: TAHAP.TERKIRIM,
          bukti,
          jejak: [...p.jejak, { status: STATUS.TIBA, waktu: waktu() }],
          jejakKurir: [
            ...p.jejakKurir,
            {
              tahap: TAHAP.TERKIRIM,
              waktu: waktu(),
              catatan: `Diterima ${bukti.penerima}`,
            },
          ],
        })),

      catatBuktiFnb: (id, buktiFnb) =>
        ubahPesanan(id, (p) => ({
          ...p,
          buktiFnb,
          jejak: [
            ...p.jejak,
            { status: p.status, waktu: waktu(), catatan: 'FnB mencatat bukti terima' },
          ],
        })),

      gagalAntar: (id, alasan) =>
        ubahPesanan(id, (p) => ({
          ...p,
          tahapKurir: TAHAP.GAGAL,
          alasanGagal: alasan,
          jejakKurir: [...p.jejakKurir, { tahap: TAHAP.GAGAL, waktu: waktu(), catatan: alasan }],
        })),

      tandaiTiba: (id) =>
        ubahPesanan(id, (p) => {
          const sekarang = waktu();
          const sudahTerkirim = p.tahapKurir === TAHAP.TERKIRIM;
          return {
            ...p,
            status: STATUS.TIBA,
            tahapKurir: TAHAP.TERKIRIM,
            bukti:
              p.bukti || {
                penerima: 'Ditutup admin',
                catatan: 'Bukti serah terima tidak tercatat',
                waktu: sekarang,
              },
            jejak: [...p.jejak, { status: STATUS.TIBA, waktu: sekarang }],
            jejakKurir: sudahTerkirim
              ? p.jejakKurir
              : [
                  ...p.jejakKurir,
                  { tahap: TAHAP.TERKIRIM, waktu: sekarang, catatan: 'Ditutup admin' },
                ],
          };
        }),

      batalkanSetelahJalan: (id, alasan) =>
        ubahPesanan(id, (p) => ({
          ...p,
          status: STATUS.DIBATALKAN,
          alasanBatal: alasan,
          jejak: [...p.jejak, { status: STATUS.DIBATALKAN, waktu: waktu(), catatan: alasan }],
        })),

      ajukanKlaim: (id, klaim) =>
        ubahPesanan(id, (p) => ({
          ...p,
          klaim: {
            ...klaim,
            waktu: waktu(),
            status: 'menunggu',
          },
        })),

      putuskanKlaim: (id, keputusan, catatan) =>
        ubahPesanan(id, (p) => ({
          ...p,
          klaim: p.klaim
            ? {
                ...p.klaim,
                status: keputusan,
                keputusan: catatan || '',
                waktuKeputusan: waktu(),
              }
            : null,
        })),

      reset: () => setState(dataAwal()),
    };
  }, [ubah]);

  return { state, aksi, tersimpan };
}
