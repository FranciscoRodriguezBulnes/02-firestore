import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDBCFe-rWsOxjUJvTuj4cqUETKyd-zuVE0",
  authDomain: "vue-3-2025-console.firebaseapp.com",
  projectId: "vue-3-2025-console",
  storageBucket: "vue-3-2025-console.firebasestorage.app",
  messagingSenderId: "488564582836",
  appId: "1:488564582836:web:a10afecd290449d6ad6ae1"
};

initializeApp(firebaseConfig);
const auth = getAuth();
// console.log("Auth (lo pongo yo):", auth);
const db = getFirestore();

export { auth, db };
