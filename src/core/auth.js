/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";
import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { loadTestsFromFirestore, showLoader, hideLoader, updateLoaderText } from "../ui/loader.js";
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
        // Oturumu sadece tarayıcı/sekme açıkken geçerli kıl (sayfa kapanınca otomatik çıkış)
        await setPersistence(auth, browserSessionPersistence);
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
    if(pass.length < 6) { err.textContent = 'Åifre en az 6 karakter olmalı.'; return; }
    
    err.textContent = 'Kayıt olunuyor... Lütfen bekleyin.';
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCred.user, { displayName: username });
        try {
            await sendEmailVerification(userCred.user);
            showModal({ type: 'success', title: 'Kayıt Başarılı', text: 'Hesabınız oluşturuldu! E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.', confirmText: 'Harika' });
        } catch(verificationError) {
            console.error("Doğrulama e-postası gönderilemedi: ", verificationError);
            showModal({ type: 'success', title: 'Kayıt Başarılı', text: 'Hesabınız oluşturuldu ancak doğrulama e-postası gönderilemedi. Daha sonra tekrar deneyebilirsiniz.', confirmText: 'Anladım' });
        }

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
    
    err.className = "text-sm text-center font-medium min-h-5 mt-3 text-blue-600 dark:text-blue-400";
    err.textContent = "Bağlantı gönderiliyor...";
    
    try {
        await sendPasswordResetEmail(auth, email);
        err.className = "text-sm text-center font-medium min-h-5 mt-3 text-emerald-600 dark:text-emerald-400";
        err.textContent = "Åifre sıfırlama bağlantısı e-postanıza gönderildi!";
        setTimeout(() => window.switchAuth('login'), 3500);
    } catch(error) {
        err.className = "text-sm text-center font-medium min-h-5 mt-3 text-red-500 dark:text-red-400";
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
    // Her girişte hesap seçim ekranını zorunlu kıl (son hesaba otomatik bağlanmayı engeller)
    provider.setCustomParameters({ prompt: 'select_account' });
    const err = document.getElementById('auth-error');
    err.textContent = 'Google ekranı bekleniyor...';
    try {
        // Oturumu sadece tarayıcı/sekme açıkken geçerli kıl (sayfa kapanınca otomatik çıkış)
        await setPersistence(auth, browserSessionPersistence);
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

let pollingInterval = null;
let resendCooldown = 0;
let cooldownInterval = null;

function startVerificationPolling() {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.reload();
            if (currentUser.emailVerified) {
                closeVerificationBanner();
                showModal({ type: 'success', title: 'Doğrulama Başarılı', text: 'E-posta adresiniz başarıyla doğrulandı! ✓', confirmText: 'Tamam' });
            }
        }
    }, 5000);
}

export function closeVerificationBanner() {
    const banner = document.getElementById('email-verification-banner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('flex', 'sm:flex-row', 'flex-col'); // fallback to remove classes
    }
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}
window.closeVerificationBanner = closeVerificationBanner;

export async function triggerResendVerification() {
    if (resendCooldown > 0) return;
    
    const btn = document.getElementById('resend-verification-btn');
    try {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
            showModal({ type: 'info', title: 'E-posta Gönderildi', text: 'Doğrulama e-postası gönderildi, lütfen gelen kutunuzu kontrol edin.', confirmText: 'Tamam' });
            
            resendCooldown = 60;
            if (btn) btn.classList.add('opacity-50', 'cursor-not-allowed');
            
            cooldownInterval = setInterval(() => {
                resendCooldown--;
                if (resendCooldown > 0) {
                    if (btn) btn.textContent = `${resendCooldown} saniye sonra tekrar gönder`;
                } else {
                    clearInterval(cooldownInterval);
                    if (btn) {
                        btn.textContent = 'Doğrulama e-postasını tekrar gönder';
                        btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                }
            }, 1000);
        }
    } catch (error) {
        if (error.code === 'auth/too-many-requests') {
            showModal({ type: 'error', title: 'Çok Sık Deneme', text: 'Çok sık deneme yapıldı, lütfen birkaç dakika bekleyin.', confirmText: 'Anladım' });
        } else {
            showModal({ type: 'error', title: 'Hata', text: 'E-posta gönderilemedi: ' + error.message, confirmText: 'Kapat' });
        }
    }
}
window.triggerResendVerification = triggerResendVerification;

