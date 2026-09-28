// Penyimpanan RSVP & ucapan di Cloud Firestore (koleksi `rsvp`).
// Dimuat sebagai ES module; app.js menunggu event `db-ready`.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, query, where, orderBy, limit, startAfter,
  getDocs, getCountFromServer, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const configured = !String(firebaseConfig.apiKey || '').startsWith('ISI_');

let api;
if (!configured) {
  const off = () => Promise.reject(new Error('Firebase belum dikonfigurasi (js/firebase-config.js).'));
  api = { configured, page: off, stats: off, add: off };
} else {
  const db = getFirestore(initializeApp(firebaseConfig));
  const col = collection(db, 'rsvp');

  api = {
    configured,

    // Satu halaman ucapan, terbaru dulu. `cursor` = dokumen terakhir halaman sebelumnya.
    async page(size, cursor) {
      const parts = [col, orderBy('createdAt', 'desc'), limit(size)];
      if (cursor) parts.push(startAfter(cursor));
      const snap = await getDocs(query(...parts));
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((w) => w.hasMessage)
        .map((w) => ({ ...w, createdAt: w.createdAt?.toDate?.() ?? null }));
      return { items, cursor: snap.docs[snap.docs.length - 1] || null, done: snap.docs.length < size };
    },

    async stats() {
      const count = async (...q) => (await getCountFromServer(query(col, ...q))).data().count;
      const [hadir, tidak, ucapan] = await Promise.all([
        count(where('attendance', '==', 'hadir')),
        count(where('attendance', '==', 'tidak')),
        count(where('hasMessage', '==', true)),
      ]);
      return { hadir, tidak, ucapan };
    },

    async add({ name, attendance, guests, message }) {
      const msg = String(message || '').replace(/\s+/g, ' ').trim().slice(0, 500);
      await addDoc(col, {
        name: String(name).replace(/\s+/g, ' ').trim().slice(0, 60),
        attendance,
        guests: attendance === 'hadir' ? Math.min(Math.max(parseInt(guests, 10) || 1, 1), 10) : 0,
        message: msg,
        hasMessage: msg.length > 0,
        createdAt: serverTimestamp(),
      });
    },
  };
}

window.RSVP_DB = api;
window.dispatchEvent(new Event('db-ready'));
