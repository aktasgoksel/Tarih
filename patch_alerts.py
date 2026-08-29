import codecs
import re

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Add Custom Modal HTML
modal_html = '''    <!-- ADMIN PANEL MODAL -->'''

new_modal_html = '''    <!-- CUSTOM UI MODAL -->
    <div id="custom-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity opacity-0">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-95 transition-transform duration-300 border border-gray-200 dark:border-slate-700">
            <div class="p-6 text-center">
                <div id="custom-modal-icon" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4">
                    <!-- Icon injected via JS -->
                </div>
                <h3 id="custom-modal-title" class="text-xl font-bold text-gray-900 dark:text-white mb-2">Başlık</h3>
                <p id="custom-modal-text" class="text-sm text-gray-600 dark:text-gray-400 mb-6">Mesaj detayı buraya gelecek.</p>
                <div id="custom-modal-buttons" class="flex flex-col sm:flex-row gap-3 justify-center">
                    <!-- Buttons injected via JS -->
                </div>
            </div>
        </div>
    </div>

    <!-- ADMIN PANEL MODAL -->'''
content = content.replace(modal_html, new_modal_html)

# 2. Add Custom Modal JS Logic
js_modal_logic = '''        window.closeAdminPanel = function() {'''

new_js_modal_logic = '''        // --- CUSTOM MODAL SYSTEM ---
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

        window.closeAdminPanel = function() {'''
content = content.replace(js_modal_logic, new_js_modal_logic)

# 3. Replace Alerts in Timer
old_timer_alert = '''                if(timeRemaining <= 0) {
                    stopTimer();
                    alert("Süreniz doldu! Test otomatik olarak bitiriliyor.");
                    window.submitCurrentTest(true); 
                }'''
new_timer_alert = '''                if(timeRemaining <= 0) {
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
                }'''
content = content.replace(old_timer_alert, new_timer_alert)

# 4. Replace Alerts in clearAllMistakes
old_clear_mistakes = '''        window.clearAllMistakes = function() {
            if(userData.mistakes.length === 0) return;
            if(confirm("Tüm yanlış soru kayıtlarınızı sıfırlamak (silmek) istediğinize emin misiniz?")) {
                userData.mistakes = [];
                saveUserDataCloud();
                
                document.getElementById('mistake-badge').textContent = '0';
                
                if(currentMode === 'MISTAKES') {
                    window.showTest(currentTestIndex);
                }
            }
        }'''
new_clear_mistakes = '''        window.clearAllMistakes = function() {
            if(userData.mistakes.length === 0) return;
            window.showModal({
                type: 'warning',
                title: 'Kayıtları Sil',
                text: 'Tüm yanlış soru kayıtlarınızı sıfırlamak (silmek) istediğinize emin misiniz? Bu işlem geri alınamaz.',
                confirmText: 'Evet, Sil',
                cancelText: 'İptal',
                onConfirm: () => {
                    userData.mistakes = [];
                    saveUserDataCloud();
                    
                    document.getElementById('mistake-badge').textContent = '0';
                    
                    if(currentMode === 'MISTAKES') {
                        window.showTest(currentTestIndex);
                    }
                }
            });
        }'''
content = content.replace(old_clear_mistakes, new_clear_mistakes)

# 5. Replace alert in evaluateSingleQuestion
old_eval_alert = '''            const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!selectedOption) {
                alert("Lütfen önce bir şık işaretleyin.");
                return;
            }'''
new_eval_alert = '''            const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!selectedOption) {
                window.showModal({ type: 'info', title: 'Uyarı', text: 'Çözümü görmek için lütfen önce bir şık işaretleyin.', confirmText: 'Tamam' });
                return;
            }'''
content = content.replace(old_eval_alert, new_eval_alert)

# 6. Replace confirm in submitCurrentTest
old_submit_confirm = '''        window.submitCurrentTest = function(forceSubmit = false) {
            if(!forceSubmit) {
                let answeredCount = 0;
                for(let i=0; i<currentTestQuestions.length; i++) {
                    const radioName = `question-${i}`;
                    const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                    if(selectedOption) answeredCount++;
                }
                if(answeredCount < currentTestQuestions.length) {
                    if(!confirm(`Henüz ${currentTestQuestions.length - answeredCount} soruyu boş bıraktınız. Testi bitirmek istediğinize emin misiniz?`)) {
                        return;
                    }
                }
            }'''
new_submit_confirm = '''        window.submitCurrentTest = function(forceSubmit = false) {
            if(!forceSubmit) {
                let answeredCount = 0;
                for(let i=0; i<currentTestQuestions.length; i++) {
                    const radioName = `question-${i}`;
                    const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                    if(selectedOption) answeredCount++;
                }
                if(answeredCount < currentTestQuestions.length) {
                    window.showModal({
                        type: 'warning',
                        title: 'Testi Bitir?',
                        text: `Henüz ${currentTestQuestions.length - answeredCount} soruyu boş bıraktınız. Testi bitirmek istediğinize emin misiniz?`,
                        confirmText: 'Evet, Bitir',
                        cancelText: 'Teste Dön',
                        onConfirm: () => {
                            window.submitCurrentTest(true);
                        }
                    });
                    return;
                }
            }'''
content = content.replace(old_submit_confirm, new_submit_confirm)

# 7. Replace alerts in Suggestion
content = content.replace("alert('Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.');", "window.showModal({ type: 'success', title: 'Başarılı', text: 'Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.', confirmText: 'Tamam' });")
content = content.replace("alert('Bir hata oluştu. Lütfen bağlantınızı kontrol edin.');", "window.showModal({ type: 'error', title: 'Hata', text: 'Bir hata oluştu. Lütfen bağlantınızı kontrol edin.', confirmText: 'Tamam' });")

# 8. Replace alerts in admin
content = content.replace('alert("Yetkisiz erişim!");', "window.showModal({ type: 'error', title: 'Hata', text: 'Yetkisiz erişim!', confirmText: 'Tamam' });")

# 9. Replace confirm in resetTest
old_reset_confirm = '''            if(confirm("Testi sıfırlamak istediğinize emin misiniz? Bu işlem test sonucunuzu silecektir.")) {
                userData.testProgress[currentTestIndex] = null;
                saveUserDataCloud();
                
                window.showTest(currentTestIndex);
                renderDropdown();
            }'''
new_reset_confirm = '''            window.showModal({
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
            });'''
content = content.replace(old_reset_confirm, new_reset_confirm)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Professional custom modals implemented successfully!")
