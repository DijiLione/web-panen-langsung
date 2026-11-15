export function bacaGambar(file, maks = 800, mutu = 0.62) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Pilih berkas foto.'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Berkas harus berupa gambar.'));
      return;
    }

    const pembaca = new FileReader();
    pembaca.onerror = () => reject(new Error('Gagal membaca berkas.'));
    pembaca.onload = () => {
      const gambar = new Image();
      gambar.onerror = () => reject(new Error('Gambar tidak bisa dibuka.'));
      gambar.onload = () => {
        const skala = Math.min(1, maks / Math.max(gambar.width, gambar.height));
        const lebar = Math.round(gambar.width * skala);
        const tinggi = Math.round(gambar.height * skala);
        const kanvas = document.createElement('canvas');
        kanvas.width = lebar;
        kanvas.height = tinggi;
        kanvas.getContext('2d').drawImage(gambar, 0, 0, lebar, tinggi);
        resolve(kanvas.toDataURL('image/jpeg', mutu));
      };
      gambar.src = pembaca.result;
    };
    pembaca.readAsDataURL(file);
  });
}
