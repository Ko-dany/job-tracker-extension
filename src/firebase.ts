// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, addDoc, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr5w26No2h3KxlSxOqxoIJRba_7nD4iGQ",
  authDomain: "job-tracker-extension-6c29c.firebaseapp.com",
  projectId: "job-tracker-extension-6c29c",
  storageBucket: "job-tracker-extension-6c29c.firebasestorage.app",
  messagingSenderId: "1077191836195",
  appId: "1:1077191836195:web:f0dd31ee14f03ef54d6796",
  measurementId: "G-3S7GJG4CM9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, addDoc, collection };
