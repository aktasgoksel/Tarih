import { State } from "../state.js";
import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { loadTestsFromFirestore, showLoader, hideLoader } from "../ui/loader.js";
import { stopTimer } from "../features/timer.js";
import { showModal } from "../ui/modal.js";
import { showTest, renderDropdown } from "../features/tests.js";

// --- AUTH & FIREBASE ---
        
export async function login() {
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

export async function register() {
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

export async function sendResetEmail() {
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

export async function loginWithGoogle() {
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

export async function logout() {
    try {
        await signOut(auth);
    } catch(error) {
        console.error(error);
    }
}

export async function checkVerification() {
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

export async function resendVerification() {
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
    if (user) {
        // VERIFICATION CHECK
        if (false) {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('app-screen').classList.add('hidden');
            document.getElementById('verify-screen').classList.remove('hidden');
            document.getElementById('verify-screen').classList.add('flex');
            const vet = document.getElementById('verify-email-text'); if(vet) vet.textContent = `${user.email} adresinize bir doğrulama bağlantısı gönderdik. Devam etmek için lütfen gelen kutunuzu kontrol edin.`;
            return;
        }
        
        // Hide Verification Screen
        document.getElementById('verify-screen').classList.add('hidden');
        document.getElementById('verify-screen').classList.remove('flex');
        
        // Logged in & Verified
        State.setCurrentUser(user);
        document.getElementById('auth-screen').classList.add('hidden');
        showLoader('Yükleniyor, lütfen bekleyin...');
        
        // ADMIN ROLE CHECK
        const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
        if(ADMIN_EMAILS.includes(State.getCurrentUser().email)) {
            document.getElementById('admin-panel-btn').classList.remove('hidden');
        } else {
            document.getElementById('admin-panel-btn').classList.add('hidden');
        }
        
        let displayName = user.displayName || user.email.split('@')[0];
        const wt = document.getElementById('welcome-text'); if(wt) wt.textContent = `Hoş geldin, ${displayName}`;
        const err = document.getElementById('auth-error'); if(err) err.textContent = '';
        
        // Fetch data from Firestore
        try {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    State.setUserData(docSnap.data());
                } else {
                    // New user
                    State.setUserData({ mistakes: [], favorites: [], testProgress: {} });
                    await setDoc(docRef, State.getUserData());
                }
            } catch(e) {
                console.error("Veri çekilemedi, geçici (boş) profille başlandı", e);
                State.setUserData({ mistakes: [], favorites: [], testProgress: {} });
            }
            
            // Only load tests if not already loaded in memory to prevent duplicate requests
            if (State.getTestData().length === 0) {
                await loadTestsFromFirestore();
            }
            
            // Decoupled UI Render Calls
            renderDropdown();
            if (State.getTestData().length > 0) {
                showTest(State.getCurrentTestIndex() || 0);
            }
            
            cleanStaleMistakes();
            updateMistakeBadge();
            updateFavoritesBadge();
        } catch(error) {
            console.error("Giriş sonrası yükleme hatası:", error);
            showModal({
                type: 'error',
                title: 'Yükleme Hatası',
                text: 'Verileriniz yüklenirken bir hata oluştu: ' + error.message + '. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.',
                confirmText: 'Yeniden Dene',
                onConfirm: () => window.location.reload()
            });
        } finally {
            hideLoader();
            document.getElementById('app-screen').classList.remove('hidden');
            document.getElementById('app-screen').classList.add('flex');
        }
        
    } else {
        // Logged out
        stopTimer();
        State.setCurrentUser(null);
        State.setUserData({ mistakes: [], favorites: [], testProgress: {} });
        
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
        const err = document.getElementById('auth-error'); if(err) err.textContent = '';
        window.switchAuth('login');
    }
});

function cleanStaleMistakes() {
    if (!State.getUserData().mistakes) return;
    if (State.getTestData().length === 0) return; // Guard to prevent wiping mistakes if tests haven't loaded!
    const originalLength = State.getUserData().mistakes.length;
    State.getUserData().mistakes = State.getUserData().mistakes.filter(m => {
        return State.getTestData()[m.testIdx] && State.getTestData()[m.testIdx].questions && State.getTestData()[m.testIdx].questions[m.qIdx];
    });
    if (originalLength !== State.getUserData().mistakes.length) {
        saveUserDataCloud();
    }
}

export async function saveUserDataCloud() {
    if(!State.getCurrentUser()) return;
    updateMistakeBadge();
    updateFavoritesBadge();
    
    try {
        await setDoc(doc(db, "users", State.getCurrentUser().uid), State.getUserData());
    } catch(e) {
        console.error("Veritabanına kaydedilemedi:", e);
    }
}

export function updateMistakeBadge() {
    const badge = document.getElementById('mistake-badge');
    const mistakeCount = State.getUserData().mistakes ? State.getUserData().mistakes.length : 0;
    if(badge) badge.textContent = mistakeCount;
    
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

export function updateFavoritesBadge() {
    const badge = document.getElementById('favorite-badge');
    const favCount = State.getUserData().favorites ? State.getUserData().favorites.length : 0;
    if(badge) badge.textContent = favCount;
    
    const btn = document.getElementById('dashboard-favorite-btn');
    if(favCount === 0) {
        btn.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
    } else {
        btn.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
    }
}

export function clearAllMistakes() {
    if(State.getUserData().mistakes && State.getUserData().mistakes.length > 0) {
        showModal({
            type: 'warning',
            title: 'Yanlışları Sıfırla',
            text: 'Tüm yanlış soru kayıtlarınızı sıfırlamak (silmek) istediğinize emin misiniz? Bu işlem geri alınamaz.',
            confirmText: 'Evet, Sıfırla',
            cancelText: 'İptal',
            onConfirm: () => {
                State.getUserData().mistakes = [];
                saveUserDataCloud();
                if(State.getCurrentMode() === 'MISTAKES') {
                    showTest(0);
                }
            }
        });
    }
}

// Expose functions to window for legacy inline calls in HTML
window.login = login;
window.register = register;
window.sendResetEmail = sendResetEmail;
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
window.checkVerification = checkVerification;
window.resendVerification = resendVerification;
window.saveUserDataCloud = saveUserDataCloud;
window.clearAllMistakes = clearAllMistakes;