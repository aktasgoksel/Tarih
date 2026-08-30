import './style.css';



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(err => console.error("SW Registration failed:", err));
        }

        // Firebase Configuration
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
        const auth = getAuth(app);
        
const db = getFirestore(app);

window.testData = [];

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
        window.testData = fetchedTests;
        
        // Re-render UI now that data is available
        renderDropdown();
        // Trigger first test if it's currently empty
        if (window.testData.length > 0) {
            window.showTest(currentTestIndex || 0);
        }
        
    } catch (error) {
        console.error("Failed to fetch tests:", error);
        document.getElementById('current-test-title').textContent = "Hata: " + error.message;
        document.getElementById('current-test-title').classList.add('text-red-500');
    }
}


        // --- THEME LOGIC ---
        function applyTheme(isDark) {
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                setThemeIcons('moon');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                setThemeIcons('sun');
            }
        }
        
        window.toggleDarkMode = function() {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(!isDark);
        }

        function setThemeIcons(mode) {
            const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
            const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
            
            const appIcon = document.getElementById('theme-icon-app');
            const authIcon = document.getElementById('theme-icon-auth');
            if(appIcon) appIcon.innerHTML = mode === 'dark' ? sunIcon : moonIcon;
            if(authIcon) authIcon.innerHTML = mode === 'dark' ? sunIcon : moonIcon;
        }

        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

        // --- XSS PROTECTION ---
        window.escapeHTML = function(str) {
            if(typeof str !== 'string') return str;
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag]));
        }

        // --- STATE ---
        let currentUser = null;
        let userData = { mistakes: [], favorites: [], testProgress: {} }; 
        
        let currentMode = 'NORMAL'; // NORMAL, MISTAKES, FAVORITES, RANDOM
        let currentTestIndex = 0;
        let currentQuestionIndex = 0;
        let currentTestQuestions = []; // The array of question objects currently being rendered
        
        // --- TIMER STATE ---
        let timerInterval = null;
        let timeRemaining = 0;
        
        window.handleEnter = function(e, action) {
            if (e.key === 'Enter') {
                if(action === 'login') window.login();
                else if(action === 'register') window.register();
                else if(action === 'forgot') window.sendResetEmail();
            }
        }
        
        window.switchAuth = function(type) {
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const forgotForm = document.getElementById('forgot-form');
            const errorText = document.getElementById('auth-error');
            
            errorText.textContent = '';
            errorText.className = 'text-sm text-center font-medium h-5 mt-3 empty:hidden text-red-500 dark:text-red-400';
            
            loginForm.classList.add('hidden-form');
            registerForm.classList.add('hidden-form');
            forgotForm.classList.add('hidden-form');
            
            if(type === 'register') {
                registerForm.classList.remove('hidden-form');
                document.getElementById('register-username').focus();
            } else if(type === 'forgot') {
                forgotForm.classList.remove('hidden-form');
                document.getElementById('forgot-email').focus();
            } else {
                loginForm.classList.remove('hidden-form');
                document.getElementById('login-username').focus();
            }
        }
        
        window.togglePassword = function(inputId, btn) {
            const input = document.getElementById(inputId);
            if (input.type === "password") {
                input.type = "text";
                btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`;
            } else {
                input.type = "password";
                btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
            }
        }

        // --- AUTH & FIREBASE ---
        
        window.login = async function() {
            const email = document.getElementById('login-username').value.trim();
            const pass = document.getElementById('login-password').value;
            const err = document.getElementById('auth-error');
            
            if(!email || !pass) { err.textContent = 'Lütfen e-posta ve şifrenizi girin.'; return; }
            
            err.textContent = 'Giriş yapılıyor...';
            try {
                await signInWithEmailAndPassword(auth, email, pass);
            } catch(error) {
                console.error(error);
                err.textContent = 'Giriş başarısız. E-posta veya şifrenizi kontrol edin.';
            }
        }

        window.register = async function() {
            const username = document.getElementById('register-displayname').value.trim();
            const email = document.getElementById('register-username').value.trim();
            const pass = document.getElementById('register-password').value;
            const err = document.getElementById('auth-error');
            
            if(!username || !email || !pass) { err.textContent = 'Lütfen tüm alanları doldurun.'; return; }
            if(pass.length < 6) { err.textContent = 'Şifre en az 6 karakter olmalı.'; return; }
            
            err.textContent = 'Kayıt olunuyor... Lütfen bekleyin.';
            try {
                const userCred = await createUserWithEmailAndPassword(auth, email, pass);
                await updateProfile(userCred.user, { displayName: username });
                await sendEmailVerification(userCred.user);
            } catch(error) {
                console.error(error);
                if(error.code === 'auth/email-already-in-use') {
                    err.textContent = 'Bu e-posta adresi zaten kullanımda.';
                } else if(error.code === 'auth/invalid-email') {
                    err.textContent = 'Geçersiz e-posta adresi.';
                } else {
                    err.textContent = 'Kayıt olurken bir hata oluştu: ' + error.message;
                }
            }
        }
        
        window.sendResetEmail = async function() {
            const email = document.getElementById('forgot-email').value.trim();
            const err = document.getElementById('auth-error');
            
            if(!email) { err.textContent = "Lütfen e-posta adresinizi girin."; return; }
            
            err.className = "text-sm text-center font-medium h-5 mt-3 text-blue-600 dark:text-blue-400";
            err.textContent = "Bağlantı gönderiliyor...";
            
            try {
                await sendPasswordResetEmail(auth, email);
                err.className = "text-sm text-center font-medium h-5 mt-3 text-emerald-600 dark:text-emerald-400";
                err.textContent = "Şifre sıfırlama bağlantısı e-postanıza gönderildi!";
                setTimeout(() => window.switchAuth('login'), 3500);
            } catch(error) {
                err.className = "text-sm text-center font-medium h-5 mt-3 text-red-500 dark:text-red-400";
                if(error.code === 'auth/user-not-found') {
                    err.textContent = "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.";
                } else if(error.code === 'auth/invalid-email') {
                    err.textContent = "Geçersiz e-posta formatı.";
                } else {
                    err.textContent = "Hata: " + error.message;
                }
            }
        }

        window.loginWithGoogle = async function() {
            const provider = new GoogleAuthProvider();
            const err = document.getElementById('auth-error');
            err.textContent = 'Google ekranı bekleniyor...';
            try {
                await signInWithPopup(auth, provider);
            } catch(error) {
                console.error(error);
                err.textContent = 'Hata: ' + (error.message || 'Bilinmeyen Hata');
            }
        }

        window.logout = async function() {
            try {
                await signOut(auth);
            } catch(error) {
                console.error(error);
            }
        }

        window.checkVerification = async function() {
            if(auth.currentUser) {
                const msg = document.getElementById('verify-msg');
                msg.className = "text-sm font-medium mt-3 text-blue-500";
                msg.textContent = "Kontrol ediliyor...";
                await auth.currentUser.reload();
                if(auth.currentUser.emailVerified) {
                    window.location.reload();
                } else {
                    msg.className = "text-sm font-medium mt-3 text-rose-500";
                    msg.textContent = "Hesabınız henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.";
                }
            }
        }
        
        window.resendVerification = async function() {
            if(auth.currentUser) {
                const msg = document.getElementById('verify-msg');
                msg.className = "text-sm font-medium mt-3 text-blue-500";
                msg.textContent = "Gönderiliyor...";
                try {
                    await sendEmailVerification(auth.currentUser);
                    msg.className = "text-sm font-medium mt-3 text-emerald-600";
                    msg.textContent = "Doğrulama e-postası tekrar gönderildi. Lütfen gelen kutunuzu (ve Spam klasörünü) kontrol edin.";
                } catch (error) {
                    msg.className = "text-sm font-medium mt-3 text-rose-500";
                    if(error.code === 'auth/too-many-requests') {
                        msg.textContent = "Çok fazla istek attınız, lütfen daha sonra tekrar deneyin.";
                    } else {
                        msg.textContent = "E-posta gönderilirken hata oluştu.";
                    }
                }
            }
        }

        // AUTH LISTENER
        onAuthStateChanged(auth, async (user) => {
            const err = document.getElementById('auth-error');
            
            if (user) {
                // VERIFICATION CHECK
                if (false) {
                    document.getElementById('auth-screen').classList.add('hidden');
                    document.getElementById('app-screen').classList.add('hidden');
                    document.getElementById('verify-screen').classList.remove('hidden');
                    document.getElementById('verify-screen').classList.add('flex');
                    document.getElementById('verify-email-text').textContent = `${user.email} adresinize bir doğrulama bağlantısı gönderdik. Devam etmek için lütfen gelen kutunuzu kontrol edin.`;
                    return;
                }
                
                // Hide Verification Screen
                document.getElementById('verify-screen').classList.add('hidden');
                document.getElementById('verify-screen').classList.remove('flex');
                
                // Logged in & Verified
                currentUser = user;
                document.getElementById('auth-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('flex');
                
                // ADMIN ROLE CHECK
                const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
                if(ADMIN_EMAILS.includes(currentUser.email)) {
                    document.getElementById('admin-panel-btn').classList.remove('hidden');
                } else {
                    document.getElementById('admin-panel-btn').classList.add('hidden');
                }
                
                let displayName = user.displayName || user.email.split('@')[0];
                document.getElementById('welcome-text').textContent = `Hoş geldin, ${displayName}`;
                err.textContent = '';
                
                // Fetch data from Firestore
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        userData = docSnap.data();
                        if(!userData.mistakes) userData.mistakes = [];
                        if(!userData.favorites) userData.favorites = [];
                        if(!userData.testProgress) userData.testProgress = {};
                    } else {
                        // New user
                        userData = { mistakes: [], favorites: [], testProgress: {} };
                        await setDoc(docRef, userData);
                    }
                } catch(e) {
                    console.error("Veri çekilemedi, geçici (boş) profille başlandı", e);
                    userData = { mistakes: [], favorites: [], testProgress: {} };
                }
                
                await loadTestsFromFirestore();
                
                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();
                
            } else {
                // Logged out
                stopTimer();
                currentUser = null;
                userData = { mistakes: [], favorites: [], testProgress: {} };
                
                document.getElementById('verify-screen').classList.add('hidden');
                document.getElementById('verify-screen').classList.remove('flex');
                document.getElementById('app-screen').classList.add('hidden');
                document.getElementById('auth-screen').classList.remove('hidden');
                
                document.getElementById('login-username').value = '';
                document.getElementById('login-password').value = '';
                document.getElementById('register-displayname').value = '';
                document.getElementById('register-username').value = '';
                document.getElementById('register-password').value = '';
                document.getElementById('forgot-email').value = '';
                err.textContent = '';
                window.switchAuth('login');
            }
        });
        

        
        function cleanStaleMistakes() {
            if (!userData.mistakes) return;
            const originalLength = userData.mistakes.length;
            userData.mistakes = userData.mistakes.filter(m => {
                return testData[m.testIdx] && testData[m.testIdx].questions && testData[m.testIdx].questions[m.qIdx];
            });
            if (originalLength !== userData.mistakes.length) {
                saveUserDataCloud();
            }
        }
        
        async function saveUserDataCloud() {
            if(!currentUser) return;
            updateMistakeBadge();
            updateFavoritesBadge();
            
            try {
                await setDoc(doc(db, "users", currentUser.uid), userData);
            } catch(e) {
                console.error("Veritabanına kaydedilemedi:", e);
            }
        }

        function updateMistakeBadge() {
            const badge = document.getElementById('mistake-badge');
            const mistakeCount = userData.mistakes ? userData.mistakes.length : 0;
            badge.textContent = mistakeCount;
            
            const btn = document.getElementById('dashboard-mistake-btn');
            const clearBtn = document.getElementById('clear-mistakes-btn');
            
            if(mistakeCount === 0) {
                btn.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
                clearBtn.classList.add('opacity-50', 'pointer-events-none');
            } else {
                btn.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
                clearBtn.classList.remove('opacity-50', 'pointer-events-none');
            }
        }

        function updateFavoritesBadge() {
            const badge = document.getElementById('favorite-badge');
            const favCount = userData.favorites ? userData.favorites.length : 0;
            badge.textContent = favCount;
            
            const btn = document.getElementById('dashboard-favorite-btn');
            if(favCount === 0) {
                btn.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
            } else {
                btn.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
            }
        }

        window.clearAllMistakes = function() {
            if(userData.mistakes && userData.mistakes.length > 0) {
                if(confirm("Tüm yanlış soru kayıtlarınızı sıfırlamak (silmek) istediğinize emin misiniz?")) {
                    userData.mistakes = [];
                    saveUserDataCloud();
                    if(currentMode === 'MISTAKES') {
                        window.showTest(0);
                    }
                }
            }
        }

        // --- FAVORITES LOGIC ---
        window.toggleFavorite = function(uiIndex) {
            const qObj = currentTestQuestions[uiIndex];
            if(!userData.favorites) userData.favorites = [];
            
            const idx = userData.favorites.findIndex(f => f.testIdx === qObj.originalTestIdx && f.qIdx === qObj.originalQIdx);
            if(idx === -1) {
                userData.favorites.push({ testIdx: qObj.originalTestIdx, qIdx: qObj.originalQIdx });
            } else {
                userData.favorites.splice(idx, 1);
            }
            saveUserDataCloud();
            
            // Re-render button
            const btn = document.getElementById(`star-btn-${uiIndex}`);
            if(btn) {
                const isFav = idx === -1; // -1 means we just added it
                btn.innerHTML = isFav 
                    ? `<svg class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
                    : `<svg class="w-6 h-6 text-gray-400 hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;
            }
        }

        // --- TIMER LOGIC ---
        let isTimerRunning = false;
        let isTimerPaused = false;
        let testTotalQuestionsForTimer = 0;
        
        function prepareTimer(totalQuestions) {
            stopTimer();
            testTotalQuestionsForTimer = totalQuestions;
            timeRemaining = totalQuestions * 60; // 1 min per question
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
            if(isTimerRunning) return;
            
            isTimerPaused = false;
            updatePauseIcons();
            
            document.getElementById('start-timer-btn').classList.add('hidden');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
            
            document.getElementById('timer-container').classList.remove('hidden');
            document.getElementById('timer-container').classList.add('flex');
            document.getElementById('mobile-timer-container').classList.remove('hidden');
            document.getElementById('mobile-timer-container').classList.add('flex');
            
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if(!isTimerPaused) {
                    timeRemaining--;
                    updateTimerUI();
                    if(timeRemaining <= 0) {
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
            isTimerPaused = !isTimerPaused;
            updatePauseIcons();
        }
        
        function updatePauseIcons() {
            const btns = document.querySelectorAll('.timer-pause-btn');
            const playIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`;
            const pauseIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
            
            btns.forEach(btn => {
                btn.innerHTML = isTimerPaused ? playIcon : pauseIcon;
                if(isTimerPaused) {
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
            prepareTimer(testTotalQuestionsForTimer);
        }

        function stopTimer() {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn').classList.add('hidden');
            
            document.getElementById('mobile-timer-bar').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
        }

        function updateTimerUI() {
            const m = Math.floor(timeRemaining / 60);
            const s = timeRemaining % 60;
            const text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            
            const el = document.getElementById('timer-text');
            const mobEl = document.getElementById('mobile-timer-text');
            
            el.textContent = text;
            mobEl.textContent = text;
            
            if(timeRemaining < 60) {
                el.classList.add('text-red-400');
                mobEl.classList.add('text-red-400');
                mobEl.classList.remove('text-white');
            } else {
                el.classList.remove('text-red-400');
                mobEl.classList.remove('text-red-400');
                mobEl.classList.add('text-white');
            }
        }

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
                    currentQuestionIndex = i;
                    updateUI();
                };
                grid.appendChild(btn);
            }
        }

        function updateGridUI() {
            const totalQ = currentTestQuestions.length;
            for(let i=0; i<totalQ; i++) {
                const btn = document.getElementById(`grid-btn-${i}`);
                if(!btn) continue;
                
                btn.className = "w-10 h-10 rounded-lg text-sm font-bold border transition-all flex items-center justify-center focus:outline-none cursor-pointer ";
                
                const isAnswered = document.querySelector(`input[name="question-${i}"]:checked`);
                
                if (i === currentQuestionIndex) {
                    btn.className += ' border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 ring-2 ring-blue-300 dark:ring-blue-700';
                } else if (isAnswered) {
                    btn.className += ' border-gray-300 bg-gray-200 text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 opacity-80';
                } else {
                    btn.className += ' border-gray-200 bg-white text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700';
                }
            }
        }

        // --- APP LOGIC ---

        function renderDropdown() {
            const dropdown = document.getElementById('test-dropdown');
            dropdown.innerHTML = '';
            
            // Random Trial Option
            const randomOpt = document.createElement('option');
            randomOpt.value = 'RANDOM_27';
            randomOpt.textContent = '🎲 Gerçek KPSS Denemesi (Rastgele 27 Soru)';
            randomOpt.className = 'font-bold text-indigo-600 dark:text-indigo-400';
            dropdown.appendChild(randomOpt);
            
            // Mistake Option
            const mistakeOpt = document.createElement('option');
            mistakeOpt.value = 'MISTAKES';
            mistakeOpt.textContent = '🔥 Yanlış Yaptığım Sorular (Özel Test)';
            mistakeOpt.className = 'font-bold text-rose-600 dark:text-rose-400';
            dropdown.appendChild(mistakeOpt);
            
            // Favorite Option
            const favOpt = document.createElement('option');
            favOpt.value = 'FAVORITES';
            favOpt.textContent = '⭐ Favori Sorularım (Kaydedilenler)';
            favOpt.className = 'font-bold text-amber-600 dark:text-amber-400';
            dropdown.appendChild(favOpt);
            
            testData.forEach((test, index) => {
                const opt = document.createElement('option');
                opt.value = index;
                const isFinished = userData.testProgress[index] && userData.testProgress[index].finished;
                
                let scoreText = '';
                if(isFinished) {
                    const score = userData.testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${test.title}${scoreText}`;
                dropdown.appendChild(opt);
            });
        }

        function generateMistakeTest() {
            currentMode = 'MISTAKES';
            currentTestQuestions = [];
            
            const shuffled = [...userData.mistakes].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 30); // up to 30 mistake questions
            
            selected.forEach(m => {
                const test = testData[m.testIdx];
                if(test && test.questions && test.questions[m.qIdx]) {
                    currentTestQuestions.push({
                        originalTestIdx: m.testIdx,
                        originalQIdx: m.qIdx,
                        data: test.questions[m.qIdx]
                    });
                }
            });
            
            document.getElementById('current-test-title').textContent = currentTestQuestions.length > 0 
                ? `🔥 Yanlışlarım (${currentTestQuestions.length} Soru)` 
                : 'Hiç yanlışınız yok! Tebrikler!';
                
            currentQuestionIndex = 0;
            renderTestUI(currentTestQuestions);
            renderGrid(currentTestQuestions.length);
            
            if(currentTestQuestions.length > 0) {
                prepareTimer(currentTestQuestions.length);
            } else {
                stopTimer();
                document.getElementById('grid-container').classList.add('hidden');
            }
            updateUI();
        }
        
        function generateFavoritesTest() {
            currentMode = 'FAVORITES';
            currentTestQuestions = [];
            
            const shuffled = [...userData.favorites].sort(() => 0.5 - Math.random());
            
            shuffled.forEach(m => {
                const test = testData[m.testIdx];
                if(test && test.questions && test.questions[m.qIdx]) {
                    currentTestQuestions.push({
                        originalTestIdx: m.testIdx,
                        originalQIdx: m.qIdx,
                        data: test.questions[m.qIdx]
                    });
                }
            });
            
            document.getElementById('current-test-title').textContent = currentTestQuestions.length > 0 
                ? `⭐ Favori Sorularım (${currentTestQuestions.length} Soru)` 
                : 'Henüz favori sorunuz yok.';
                
            currentQuestionIndex = 0;
            renderTestUI(currentTestQuestions);
            renderGrid(currentTestQuestions.length);
            
            if(currentTestQuestions.length > 0) {
                prepareTimer(currentTestQuestions.length);
            } else {
                stopTimer();
                document.getElementById('grid-container').classList.add('hidden');
            }
            updateUI();
        }

        window.generateRandomTest = function() {
            currentMode = 'RANDOM_27';
            currentTestQuestions = [];
            
            let allQ = [];
            testData.forEach((test, tIdx) => {
                test.questions.forEach((q, qIdx) => {
                    allQ.push({ originalTestIdx: tIdx, originalQIdx: qIdx, data: q });
                });
            });
            
            allQ.sort(() => 0.5 - Math.random());
            currentTestQuestions = allQ.slice(0, 27);
            
            document.getElementById('current-test-title').textContent = '🎲 Rastgele KPSS Denemesi (27 Soru)';
            currentQuestionIndex = 0;
            
            renderTestUI(currentTestQuestions);
            renderGrid(currentTestQuestions.length);
            
            if(currentTestQuestions.length > 0) {
                prepareTimer(currentTestQuestions.length);
            } else {
                stopTimer();
                document.getElementById('grid-container').classList.add('hidden');
            }
            updateUI();
        }

        window.showTest = function(val) {
            if(val === 'MISTAKES') {
                document.getElementById('test-dropdown').value = 'MISTAKES';
                generateMistakeTest();
                return;
            }
            if(val === 'FAVORITES') {
                document.getElementById('test-dropdown').value = 'FAVORITES';
                generateFavoritesTest();
                return;
            }
            if(val === 'RANDOM_27') {
                document.getElementById('test-dropdown').value = 'RANDOM_27';
                window.generateRandomTest();
                return;
            }
            
            currentMode = 'NORMAL';
            let index = parseInt(val);
            currentTestIndex = index;
            currentQuestionIndex = 0;
            
            document.getElementById('test-dropdown').value = index;
            document.getElementById('current-test-title').textContent = testData[index].title;
            
            currentTestQuestions = testData[index].questions.map((q, idx) => ({
                originalTestIdx: index,
                originalQIdx: idx,
                data: q
            }));
            
            renderTestUI(currentTestQuestions);
            renderGrid(currentTestQuestions.length);
            
            const isFinished = userData.testProgress[index] && userData.testProgress[index].finished;
            
            if (isFinished) {
                stopTimer();
                evaluateTest(currentTestQuestions);
            } else {
                prepareTimer(currentTestQuestions.length);
            }
            
            updateUI();
        }

        function renderTestUI(questions) {
            const container = document.getElementById('questions-container');
            container.innerHTML = '';
            
            if(questions.length === 0) {
                container.innerHTML = '<div class="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><span class="text-gray-500 dark:text-gray-400 font-medium text-lg">Gösterilecek soru bulunamadı.</span></div>';
                document.getElementById('submit-btn').style.display = 'none';
                return;
            }

            questions.forEach((qObj, index) => {
                const q = qObj.data;
                const questionEl = document.createElement('div');
                questionEl.className = 'question-block relative bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 md:p-8 transition-colors duration-200';
                questionEl.id = `q-block-${index}`;
                
                let sourceBadge = '';
                if(currentMode !== 'NORMAL') {
                    sourceBadge = `<span class="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-5 inline-block font-medium border border-indigo-200 dark:border-indigo-800/50 shadow-sm">Kaynak: ${window.escapeHTML(testData[qObj.originalTestIdx].title)} (Soru ${q.qNum})</span>`;
                }
                
                let isFav = userData.favorites && userData.favorites.find(f => f.testIdx === qObj.originalTestIdx && f.qIdx === qObj.originalQIdx);
                let starSvg = isFav 
                    ? `<svg class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
                    : `<svg class="w-6 h-6 text-gray-400 hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;

                const favButton = `<button id="star-btn-${index}" onclick="window.toggleFavorite(${index})" class="absolute top-5 right-5 p-1 bg-white dark:bg-slate-800 rounded-full focus:outline-none z-10 transition-transform hover:scale-110" title="Favorilere Ekle/Çıkar">${starSvg}</button>`;

                let optionsHtml = '';
                Object.keys(q.options).forEach((optKey, optIndex) => {
                    let optText = window.escapeHTML(q.options[optKey]);
                    if (typeof optText === 'string') optText = optText.replace(/\n/g, '<br>');
                    
                    const radioName = `question-${index}`;
                    
                    optionsHtml += 
                        `<div class="mb-3 relative group">
                            <input type="radio" id="opt-${index}-${optIndex}" name="${radioName}" value="${optKey}" class="peer sr-only" onchange="window.handleOptionSelect(${index}); window.updateGridUI();">
                            <label for="opt-${index}-${optIndex}" class="option-label block w-full p-4 border border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 group-hover:border-blue-300 dark:group-hover:border-blue-500/50 pr-10">
                                <span class="font-bold mr-2 text-blue-600 dark:text-blue-400">${optKey})</span> <span class="inline-block align-top">${optText}</span>
                            </label>
                        </div>`
                    ;
                });
                
                let qText = window.escapeHTML(q.question);
                if(typeof qText === 'string') qText = qText.replace(/\n/g, '<br>');

                questionEl.innerHTML = 
                    `${favButton}
                    ${sourceBadge}
                    <h3 class="text-lg md:text-xl font-semibold mb-6 pr-8 text-gray-800 dark:text-gray-100 leading-relaxed"><span class="text-blue-600 dark:text-blue-400 mr-2">${index + 1}.</span>${qText}</h3>
                    <div class="options-container mb-4">
                        ${optionsHtml}
                    </div>
                    
                    <div id="check-btn-container-${index}" class="mt-5 flex justify-end">
                        <button onclick="window.evaluateSingleQuestion(${index})" class="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold transition-colors text-sm shadow-sm flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Cevabı Kontrol Et
                        </button>
                    </div>

                    <div id="solution-${index}" class="hidden mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg">
                        <h4 class="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Çözüm ve Açıklama (Doğru Cevap: ${q.answer})
                        </h4>
                        <p class="text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">${q.solution ? (typeof q.solution === 'string' ? window.escapeHTML(q.solution).replace(/\n/g, '<br>') : window.escapeHTML(q.solution)) : 'Açıklama bulunmuyor.'}</p>
                    </div>`
                ;
                container.appendChild(questionEl);
            });
        }

        window.updateGridUI = updateGridUI;

        function updateUI() {
            const totalQ = currentTestQuestions.length;
            if(totalQ === 0) return;
            
            document.querySelectorAll('.question-block').forEach((el, idx) => {
                if(idx === currentQuestionIndex) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            
            const counterText = `Soru ${currentQuestionIndex + 1} / ${totalQ}`;
            document.getElementById('question-counter').textContent = counterText;
            
            const progressPct = ((currentQuestionIndex) / (totalQ - 1)) * 100 || 0;
            document.getElementById('progress-bar').style.width = `${progressPct}%`;
            
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            const resultContainer = document.getElementById('result-container');
            
            prevBtn.style.display = currentQuestionIndex > 0 ? 'flex' : 'none';
            
            const isFinished = (currentMode === 'NORMAL') ? (userData.testProgress[currentTestIndex] && userData.testProgress[currentTestIndex].finished) : false;
            // For special modes, they are never "finished" formally in DB, they just hide the submit button if they end. 
            // Actually, we can submit RANDOM tests to show results. Let's allow submit for RANDOM mode!
            
            const canSubmit = (currentMode === 'NORMAL' && !isFinished) || (currentMode === 'RANDOM_27');
            
            if (currentQuestionIndex === totalQ - 1) {
                nextBtn.style.display = 'none';
                if (canSubmit) {
                    submitBtn.classList.remove('hidden');
                    submitBtn.classList.add('flex');
                } else {
                    submitBtn.classList.remove('flex');
                    submitBtn.classList.add('hidden');
                }
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.classList.remove('flex');
                submitBtn.classList.add('hidden');
            }
            
            const statusEl = document.getElementById('test-status');
            const mobStatusEl = document.getElementById('mobile-test-status');
            let statusText = '', statusClass = '', mobStatusClass = '';

            if(currentMode === 'MISTAKES' || currentMode === 'FAVORITES') {
                statusText = (currentMode === 'MISTAKES') ? 'Hata Testi' : 'Favoriler';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border border-transparent dark:border-rose-800/50';
                if(currentMode === 'FAVORITES') statusClass = statusClass.replace(/rose/g, 'amber');
                mobStatusClass = statusClass.replace('px-3 py-1', 'sm:hidden px-3 py-1.5 text-xs border shadow-sm');
                resultContainer.classList.add('hidden');
            } else if(currentMode === 'RANDOM_27' && !document.getElementById('result-container').classList.contains('hidden')) {
                // if random test is submitted, it will show result-container. We shouldn't force hide it here unless it's resetting.
                // It will be handled in evaluateTest / submitCurrentTest
            } else if(isFinished) {
                statusText = 'Tamamlandı';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-transparent dark:border-emerald-800/50';
                mobStatusClass = 'sm:hidden px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-800/50';
                resultContainer.classList.remove('hidden');
                stopTimer();
            } else {
                statusText = 'Çözülüyor';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 border border-transparent dark:border-yellow-800/50';
                mobStatusClass = 'sm:hidden px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800/50';
            }
            
            statusEl.textContent = statusText;
            statusEl.className = statusClass;
            if (mobStatusEl) {
                mobStatusEl.textContent = statusText;
                mobStatusEl.className = mobStatusClass;
            }
            
            updateGridUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        window.nextQuestion = function() {
            const total = currentTestQuestions.length;
            if (currentQuestionIndex < total - 1) {
                currentQuestionIndex++;
                updateUI();
            }
        }

        window.prevQuestion = function() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                updateUI();
            }
        }
        
        window.handleOptionSelect = function(qIndex) {
            const isInstant = document.getElementById('instant-feedback').checked;
            const isFinished = (currentMode === 'NORMAL') ? (userData.testProgress[currentTestIndex] && userData.testProgress[currentTestIndex].finished) : false;
            
            if (isInstant && !isFinished && currentMode !== 'RANDOM_27') {
                window.evaluateSingleQuestion(qIndex);
            }
        }
        
        function recordMistake(tIdx, qIdx, isMistake) {
            const existingIdx = userData.mistakes.findIndex(m => m.testIdx === tIdx && m.qIdx === qIdx);
            
            if(isMistake) {
                if(existingIdx === -1) {
                    userData.mistakes.push({ testIdx: tIdx, qIdx: qIdx });
                }
            } else {
                if(existingIdx !== -1) {
                    userData.mistakes.splice(existingIdx, 1);
                }
            }
            saveUserDataCloud();
        }

        window.evaluateSingleQuestion = function(uiIndex) {
            const qObj = currentTestQuestions[uiIndex];
            const q = qObj.data;
            const radioName = `question-${uiIndex}`;
            
            const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!selectedOption) {
                window.showModal({ type: 'info', title: 'Uyarı', text: 'Çözümü görmek için lütfen önce bir şık işaretleyin.', confirmText: 'Tamam' });
                return;
            }
            
            const inputs = document.querySelectorAll(`input[name="${radioName}"]`);
            inputs.forEach(input => input.disabled = true);

            const correctInput = document.querySelector(`input[name="${radioName}"][value="${q.answer}"]`);
            if(correctInput) {
                correctInput.nextElementSibling.classList.add('correct-answer');
            }

            let isMistake = false;
            if (selectedOption.value !== q.answer) {
                selectedOption.nextElementSibling.classList.add('incorrect-answer');
                isMistake = true;
            }
            
            recordMistake(qObj.originalTestIdx, qObj.originalQIdx, isMistake);
            
            const solutionDiv = document.getElementById(`solution-${uiIndex}`);
            if(solutionDiv) solutionDiv.classList.remove('hidden');
            
            const btnContainer = document.getElementById(`check-btn-container-${uiIndex}`);
            if(btnContainer) btnContainer.classList.add('hidden');
        }

        function evaluateTest(mappedQuestions) {
            let score = 0;
            
            mappedQuestions.forEach((qObj, uiIndex) => {
                const q = qObj.data;
                const radioName = `question-${uiIndex}`;
                
                const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                const solutionDiv = document.getElementById(`solution-${uiIndex}`);
                
                const inputs = document.querySelectorAll(`input[name="${radioName}"]`);
                inputs.forEach(input => input.disabled = true);

                const correctInput = document.querySelector(`input[name="${radioName}"][value="${q.answer}"]`);
                if(correctInput) {
                    correctInput.nextElementSibling.classList.add('correct-answer');
                }

                if (selectedOption) {
                    if (selectedOption.value === q.answer) {
                        score++;
                        recordMistake(qObj.originalTestIdx, qObj.originalQIdx, false);
                    } else {
                        selectedOption.nextElementSibling.classList.add('incorrect-answer');
                        recordMistake(qObj.originalTestIdx, qObj.originalQIdx, true);
                    }
                } else {
                    recordMistake(qObj.originalTestIdx, qObj.originalQIdx, true);
                }
                
                if(solutionDiv) solutionDiv.classList.remove('hidden');
                
                const btnContainer = document.getElementById(`check-btn-container-${uiIndex}`);
                if(btnContainer) btnContainer.classList.add('hidden');
            });
            
            return score;
        }

        window.submitCurrentTest = function(forceSubmit = false) {
            if(currentMode === 'MISTAKES' || currentMode === 'FAVORITES') return;
            
            let answeredCount = 0;
            currentTestQuestions.forEach((q, uiIndex) => {
                if(document.querySelector(`input[name="question-${uiIndex}"]:checked`)) {
                    answeredCount++;
                }
            });
            
            if(!forceSubmit && answeredCount < currentTestQuestions.length) {
                if(!confirm(`Henüz ${currentTestQuestions.length - answeredCount} soruyu boş bıraktınız. Testi bitirmek istediğinize emin misiniz?`)) {
                    return;
                }
            }
            
            stopTimer(); 
            
            const score = evaluateTest(currentTestQuestions);
            
            if (currentMode === 'NORMAL') {
                userData.testProgress[currentTestIndex] = {
                    finished: true,
                    score: score
                };
                saveUserDataCloud();
            }
            
            const resultContainer = document.getElementById('result-container');
            resultContainer.classList.remove('hidden');
            
            const scoreText = document.getElementById('score-text');
            scoreText.innerHTML = `${score} / ${currentTestQuestions.length}`;
            
            const reviewBtn = document.getElementById('review-mistakes-btn');
            if (score < currentTestQuestions.length) {
                reviewBtn.classList.remove('hidden');
                reviewBtn.classList.add('flex');
            } else {
                reviewBtn.classList.add('hidden');
                reviewBtn.classList.remove('flex');
            }
            
            // CONFETTI ANIMATION IF FULL SCORE
            if (score === currentTestQuestions.length && typeof confetti === 'function') {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 },
                    colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#3b82f6']
                });
            }
            
            currentQuestionIndex = 0;
            updateUI();
            if(currentMode === 'NORMAL') renderDropdown();
        }
        
        window.showReviewMistakes = function() {
            for(let i=0; i<currentTestQuestions.length; i++) {
                const radioName = `question-${i}`;
                const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                const q = currentTestQuestions[i].data;
                
                if (!selectedOption || selectedOption.value !== q.answer) {
                    currentQuestionIndex = i;
                    updateUI();
                    return;
                }
            }
        }

        let myChart = null;

        window.showStatsModal = function() {
            const modal = document.getElementById('stats-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
            
            renderStats();
        }

        window.closeStatsModal = function() {
            const modal = document.getElementById('stats-modal');
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            modal.firstElementChild.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
        
        function getCategoryName(title) {
            if(!title.includes(':')) return "Genel";
            const part = title.split(':')[1];
            return part.split('-')[0].trim();
        }

        function renderStats() {
            let catData = {};
            let hasData = false;
            
            if(userData.testProgress) {
                Object.keys(userData.testProgress).forEach(tIdx => {
                    const prog = userData.testProgress[tIdx];
                    if(prog && prog.finished) {
                        hasData = true;
                        const test = testData[tIdx];
                        const cat = getCategoryName(test.title);
                        if(!catData[cat]) catData[cat] = { correct: 0, total: 0 };
                        catData[cat].correct += prog.score;
                        catData[cat].total += test.questions.length;
                    }
                });
            }
            
            const emptyEl = document.getElementById('stats-empty');
            const contentEl = document.getElementById('stats-content');
            
            if(!hasData) {
                emptyEl.classList.remove('hidden');
                contentEl.classList.add('hidden');
                return;
            }
            
            emptyEl.classList.add('hidden');
            contentEl.classList.remove('hidden');
            
            // Sort categories by total questions solved (descending)
            const labels = Object.keys(catData).sort((a,b) => catData[b].total - catData[a].total);
            const correctData = labels.map(l => catData[l].correct);
            const wrongData = labels.map(l => catData[l].total - catData[l].correct);
            
            // Build progress bars
            const detailsEl = document.getElementById('category-details');
            detailsEl.innerHTML = '<h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">Konu Bazlı Başarı Oranları</h3>';
            
            labels.forEach(l => {
                const pct = Math.round((catData[l].correct / catData[l].total) * 100);
                let colorClass = 'bg-emerald-500';
                if(pct < 50) colorClass = 'bg-rose-500';
                else if(pct < 75) colorClass = 'bg-yellow-400';
                else if(pct < 90) colorClass = 'bg-blue-500';
                
                detailsEl.innerHTML += `
                    <div class="mb-4">
                        <div class="flex justify-between text-xs mb-1 font-bold text-gray-700 dark:text-gray-300">
                            <span class="truncate pr-2">${l}</span>
                            <span class="shrink-0">%${pct} (${catData[l].correct}/${catData[l].total})</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <div class="${colorClass} h-2 rounded-full transition-all" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            });
            
            // Render Chart
            const ctx = document.getElementById('categoryChart').getContext('2d');
            if(myChart) myChart.destroy();
            
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#e2e8f0' : '#475569';
            
            myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doğru Sayısı',
                        data: correctData,
                        backgroundColor: [
                            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#f97316', '#6366f1', '#84cc16'
                        ],
                        borderWidth: isDark ? 2 : 1,
                        borderColor: isDark ? '#1e293b' : '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '65%',
                    plugins: {
                        legend: { 
                            position: 'bottom', 
                            labels: { color: textColor, font: { family: 'Inter', size: 11, weight: '500' }, padding: 15 } 
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const val = context.raw || 0;
                                    const total = catData[label].total;
                                    const pct = Math.round((val / total) * 100);
                                    return ` ${label}: ${val} Doğru (%${pct})`;
                                }
                            }
                        }
                    }
                }
            });
        }

        window.openSuggestionModal = function() {
            document.getElementById('suggestion-modal').classList.remove('hidden');
        }
        window.closeSuggestionModal = function() {
            document.getElementById('suggestion-modal').classList.add('hidden');
            document.getElementById('suggestion-text').value = '';
        }
        
        window.submitSuggestion = async function() {
            const text = document.getElementById('suggestion-text').value.trim();
            if(!text) return;
            

            
            try {
                const btn = document.getElementById('submit-suggestion-btn');
                btn.textContent = 'Gönderiliyor...';
                btn.disabled = true;
                
                await addDoc(collection(db, 'suggestions'), {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName || currentUser.email,
                    text: text,
                    timestamp: new Date().toISOString()
                });
                
                window.showModal({ type: 'success', title: 'Başarılı', text: 'Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.', confirmText: 'Tamam' });
                window.closeSuggestionModal();
                btn.textContent = 'Gönder';
                btn.disabled = false;
            } catch (e) {
                console.error(e);
                window.showModal({ type: 'error', title: 'Hata', text: 'Bir hata oluştu. Lütfen bağlantınızı kontrol edin.', confirmText: 'Tamam' });
                document.getElementById('submit-suggestion-btn').textContent = 'Tekrar Dene';
                document.getElementById('submit-suggestion-btn').disabled = false;
            }
        }

        window.openAdminPanel = async function() {
            const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
            if(!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
                window.showModal({ type: 'error', title: 'Hata', text: 'Yetkisiz erişim!', confirmText: 'Tamam' });
                return;
            }
            document.getElementById('admin-modal').classList.remove('hidden');
            const list = document.getElementById('admin-suggestions-list');
            list.innerHTML = '<div class="text-center py-10 text-gray-500">Veritabanından öneriler çekiliyor...</div>';
            
            try {
                const q = query(collection(db, "suggestions"));
                const querySnapshot = await getDocs(q);
                let items = [];
                querySnapshot.forEach((doc) => {
                    items.push(doc.data());
                });
                
                items.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                let html = '';
                items.forEach(item => {
                    const dateStr = new Date(item.timestamp).toLocaleString('tr-TR');
                    html += `
                        <div class="bg-white dark:bg-slate-800 p-4 mb-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                            <div class="flex justify-between items-center mb-2 border-b border-gray-100 dark:border-slate-700 pb-2">
                                <span class="font-bold text-blue-600 dark:text-blue-400">${window.escapeHTML(item.displayName)}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">${dateStr}</span>
                            </div>
                            <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${window.escapeHTML(item.text)}</div>
                        </div>
                    `;
                });
                
                if(items.length === 0) {
                    html = '<div class="text-center py-10 text-gray-500 font-medium">Henüz kimse bir öneri göndermemiş.</div>';
                }
                list.innerHTML = html;
            } catch (e) {
                console.error(e);
                list.innerHTML = '<div class="text-center text-red-500 py-10 font-bold">Veriler çekilemedi! Firebase Rules (Kurallar) izin vermiyor olabilir.</div>';
            }
        }

        window.openProfileModal = function() {
            if(!currentUser) return;
            const modal = document.getElementById('profile-modal');
            
            document.getElementById('profile-email').value = currentUser.email;
            document.getElementById('profile-username').value = currentUser.displayName || currentUser.email.split('@')[0];
            
            let totalQ = 0;
            let correctQ = 0;
            if(userData.testProgress) {
                Object.keys(userData.testProgress).forEach(tIdx => {
                    const prog = userData.testProgress[tIdx];
                    if(prog && prog.finished) {
                        const test = testData[tIdx];
                        totalQ += test.questions.length;
                        correctQ += prog.score;
                    }
                });
            }
            
            document.getElementById('profile-stat-total').textContent = totalQ;
            document.getElementById('profile-stat-correct').textContent = correctQ;
            document.getElementById('profile-stat-wrong').textContent = totalQ - correctQ;
            
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
        }

        window.closeProfileModal = function() {
            const modal = document.getElementById('profile-modal');
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            modal.firstElementChild.classList.remove('scale-100');
            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }

        window.updateUsername = async function() {
            const newName = document.getElementById('profile-username').value.trim();
            if(!newName) return;
            
            const btn = document.getElementById('profile-update-btn');
            btn.textContent = '...';
            btn.disabled = true;
            
            try {
                await updateProfile(currentUser, { displayName: newName });
                document.getElementById('welcome-text').textContent = `Hoş geldin, ${newName}`;
                
                window.showModal({ type: 'success', title: 'İşlem Başarılı', text: 'Kullanıcı adınız başarıyla güncellenmiştir.', confirmText: 'Tamam' });
            } catch(e) {
                console.error(e);
                window.showModal({ type: 'error', title: 'Hata', text: 'Kullanıcı adı güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
            }
            btn.textContent = 'Güncelle';
            btn.disabled = false;
        }

        window.updateEmailAddress = async function() {
            const newEmail = document.getElementById('profile-email').value.trim();
            if(!newEmail || newEmail === currentUser.email) return;
            
            const btn = document.getElementById('profile-email-btn');
            btn.textContent = '...';
            btn.disabled = true;
            
            try {
                await updateEmail(currentUser, newEmail);
                window.showModal({ type: 'success', title: 'İşlem Başarılı', text: 'E-posta adresiniz başarıyla güncellenmiştir. Hesabınıza artık yeni e-posta adresinizle giriş yapabilirsiniz.', confirmText: 'Tamam' });
            } catch(error) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                    window.showModal({ type: 'error', title: 'Doğrulama Gerekiyor', text: 'Güvenlik prosedürleri gereği e-posta adresinizi değiştirmeden önce sistemden çıkış yapıp tekrar giriş yapmanız gerekmektedir.', confirmText: 'Anladım' });
                } else if (error.code === 'auth/email-already-in-use') {
                    window.showModal({ type: 'error', title: 'Hata', text: 'Girdiğiniz e-posta adresi başka bir hesaba aittir. Lütfen farklı bir adres deneyin.', confirmText: 'Kapat' });
                } else if (error.code === 'auth/invalid-email') {
                    window.showModal({ type: 'error', title: 'Hata', text: 'Geçersiz bir e-posta formatı girdiniz.', confirmText: 'Kapat' });
                } else {
                    window.showModal({ type: 'error', title: 'Hata', text: 'E-posta adresi güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
                }
            }
            btn.textContent = 'Güncelle';
            btn.disabled = false;
        }

        window.deleteAccount = function() {
            window.showModal({
                type: 'warning',
                title: 'Dikkat!',
                text: 'Hesabınızı ve çözdüğünüz tüm soruları kalıcı olarak silmek üzeresiniz. Bu işlem kesinlikle geri alınamaz. Onaylıyor musunuz?',
                confirmText: 'Evet, Hesabımı Sil',
                cancelText: 'İptal Et',
                onConfirm: async () => {
                    try {
                        await deleteDoc(doc(db, "users", currentUser.uid));
                        await deleteUser(currentUser);
                        
                        window.closeProfileModal();
                        window.showModal({ type: 'info', title: 'Hesap Silindi', text: 'Hesabınız ve tüm verileriniz kalıcı olarak silindi. Hoşçakalın!', confirmText: 'Tamam' });
                        setTimeout(() => window.location.reload(), 2000);
                        
                    } catch(error) {
                        console.error(error);
                        if (error.code === 'auth/requires-recent-login') {
                            window.showModal({ type: 'error', title: 'Güvenlik Doğrulaması', text: 'Güvenlik nedeniyle hesabınızı silebilmemiz için yakın zamanda giriş yapmış olmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yaptıktan sonra bu işlemi tekrarlayın.', confirmText: 'Tamam' });
                        } else {
                            window.showModal({ type: 'error', title: 'Hata', text: 'Hesap silinirken bir hata oluştu: ' + error.message, confirmText: 'Tamam' });
                        }
                    }
                }
            });
        }

        // --- CUSTOM MODAL SYSTEM ---

        const legalTexts = {
            'terms': {
                title: 'Kullanım Koşulları',
                content: `
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">1. Hizmetin Kapsamı</h3>
                    <p class="mb-4">TarihApp, KPSS ve benzeri sınavlara hazırlanan öğrencilere yönelik tamamen ücretsiz bir eğitim asistanıdır. Sistemdeki sorular ve denemeler eğitim amacıyla sunulmaktadır. Geliştirici, soruların kesin doğruluğunu taahhüt etmez.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">2. Hesap ve Veri Güvenliği</h3>
                    <p class="mb-4">Uygulamamızı kullanırken oluşturduğunuz hesap bilgileri Google Firebase altyapısı ile şifrelenerek korunmaktadır. Kullanıcı, kendi hesabının güvenliğinden sorumludur.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">3. Kötüye Kullanım</h3>
                    <p class="mb-4">Sistemin işleyişini bozacak, veri trafiğini manipüle edecek her türlü otomasyon aracının (bot vb.) kullanılması yasaktır. Bu tür durumlar tespit edildiğinde hesabınız kalıcı olarak silinebilir.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">4. Değişiklik Hakları</h3>
                    <p>Yönetim, uygulama içerisindeki özellikleri, soru tiplerini veya kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar.</p>
                `
            },
            'privacy': {
                title: 'Gizlilik Politikası',
                content: `
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">1. Toplanan Veriler</h3>
                    <p class="mb-4">Sizlere daha iyi bir deneyim sunabilmek için şu verileri depolarız: E-posta adresiniz, belirlediğiniz kullanıcı adı, çözdüğünüz testlerin istatistikleri, yanlış yaptığınız ve favoriye aldığınız sorular.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">2. Verilerin Kullanımı</h3>
                    <p class="mb-4">Toplanan istatistiksel veriler (çözülen sorular, hatalar vs.) tamamen size özel kişiselleştirilmiş "Yanlışlarım" veya "İstatistikler" ekranlarını oluşturmak için kullanılır. Verileriniz hiçbir şekilde üçüncü şahıs veya reklam şirketleriyle paylaşılmaz, satılmaz.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">3. Çerezler (Cookies) ve Yerel Depolama</h3>
                    <p class="mb-4">Uygulama, "Karanlık Mod/Aydınlık Mod" tercihlerinizi ve aktif oturum bilgilerinizi hatırlamak için tarayıcınızın yerel depolama (Local Storage) özelliğini kullanır. İzleme (Tracking) veya reklam çerezleri kullanılmamaktadır.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">4. KVKK ve Unutulma Hakkı</h3>
                    <p>Kullanıcılar istedikleri zaman "Profil ve Ayarlar" paneli üzerinden hesaplarını ve ilişkili tüm verilerini (yanlışlar, favoriler, çözülen testler) sistemden kalıcı olarak silebilirler. Bu işlem geri alınamaz.</p>
                `
            }
        };

        window.showLegalModal = function(type) {
            const modal = document.getElementById('legal-modal');
            const inner = modal.querySelector('div');
            
            document.getElementById('legal-title').innerHTML = `
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                ${legalTexts[type].title}
            `;
            document.getElementById('legal-content').innerHTML = legalTexts[type].content;
            
            modal.classList.remove('hidden');
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            inner.classList.remove('scale-95');
        };

        window.closeLegalModal = function() {
            const modal = document.getElementById('legal-modal');
            const inner = modal.querySelector('div');
            modal.classList.add('opacity-0');
            inner.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };
        
        window.showModal = function(options) {
            const modal = document.getElementById('custom-modal');
            const iconContainer = document.getElementById('custom-modal-icon');
            const titleEl = document.getElementById('custom-modal-title');
            const textEl = document.getElementById('custom-modal-text');
            const btnContainer = document.getElementById('custom-modal-buttons');
            
            let iconHtml = '';
            if(options.type === 'warning') {
                iconContainer.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 mb-4';
                iconHtml = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
            } else if(options.type === 'success') {
                iconContainer.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 mb-4';
                iconHtml = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
            } else if(options.type === 'error') {
                iconContainer.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 mb-4';
                iconHtml = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            } else {
                iconContainer.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 mb-4';
                iconHtml = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            }
            
            iconContainer.innerHTML = iconHtml;
            titleEl.textContent = options.title;
            textEl.textContent = options.text;
            
            btnContainer.innerHTML = '';
            
            window.closeCustomModal = function() {
                modal.classList.add('opacity-0');
                modal.firstElementChild.classList.add('scale-95');
                modal.firstElementChild.classList.remove('scale-100');
                setTimeout(() => { modal.classList.add('hidden'); }, 300);
            }
            
            if (options.cancelText) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors shadow-sm';
                cancelBtn.textContent = options.cancelText;
                cancelBtn.onclick = window.closeCustomModal;
                btnContainer.appendChild(cancelBtn);
            }
            
            const confirmBtn = document.createElement('button');
            let confirmColor = options.type === 'error' || options.type === 'warning' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
            if(options.type === 'success') confirmColor = 'bg-emerald-600 hover:bg-emerald-700';
            confirmBtn.className = `w-full sm:w-auto px-6 py-2.5 ${confirmColor} text-white font-semibold rounded-lg transition-colors shadow-sm`;
            confirmBtn.textContent = options.confirmText || 'Tamam';
            confirmBtn.onclick = () => {
                window.closeCustomModal();
                if(options.onConfirm) setTimeout(options.onConfirm, 150);
            };
            btnContainer.appendChild(confirmBtn);
            
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
        }

        window.closeAdminPanel = function() {
            document.getElementById('admin-modal').classList.add('hidden');
        }

        window.resetTest = function() {
            if(currentMode === 'MISTAKES') {
                generateMistakeTest();
                return;
            }
            if(currentMode === 'FAVORITES') {
                generateFavoritesTest();
                return;
            }
            if(currentMode === 'RANDOM_27') {
                window.generateRandomTest();
                return;
            }
            
            window.showModal({
                type: 'warning',
                title: 'Testi Sıfırla',
                text: 'Testi sıfırlamak istediğinize emin misiniz? Bu işlem test sonucunuzu tamamen silecektir.',
                confirmText: 'Sıfırla',
                cancelText: 'İptal',
                onConfirm: () => {
                    userData.testProgress[currentTestIndex] = null;
                    saveUserDataCloud();
                    
                    window.showTest(currentTestIndex);
                    renderDropdown();
                }
            });
        }
    