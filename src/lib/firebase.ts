import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For more information, see: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAEGE0OwI8spapTkjF1_r3k9ygKhByAiNs",
  authDomain: "kerjasini.firebaseapp.com",
  projectId: "kerjasini",
  storageBucket: "kerjasini.appspot.com",
  messagingSenderId: "60196811271",
  appId: "1:60196811271:web:a2883101a40c0a04cbf0a2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
