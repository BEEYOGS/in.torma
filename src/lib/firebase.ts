import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For more information, see: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAEGE0OwI8spapTkjF1_r3k9ygKhByAiNs",
  authDomain: "intorma.firebaseapp.com",
  projectId: "intorma",
  storageBucket: "intorma.appspot.com",
  messagingSenderId: "1022928523995",
  appId: "1:1022928523995:web:a2883101a40c0a04cbf0a2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
