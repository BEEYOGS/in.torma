import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi ini menggunakan kredensial untuk proyek 'intorma'
const firebaseConfig = {
  apiKey: "AIzaSyBSYkEuBKcfweUlk_AEz8dzBO_UC7NNl3Q",
  authDomain: "intorma.firebaseapp.com",
  projectId: "intorma",
  storageBucket: "intorma.appspot.com",
  messagingSenderId: "1022928523995",
  appId: "1:1022928523995:web:a2883101a40c0a04cbf0a2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
