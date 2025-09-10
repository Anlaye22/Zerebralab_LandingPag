import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, setDoc, getDocs, collection,
  query, orderBy, serverTimestamp
} from "firebase/firestore";

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

// Guarda/actualiza suscriptor por email (id = email en minúsculas)
export async function guardarSuscriptor(correo) {
  const id = (correo || "").toLowerCase().trim();
  if (!id) return;
  await setDoc(doc(db, "suscriptores", id), {
    correo: id,
    createdAt: serverTimestamp()
  }, { merge: true });
}

// Obtiene newsletters ordenados por fecha desc
export async function obtenerNewsletters() {
  const q = query(collection(db, "newsletters"), orderBy("fecha", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data() || {};
    return {
      id: d.id,
      title: data.title || data.titulo || "Newsletter",
      thumb: data.thumb || data.thumbUrl || "/assets/img/newsletters/thumb-placeholder.jpg",
      url:   data.url   || data.fileUrl  || data.archivo || "#",
      fecha: data.fecha?.toDate?.() || data.fecha || null,
    };
  });
}