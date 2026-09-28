# undangan1

Undangan pernikahan digital bergaya editorial (recreate layout template-005): cover dengan nama tamu,
save the date + countdown, profil mempelai, kisah, detail acara, galeri + lightbox,
RSVP + guestbook (Firebase Firestore), amplop digital (rekening, QRIS, alamat), dan musik latar.

## Menjalankan lokal
```
npm install
npm start          # http://localhost:3050
```
Link per tamu: `http://localhost:3050/?to=Budi+Santoso`

## Mengubah isi
- Teks/tanggal/lokasi/rekening: `public/js/config.js`
- Foto: `public/images/` (yang belum ada tampil sebagai placeholder)
- Musik: `public/audio/`

## Firebase (RSVP & ucapan)
1. Firebase Console → buat project → tambah **Web app** → salin config ke `public/js/firebase-config.js`
2. Build → **Firestore Database** → Create database (production mode, region `asia-southeast2` Jakarta)
3. Firestore → tab **Rules** → tempel isi `firestore.rules` → **Publish**

Data tersimpan di koleksi `rsvp` (name, attendance `hadir`/`tidak`, guests, message, hasMessage, createdAt).
Dari browser hanya bisa baca & tambah; edit/hapus lewat Firebase Console.

### Deploy ke Firebase Hosting (opsional)
```
npm install -g firebase-tools
firebase login
firebase use --add        # pilih project
firebase deploy           # hosting + firestore rules
```
