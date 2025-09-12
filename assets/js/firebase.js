import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDocs, collection, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJl001eotrACu8_qcvYLxrHVsWDcL2RFw",
  authDomain: "zlablandingpage.firebaseapp.com",
  projectId: "zlablandingpage",
  storageBucket: "zlablandingpage.firebasestorage.app",
  messagingSenderId: "1022485646789",
  appId: "1:1022485646789:web:dc6ef9fcfe3081fb4c8fac"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ⬇️ Debe mandar exactamente estos campos: correo, createdAt, lastSeenAt
export async function guardarSuscriptor(correo) {
  const id = (correo || "").trim().toLowerCase();
  await setDoc(
    doc(db, "suscriptores", id),
    {
      correo: id,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    },
    { merge: true } // si existe, solo actualiza lastSeenAt
  );
}

export async function obtenerNewsletters() {
  const snap = await getDocs(collection(db, "newsletters"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}