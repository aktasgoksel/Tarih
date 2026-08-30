import { State } from "../state.js";

import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

window.showLoader = function(msg = "Yükleniyor...") {
    const loader = document.getElementById('global-loader');
    if(loader) {
        document.getElementById('loader-text').textContent = msg;
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    }
};
window.hideLoader = function() {
    const loader = document.getElementById('global-loader');
    if(loader) {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
};








// Load tests from Firestore
async function loadTestsFromFirestore() {
    try {
        console.log("Fetching tests from Firestore...");
        const querySnapshot = await getDocs(collection(db, "tests"));
        let fetchedTests = [];
        querySnapshot.forEach((doc) => {
            fetchedTests.push(doc.data());
        });
        
        // Sort by order
        fetchedTests.sort((a, b) => a.order - b.order);
        State.setTestData(fetchedTests);
        
        
        // Force instant-feedback to be false on load to prevent browser caching
        const instantToggle = document.getElementById('instant-feedback');
        if (instantToggle) instantToggle.checked = false;

        // Re-render UI now that data is available
        window.renderDropdown();
        // Trigger first test if it's currently empty
        if (State.getTestData().length > 0) {
            window.showTest(State.getCurrentTestIndex() || 0);
        }
        
    } catch (error) {
        console.error("Failed to fetch tests:", error);
        document.getElementById('current-test-title').textContent = "Hata: " + error.message + " | Stack: " + error.stack;
        document.getElementById('current-test-title').classList.add('text-red-500');
    }
}


        
window.loadTestsFromFirestore = loadTestsFromFirestore;
