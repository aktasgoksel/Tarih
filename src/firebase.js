import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTFhx0ozrGj-0I_12gQofynPvyuAAstD8",
    authDomain: "tarih-db7a7.firebaseapp.com",
    projectId: "tarih-db7a7",
    storageBucket: "tarih-db7a7.firebasestorage.app",
    messagingSenderId: "511484512084",
    appId: "1:511484512084:web:61bb301451bfe262e0aac1",
    measurementId: "G-9MZB4VZF99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
    }
});
