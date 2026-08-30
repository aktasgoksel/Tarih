import { State } from "../state.js";
import { showTest, renderDropdown, generateRandomTest, generateMistakeTest, generateFavoritesTest } from "../features/tests.js";
import { saveUserDataCloud } from "../core/auth.js";

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

export function showLegalModal(type) {
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
}

export function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    const inner = modal.querySelector('div');
    modal.classList.add('opacity-0');
    inner.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

export function showModal(options) {
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
    
    const closeCustomModal = function() {
        modal.classList.add('opacity-0');
        modal.firstElementChild.classList.add('scale-95');
        modal.firstElementChild.classList.remove('scale-100');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    };
    
    if (options.cancelText) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors shadow-sm';
        cancelBtn.textContent = options.cancelText;
        cancelBtn.onclick = closeCustomModal;
        btnContainer.appendChild(cancelBtn);
    }
    
    const confirmBtn = document.createElement('button');
    let confirmColor = options.type === 'error' || options.type === 'warning' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
    if(options.type === 'success') confirmColor = 'bg-emerald-600 hover:bg-emerald-700';
    confirmBtn.className = `w-full sm:w-auto px-6 py-2.5 ${confirmColor} text-white font-semibold rounded-lg transition-colors shadow-sm`;
    confirmBtn.textContent = options.confirmText || 'Tamam';
    confirmBtn.onclick = () => {
        closeCustomModal();
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

export function resetTest() {
    if(State.getCurrentMode() === 'MISTAKES') {
        generateMistakeTest();
        return;
    }
    if(State.getCurrentMode() === 'FAVORITES') {
        generateFavoritesTest();
        return;
    }
    if(State.getCurrentMode() === 'RANDOM_27') {
        generateRandomTest();
        return;
    }
    
    showModal({
        type: 'warning',
        title: 'Testi Sıfırla',
        text: 'Testi sıfırlamak istediğinize emin misiniz? Bu işlem test sonucunuzu tamamen silecektir.',
        confirmText: 'Sıfırla',
        cancelText: 'İptal',
        onConfirm: () => {
            State.getUserData().testProgress[State.getCurrentTestIndex()] = null;
            saveUserDataCloud();
            
            showTest(State.getCurrentTestIndex());
            renderDropdown();
        }
    });
}

// Expose functions to window for legacy inline calls in HTML
window.showLegalModal = showLegalModal;
window.closeLegalModal = closeLegalModal;
window.showModal = showModal;
window.resetTest = resetTest;