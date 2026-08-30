import { State } from "../state.js";

import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// ADMIN PANEL LOGIC
// ==========================================
window.openAdminPanel = function() {
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('flex');
    document.getElementById('admin-screen').classList.remove('hidden');
    document.getElementById('admin-screen').classList.add('flex');
};

window.closeAdminPanel = function() {
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('flex');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('flex');
};

window.saveAdminQuestion = async function() {
    const btn = document.getElementById('admin-save-btn');
    const feedback = document.getElementById('admin-feedback');
    const title = document.getElementById('admin-test-title').value.trim();
    const qText = document.getElementById('admin-question-text').value.trim();
    const optA = document.getElementById('admin-opt-a').value.trim();
    const optB = document.getElementById('admin-opt-b').value.trim();
    const optC = document.getElementById('admin-opt-c').value.trim();
    const optD = document.getElementById('admin-opt-d').value.trim();
    const optE = document.getElementById('admin-opt-e').value.trim();
    const ans = document.getElementById('admin-correct-answer').value;
    const sol = document.getElementById('admin-solution').value.trim();
    
    if(!title || !qText || !optA || !optB || !optC || !optD || !optE) {
        feedback.textContent = 'Lütfen tüm soru ve şık alanlarını doldurun!';
        feedback.className = 'mt-4 text-center font-medium text-red-500 block';
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';
    
    try {
        // Find existing test or create new
        let targetTestId = null;
        let targetTestOrder = State.getTestData().length + 1;
        let existingQuestions = [];
        
        for(let i=0; i<State.getTestData().length; i++) {
            if(State.getTestData()[i].title === title) {
                targetTestId = State.getTestData()[i].id;
                targetTestOrder = State.getTestData()[i].order;
                existingQuestions = State.getTestData()[i].questions || [];
                break;
            }
        }
        
        if(!targetTestId) {
            targetTestId = 'test_' + Date.now(); // Unique ID for new tests
        }
        
        const newQuestion = {
            qNum: existingQuestions.length + 1,
            question: qText,
            options: { A: optA, B: optB, C: optC, D: optD, E: optE },
            answer: ans,
            solution: sol
        };
        
        existingQuestions.push(newQuestion);
        
        const docRef = doc(db, 'tests', targetTestId);
        await setDoc(docRef, {
            id: targetTestId,
            title: title,
            order: targetTestOrder,
            questions: existingQuestions
        });
        
        feedback.textContent = 'Soru başarıyla kaydedildi!';
        feedback.className = 'mt-4 text-center font-bold text-green-500 block';
        
        // Clear form
        document.getElementById('admin-question-text').value = '';
        document.getElementById('admin-opt-a').value = '';
        document.getElementById('admin-opt-b').value = '';
        document.getElementById('admin-opt-c').value = '';
        document.getElementById('admin-opt-d').value = '';
        document.getElementById('admin-opt-e').value = '';
        document.getElementById('admin-solution').value = '';
        
        // Reload tests
        await window.loadTestsFromFirestore();
        
    } catch(err) {
        console.error('Soru kaydedilemedi:', err);
        feedback.textContent = 'Hata: ' + err.message;
        feedback.className = 'mt-4 text-center font-medium text-red-500 block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Soruyu Veritabanına Kaydet';
    }
};