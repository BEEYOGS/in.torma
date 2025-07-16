import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For more information, see: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAwwTrt3dPC7oICozC6pGvb-xFYm8c3dHg",
  authDomain: "intorma.firebaseapp.com",
  projectId: "intorma",
  storageBucket: "intorma.appspot.com",
  messagingSenderId: "1022928523995",
  appId: "1:1022928523995:web:b66aecf90e7599cf01b2fe"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
