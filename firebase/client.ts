// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCQfD1CD_To_8IzWfbHkShCJyW7DwVQuHY',
  authDomain: 'aiinterview-7cdc3.firebaseapp.com',
  projectId: 'aiinterview-7cdc3',
  storageBucket: 'aiinterview-7cdc3.firebasestorage.app',
  messagingSenderId: '194544711183',
  appId: '1:194544711183:web:eca5899d2f9e04350a557a',
  measurementId: 'G-7LXTBVB2ZV',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
