// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAB1QFmnpPIFKHTlaVKamDvrF10FBqFRQ",
  authDomain: "tuffy-swipes.firebaseapp.com",
  projectId: "tuffy-swipes",
  storageBucket: "tuffy-swipes.appspot.com",
  messagingSenderId: "631823458827",
  appId: "1:631823458827:web:344fa3a12adfc2a1185d0e"
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);