// src/firebase.js — Firebase v10 Modular SDK
import { initializeApp }                       from 'firebase/app';
import { getFirestore }                        from 'firebase/firestore';
import { getStorage }                          from 'firebase/storage';

const firebaseConfig = {
  apiKey:            "AIzaSyB4eeZ2wnrzG6v41JfLytfCy4rnsRHUCfU",
  authDomain:        "vitevite-201fd.firebaseapp.com",
  projectId:         "vitevite-201fd",
  storageBucket:     "vitevite-201fd.firebasestorage.app",
  messagingSenderId: "854449783685",
  appId:             "1:854449783685:web:8444f2dd265382207a7aec",
  measurementId:     "G-FJKS9WLMEJ",
};

const app     = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
