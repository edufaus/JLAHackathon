import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import getStorage from firebase/storage



const firebaseConfig = {
    apiKey: "AIzaSyBaaiQ0oHjwrdfJJ2xk3GZ5a9o35mgdM2Q",
    authDomain: "reflect-ea81d.firebaseapp.com",
    projectId: "reflect-ea81d",
    storageBucket: "reflect-ea81d.firebasestorage.app",
    messagingSenderId: "924850795118",
    appId: "1:924850795118:web:5ec97ff5652b6935f36c7f",
    measurementId: "G-P1RCF064JP"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const realtimedb = getDatabase(app);
export const storage = getStorage(app); 
``