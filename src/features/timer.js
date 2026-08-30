
import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- TIMER LOGIC ---
        window.isTimerRunning = false;
        window.isTimerPaused = false;
        window.testTotalQuestionsForTimer = 0;
        
        window.prepareTimer = function prepareTimer(totalQuestions) {
            stopTimer();
            window.testTotalQuestionsForTimer = totalQuestions;
            window.timeRemaining = totalQuestions * 60; // 1 min per question
            updateTimerUI();
            
            document.getElementById('start-timer-btn').classList.remove('hidden');
            document.getElementById('start-timer-btn-mobile').classList.remove('hidden');
            document.getElementById('mobile-timer-bar').classList.remove('hidden');
            
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
        }
        
        window.startTimerManually = function() {
            if(window.isTimerRunning) return;
            
            window.isTimerPaused = false;
            updatePauseIcons();
            
            document.getElementById('start-timer-btn').classList.add('hidden');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
            
            document.getElementById('timer-container').classList.remove('hidden');
            document.getElementById('timer-container').classList.add('flex');
            document.getElementById('mobile-timer-container').classList.remove('hidden');
            document.getElementById('mobile-timer-container').classList.add('flex');
            
            window.isTimerRunning = true;
            window.timerInterval = setInterval(() => {
                if(!window.isTimerPaused) {
                    window.timeRemaining--;
                    updateTimerUI();
                    if(window.timeRemaining <= 0) {
                        stopTimer();
                        window.showModal({
                            type: 'warning',
                            title: 'Süre Doldu!',
                            text: 'Test süreniz sona erdi. Test otomatik olarak bitiriliyor.',
                            confirmText: 'Sonucu Gör',
                            onConfirm: () => {
                                window.submitCurrentTest(true);
                            }
                        });
                    }
                }
            }, 1000);
        }
        
        window.pauseTimer = function() {
            window.isTimerPaused = !window.isTimerPaused;
            updatePauseIcons();
        }
        
        function updatePauseIcons() {
            const btns = document.querySelectorAll('.timer-pause-btn');
            const playIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`;
            const pauseIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
            
            btns.forEach(btn => {
                btn.innerHTML = window.isTimerPaused ? playIcon : pauseIcon;
                if(window.isTimerPaused) {
                    btn.classList.add('text-yellow-400');
                    btn.classList.add('animate-pulse');
                } else {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.remove('animate-pulse');
                }
            });
        }
        
        window.resetTimerManually = function() {
            stopTimer();
            prepareTimer(window.testTotalQuestionsForTimer);
        }

        window.stopTimer = function stopTimer() {
            clearInterval(window.timerInterval);
            window.isTimerRunning = false;
            
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn').classList.add('hidden');
            
            document.getElementById('mobile-timer-bar').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
        }

        function updateTimerUI() {
            const m = Math.floor(window.timeRemaining / 60);
            const s = window.timeRemaining % 60;
            const text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            
            const el = document.getElementById('timer-text');
            const mobEl = document.getElementById('mobile-timer-text');
            
            el.textContent = text;
            mobEl.textContent = text;
            
            if(window.timeRemaining < 60) {
                el.classList.add('text-red-400');
                mobEl.classList.add('text-red-400');
                mobEl.classList.remove('text-white');
            } else {
                el.classList.remove('text-red-400');
                mobEl.classList.remove('text-red-400');
                mobEl.classList.add('text-white');
            }
        }

        