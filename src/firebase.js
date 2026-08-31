/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTFhx0ozrGj-0I_12gQofynPvyuAAstD8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tarih-db7a7.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tarih-db7a7",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tarih-db7a7.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "511484512084",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:511484512084:web:61bb301451bfe262e0aac1",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9MZB4VZF99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Modern Offline Persistence setup using localCache settings (replaces deprecated enableIndexedDbPersistence)
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

