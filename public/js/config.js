// ============================================================
//  SEMUA KONTEN UNDANGAN ADA DI SINI — cukup edit file ini.
//  Foto: taruh di public/images/ lalu sesuaikan path-nya.
//  Foto yang belum ada otomatis tampil sebagai placeholder.
// ============================================================
window.INVITATION = {
  brand: 'DIGITAL INVITATION',

  couple: {
    short: ['Wiguna', 'Lintang'], // tampil besar di cover & save the date
    groom: {
      name: 'Wiguna Bayu Anggara',
      parents: 'Putra pertama dari Bapak Torikin Irawan & Ibu Supriyatin',
      photo: 'images/groom.jpg',
    },
    bride: {
      name: 'Lintang Mustika Valentina, Amd.Keb.',
      parents: 'Putri pertama dari Bapak Kartono & Ibu Nok Muslihatun',
      photo: 'images/bride.jpg',
    },
  },

  // Tanggal utama (dipakai countdown) — format ISO lokal
  date: '2026-10-11T10:00:00+07:00',
  dateLabel: '11 · 10 · 2026',

  cover: {
    photo: 'images/cover.jpg',
    defaultGuest: 'Tamu Undangan', // dipakai bila tidak ada ?to=Nama di URL
  },

  hero: {
    photo: 'images/hero.jpg',
    caption: 'OUR WEDDING 2026',
    tagline: 'Hari untuk merayakan cinta, kenangan indah, dan keberadaan setiap orang yang telah mendampingi langkah kami sampai di titik ini.',
  },

  story: [
    {
      year: '2022',
      title: 'The Beginning',
      text: 'Berawal dari saling sapa lewat direct message Instagram, obrolan santai di media sosial itu berlanjut ke keputusan untuk bertemu langsung. Momen tatap muka pertama berjalan lancar dan berkesan, hingga kami merasa cocok satu sama lain dan akhirnya resmi berpacaran.',
    },
    {
      year: '2024',
      title: 'Distance & Trust',
      text: 'Jarak pernah menguji kami selama dua tahun penuh. Walau kerinduan hanya bisa terobati lewat panggilan suara dan video, komitmen serta rasa percaya yang utuh membuktikan bahwa tak ada jarak yang terlalu jauh untuk dua hati yang saling menatap masa depan bersama.',
    },
    {
      year: '2026',
      title: 'Forever Begins',
      text: 'Keteguhan hati itu akhirnya membuahkan senyum penuh syukur pada 23 Januari 2026. Meski terpisah jarak, prosesi lamaran secara online menyatukan hangatnya silaturahmi kedua keluarga, yang dengan penuh kasih merestui langkah kami menuju ikatan suci pernikahan.',
    },
  ],

  events: [
    {
      label: 'Akad dan Resepsi',
      date: 'Minggu, 11 Oktober 2026',
      time: '07.30 WIB',
      venue: 'Rumah mempelai wanita',
      address: 'Dukuh Pekandangan RT 04/RW 08, Kelurahan Kutamendala',
      // Lokasi untuk preview peta: alamat, nama tempat, atau koordinat "lat,lng"
      // (koordinat paling akurat — klik kanan titik di Google Maps untuk menyalinnya)
      mapQuery: '-7.1655178,108.9997038',
      // Link tombol "View location" (opsional — kosongkan agar otomatis dari mapQuery)
      map: '',
    },
  ],

  gallery: [
    'images/7765.jpg',
    'images/7800.jpg',
    'images/7804.jpg',
    'images/7798.jpg',
    'images/7812.jpg',
    'images/7790.jpg',
  ],

  gift: {
    // Rekening & e-wallet — tambah / hapus baris sesuai kebutuhan.
    // type: 'bank' (Bank transfer) atau 'ewallet' (E-wallet)
    // logo: gambar di public/images/ (png/jpg/svg) — hapus / kosongkan untuk tanpa logo
    accounts: [
      { type: 'bank', name: '', number: '3686 0101 8359 535', holder: 'Wiguna Bayu Anggara', logo: 'images/bri.png' },
      { type: 'bank', name: '', number: '3686 0103 1490 530', holder: 'Lintang Mustika V', logo: 'images/bri.png' },
      { type: 'ewallet', name: '', number: '0818 0282 7922', holder: 'Lintang Mustika V', logo: 'images/dana.png' },
    ],
    // Ikon kartu alamat kado: gambar di public/images/, atau '' = ikon kado bawaan
    addressIcon: 'images/gift-icon.png',
    qris: '', // isi 'images/qris.png' bila sudah ada gambar QRIS
    address: 'Dukuh Pekandangan RT 04/RW 08, Kelurahan Kutamendala',
    addressRecipient: 'Rumah mempelai wanita',
  },

  closing: 'Terima kasih telah menjadi bagian dari awal selamanya kami.',

  // Taruh file musik di public/audio/ — '' untuk menonaktifkan
  music: 'audio/dayasmara.mp3',
};