// AUTH LISTENER
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Email Verification Banner Check
        if (!user.emailVerified) {
            const banner = document.getElementById('email-verification-banner');
            if (banner) {
                banner.classList.remove('hidden');
                banner.classList.add('flex');
                startVerificationPolling();
            }
        } else {
            closeVerificationBanner();
        }
        
        // Logged in
        State.setCurrentUser(user);
        document.getElementById('auth-screen').classList.add('hidden');
        console.time('login-to-ready');
        showLoader('Giriş yapılıyor...');
        
        // ADMIN ROLE CHECK
        const ADMIN_EMAILS = [import.meta.env.VITE_ADMIN_EMAIL];
        const adminBtn = document.getElementById('admin-panel-btn');
        if (adminBtn) {
            if (ADMIN_EMAILS.includes(State.getCurrentUser().email)) {
                adminBtn.classList.remove('hidden');
                adminBtn.classList.add('inline-flex');
            } else {
                adminBtn.classList.add('hidden');
                adminBtn.classList.remove('inline-flex');
            }
        }
        
        let displayName = user.displayName || user.email.split('@')[0];
        const wt = document.getElementById('welcome-text'); if(wt) wt.textContent = `Hoş geldin, ${displayName}`;
        const err = document.getElementById('auth-error'); if(err) err.textContent = '';
        
        // Fetch data from Firestore in parallel
        try {
            const docRef = doc(db, "users", user.uid);
            
            updateLoaderText('Kullanıcı bilgileri doğrulanıyor...');
            const userPromise = getDoc(docRef).catch(e => {
                console.error("Kullanıcı verisi çekilemedi, geçici profil kullanılacak:", e);
                return null;
            });
            
            updateLoaderText('Test verileri yükleniyor...');
            const testsPromise = State.getTestData().length === 0 ? loadTestsFromFirestore() : Promise.resolve(null);
            
            const [docSnap, _] = await Promise.all([userPromise, testsPromise]);
            
            if (docSnap && docSnap.exists()) {
                State.setUserData(docSnap.data());
            } else {
                State.setUserData({ mistakes: [], favorites: [], testProgress: {} });
                if (docSnap !== null) {
                    try {
                        await setDoc(docRef, State.getUserData());
                    } catch(writeErr) {
                        console.error("Yeni kullanıcı veritabanına kaydedilemedi:", writeErr);
                    }
                }
            }
            
            // Decoupled UI Render Calls
            updateLoaderText('Arayüz hazırlanıyor...');
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
            console.timeEnd('login-to-ready');
            hideLoader();
            document.getElementById('app-screen').classList.remove('hidden');
            document.getElementById('app-screen').classList.add('flex');
        }
        
    } else {
        // Logged out
        closeVerificationBanner();
        stopTimer();
        State.setCurrentUser(null);
        State.setUserData({ mistakes: [], favorites: [], testProgress: {} });
        
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

let hasShownSaveWarning = false;

export async function saveUserDataCloud() {
    if(!State.getCurrentUser()) return;
    updateMistakeBadge();
    updateFavoritesBadge();
    
    try {
        await setDoc(doc(db, "users", State.getCurrentUser().uid), State.getUserData());
    } catch(e) {
        console.error("Veritabanına kaydedilemedi:", e);
        if (!hasShownSaveWarning) {
            hasShownSaveWarning = true;
            showModal({
                type: 'warning',
                title: 'Bağlantı Hatası',
                text: 'İlerlemeniz bulut veritabanına kaydedilemedi. İnternet bağlantınızı kontrol edin. İlerlemeniz geçici olarak tarayıcınızda saklanmaya devam edecektir.',
                confirmText: 'Tamam'
            });
            // Reset warning flag after 5 minutes
            setTimeout(() => { hasShownSaveWarning = false; }, 300000);
        }
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

export function switchAuth(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    const errorText = document.getElementById('auth-error');
    
    if (errorText) {
        errorText.textContent = '';
        errorText.className = 'text-sm text-center font-medium min-h-5 mt-3 empty:hidden text-red-500 dark:text-red-400';
    }
    
    if (loginForm) loginForm.classList.add('hidden-form');
    if (registerForm) registerForm.classList.add('hidden-form');
    if (forgotForm) forgotForm.classList.add('hidden-form');
    
    if(type === 'register') {
        if (registerForm) registerForm.classList.remove('hidden-form');
        const usernameInput = document.getElementById('register-displayname');
        if (usernameInput) usernameInput.focus();
    } else if(type === 'forgot') {
        if (forgotForm) forgotForm.classList.remove('hidden-form');
        const emailInput = document.getElementById('forgot-email');
        if (emailInput) emailInput.focus();
    } else {
        if (loginForm) loginForm.classList.remove('hidden-form');
        const loginInput = document.getElementById('login-username');
        if (loginInput) loginInput.focus();
    }
}

export function handleEnter(e, action) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (action === 'login') login();
    else if (action === 'register') register();
    else if (action === 'forgot') sendResetEmail();
}

export function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`;
    } else {
        input.type = "password";
        btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
    }
}

// Expose functions to window for legacy inline calls in HTML
window.login = login;
window.register = register;
window.sendResetEmail = sendResetEmail;
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;

window.clearAllMistakes = clearAllMistakes;
window.switchAuth = switchAuth;
window.togglePassword = togglePassword;
window.handleEnter = handleEnter;



