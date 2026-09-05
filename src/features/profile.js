/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";
import { db } from "../firebase.js";
import { deleteUser, updateEmail, updateProfile } from "firebase/auth";
import { doc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { showModal } from "../ui/modal.js";

export function openSuggestionModal() {
    document.getElementById('suggestion-modal').classList.remove('hidden');
}
export function closeSuggestionModal() {
    document.getElementById('suggestion-modal').classList.add('hidden');
    document.getElementById('suggestion-text').value = '';
}

export async function submitSuggestion() {
    const text = document.getElementById('suggestion-text').value.trim();
    if(!text) return;
    
    try {
        const btn = document.getElementById('submit-suggestion-btn');
        btn.textContent = 'Gönderiliyor...';
        btn.disabled = true;
        
        await addDoc(collection(db, 'suggestions'), {
            uid: State.getCurrentUser().uid,
            displayName: State.getCurrentUser().displayName || State.getCurrentUser().email.split('@')[0],
            email: State.getCurrentUser().email,
            text: text,
            timestamp: new Date().toISOString()
        });
        
        showModal({ type: 'success', title: 'Başarılı', text: 'Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.', confirmText: 'Tamam' });
        window.closeSuggestionModal();
        btn.textContent = 'Gönder';
        btn.disabled = false;
    } catch (e) {
        console.error(e);
        let errorMsg = 'Bir hata oluştu. Lütfen bağlantınızı kontrol edin.';
        if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) {
            errorMsg = 'Veritabanı erişim yetkisi reddedildi. Firestore kurallarınızda "suggestions" koleksiyonuna yazma izni verildiğinden emin olun.';
        } else if (e.message) {
            errorMsg = `Hata detayı: ${e.message}`;
        }
        showModal({ type: 'error', title: 'Hata', text: errorMsg, confirmText: 'Tamam' });
        document.getElementById('submit-suggestion-btn').textContent = 'Tekrar Dene';
        document.getElementById('submit-suggestion-btn').disabled = false;
    }
}

export function openProfileModal() {
    if(!State.getCurrentUser()) return;
    const modal = document.getElementById('profile-modal');
    
    document.getElementById('profile-email').value = State.getCurrentUser().email;
    document.getElementById('profile-username').value = State.getCurrentUser().displayName || State.getCurrentUser().email.split('@')[0];
    
    let totalQ = 0;
    let correctQ = 0;
    if(State.getUserData().testProgress) {
        Object.keys(State.getUserData().testProgress).forEach(tIdx => {
            const prog = State.getUserData().testProgress[tIdx];
            if(prog && prog.finished) {
                const test = State.getTestData()[tIdx];
                if (!test || !test.questions) return;
                totalQ += test.questions.length;
                correctQ += prog.score;
            }
        });
    }
    
    const pst = document.getElementById('profile-stat-total'); if(pst) pst.textContent = totalQ;
    const psc = document.getElementById('profile-stat-correct'); if(psc) psc.textContent = correctQ;
    const psw = document.getElementById('profile-stat-wrong'); if(psw) psw.textContent = totalQ - correctQ;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
}

export function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    modal.classList.add('opacity-0');
    modal.firstElementChild.classList.add('scale-95');
    modal.firstElementChild.classList.remove('scale-100');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

export async function updateUsername() {
    const newName = document.getElementById('profile-username').value.trim();
    if(!newName) return;
    
    const btn = document.getElementById('profile-update-btn');
    btn.textContent = '...';
    btn.disabled = true;
    
    try {
        await updateProfile(State.getCurrentUser(), { displayName: newName });
        document.getElementById('welcome-text').textContent = `Hoş geldin, ${newName}`;
        
        showModal({ type: 'success', title: 'İşlem Başarılı', text: 'Kullanıcı adınız başarıyla güncellenmiştir.', confirmText: 'Tamam' });
    } catch(e) {
        console.error(e);
        showModal({ type: 'error', title: 'Hata', text: 'Kullanıcı adı güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
    }
    btn.textContent = 'Güncelle';
    btn.disabled = false;
}

export async function updateEmailAddress() {
    const newEmail = document.getElementById('profile-email').value.trim();
    if(!newEmail || newEmail === State.getCurrentUser().email) return;
    
    const btn = document.getElementById('profile-email-btn');
    btn.textContent = '...';
    btn.disabled = true;
    
    try {
        await updateEmail(State.getCurrentUser(), newEmail);
        showModal({ type: 'success', title: 'İşlem Başarılı', text: 'E-posta adresiniz başarıyla güncellenmiştir. Hesabınıza artık yeni e-posta adresinizle giriş yapabilirsiniz.', confirmText: 'Tamam' });
    } catch(error) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
            showModal({ type: 'error', title: 'Doğrulama Gerekiyor', text: 'Güvenlik prosedürleri gereği e-posta adresinizi değiştirmeden önce sistemden çıkış yapıp tekrar giriş yapmanız gerekmektedir.', confirmText: 'Anladım' });
        } else if (error.code === 'auth/email-already-in-use') {
            showModal({ type: 'error', title: 'Hata', text: 'Girdiğiniz e-posta adresi başka bir hesaba aittir. Lütfen farklı bir adres deneyin.', confirmText: 'Kapat' });
        } else if (error.code === 'auth/invalid-email') {
            showModal({ type: 'error', title: 'Hata', text: 'Geçersiz bir e-posta formatı girdiniz.', confirmText: 'Kapat' });
        } else {
            showModal({ type: 'error', title: 'Hata', text: 'E-posta adresi güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
        }
    }
    btn.textContent = 'Güncelle';
    btn.disabled = false;
}

export function deleteAccount() {
    showModal({
        type: 'warning',
        title: 'Dikkat!',
        text: 'Hesabınızı ve çözdüğünüz tüm soruları kalıcı olarak silmek üzeresiniz. Bu işlem kesinlikle geri alınamaz. Onaylıyor musunuz?',
        confirmText: 'Evet, Hesabımı Sil',
        cancelText: 'İptal Et',
        onConfirm: async () => {
            try {
                await deleteDoc(doc(db, "users", State.getCurrentUser().uid));
                await deleteUser(State.getCurrentUser());
                
                window.closeProfileModal();
                showModal({ type: 'info', title: 'Hesap Silindi', text: 'Hesabınız ve tüm verileriniz kalıcı olarak silindi. Hoşçakalın!', confirmText: 'Tamam' });
                setTimeout(() => window.location.reload(), 2000);
                
            } catch(error) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                    showModal({ type: 'error', title: 'Güvenlik Doğrulaması', text: 'Güvenlik nedeniyle hesabınızı silebilmemiz için yakın zamanda giriş yapmış olmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yaptıktan sonra bu işlemi tekrarlayın.', confirmText: 'Tamam' });
                } else {
                    showModal({ type: 'error', title: 'Hata', text: 'Hesap silinirken bir hata oluştu: ' + error.message, confirmText: 'Tamam' });
                }
            }
        }
    });
}

// Global exposure for legacy calls
window.openSuggestionModal = openSuggestionModal;
window.closeSuggestionModal = closeSuggestionModal;
window.submitSuggestion = submitSuggestion;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.updateUsername = updateUsername;
window.updateEmailAddress = updateEmailAddress;
window.deleteAccount = deleteAccount;
