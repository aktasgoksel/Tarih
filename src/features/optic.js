
import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- OPTIK FORM (GRID) LOGIC ---
        function renderGrid(totalQ) {
            const container = document.getElementById('grid-container');
            container.classList.remove('hidden');
            
            const grid = document.getElementById('question-grid');
            grid.innerHTML = '';
            
            for(let i=0; i<totalQ; i++) {
                const btn = document.createElement('button');
                btn.id = `grid-btn-${i}`;
                btn.textContent = i + 1;
                btn.className = "w-10 h-10 rounded-lg text-sm font-bold border transition-all flex items-center justify-center focus:outline-none";
                btn.onclick = () => {
                    window.currentQuestionIndex = i;
                    updateUI();
                };
                grid.appendChild(btn);
            }
        }

        function updateGridUI() {
            const totalQ = window.currentTestQuestions.length;
            for(let i=0; i<totalQ; i++) {
                const btn = document.getElementById(`grid-btn-${i}`);
                if(!btn) continue;
                
                btn.className = "w-10 h-10 rounded-lg text-sm font-bold border transition-all flex items-center justify-center focus:outline-none cursor-pointer ";
                
                const isAnswered = document.querySelector(`input[name="question-${i}"]:checked`);
                
                if (i === window.currentQuestionIndex) {
                    btn.className += ' border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 ring-2 ring-blue-300 dark:ring-blue-700';
                } else if (isAnswered) {
                    btn.className += ' border-gray-300 bg-gray-200 text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 opacity-80';
                } else {
                    btn.className += ' border-gray-200 bg-white text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700';
                }
            }
        }

        