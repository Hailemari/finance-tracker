import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAwP8WEGFsE-5fvyBNOhbZXaehMoI8VLko",
    authDomain: "finance-tracker-26421.firebaseapp.com",
    projectId: "finance-tracker-26421",
    storageBucket: "finance-tracker-26421.firebasestorage.app",
    messagingSenderId: "776747908127",
    appId: "1:776747908127:web:304199201745c15f64a92a",
    measurementId: "G-V18ZB5EP7G"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };