
import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



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
                window.currentUser = user;
                document.getElementById('auth-screen').classList.add('hidden');
                window.showLoader('Verileriniz Firebase\'den indiriliyor, lütfen bekleyin...');

                
                // ADMIN ROLE CHECK
                const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
                if(ADMIN_EMAILS.includes(window.currentUser.email)) {
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
                        window.userData = docSnap.data();
                        if(!window.userData.mistakes) window.userData.mistakes = [];
                        if(!window.userData.favorites) window.userData.favorites = [];
                        if(!window.userData.testProgress) window.userData.testProgress = {};
                    } else {
                        // New user
                        window.userData = { mistakes: [], favorites: [], testProgress: {} };
                        await setDoc(docRef, window.userData);
                    }
                } catch(e) {
                    console.error("Veri çekilemedi, geçici (boş) profille başlandı", e);
                    window.userData = { mistakes: [], favorites: [], testProgress: {} };
                }
                
                await loadTestsFromFirestore();
                
                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();
                window.hideLoader();
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('flex');

                
            } else {
                // Logged out
                stopTimer();
                window.currentUser = null;
                window.userData = { mistakes: [], favorites: [], testProgress: {} };
                
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
            if (!window.userData.mistakes) return;
            const originalLength = window.userData.mistakes.length;
            window.userData.mistakes = window.userData.mistakes.filter(m => {
                return window.testData[m.testIdx] && window.testData[m.testIdx].questions && window.testData[m.testIdx].questions[m.qIdx];
            });
            if (originalLength !== window.userData.mistakes.length) {
                saveUserDataCloud();
            }
        }
        
        async function saveUserDataCloud() {
            if(!window.currentUser) return;
            updateMistakeBadge();
            updateFavoritesBadge();
            
            try {
                await setDoc(doc(db, "users", window.currentUser.uid), window.userData);
            } catch(e) {
                console.error("Veritabanına kaydedilemedi:", e);
            }
        }

        function updateMistakeBadge() {
            const badge = document.getElementById('mistake-badge');
            const mistakeCount = window.userData.mistakes ? window.userData.mistakes.length : 0;
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
            const favCount = window.userData.favorites ? window.userData.favorites.length : 0;
            badge.textContent = favCount;
            
            const btn = document.getElementById('dashboard-favorite-btn');
            if(favCount === 0) {
                btn.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
            } else {
                btn.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
            }
        }

        window.clearAllMistakes = function() {
            if(window.userData.mistakes && window.userData.mistakes.length > 0) {
                if(confirm("Tüm yanlış soru kayıtlarınızı sıfırlamak (silmek) istediğinize emin misiniz?")) {
                    window.userData.mistakes = [];
                    saveUserDataCloud();
                    if(window.currentMode === 'MISTAKES') {
                        window.showTest(0);
                    }
                }
            }
        }

        