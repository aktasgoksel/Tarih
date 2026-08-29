import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Firestore Imports
old_imports = 'import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";'
new_imports = 'import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";'
content = content.replace(old_imports, new_imports)

# 2. Add Button to Dashboard
old_stats_btn = '<!-- Stats Button -->'
new_suggestion_btn = '''<!-- Suggestion Button -->
                            <button onclick="window.openSuggestionModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Bize Öneri veya Hata Bildirin">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                Öneri Gönder
                            </button>
                            <!-- Stats Button -->'''
content = content.replace(old_stats_btn, new_suggestion_btn)


# 3. Add Modals HTML
stats_modal_marker = '<!-- STATS MODAL -->'
modals_html = '''<!-- SUGGESTION MODAL -->
    <div id="suggestion-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700">
            <div class="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-fuchsia-50 dark:bg-fuchsia-900/20">
                <h2 class="text-lg font-bold text-fuchsia-800 dark:text-fuchsia-300 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Uygulama İçin Öneriniz
                </h2>
                <button onclick="window.closeSuggestionModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div class="p-5">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">TarihApp'i geliştirmemiz için fikirlerinizi veya bulduğunuz hataları bizimle paylaşın.</p>
                <textarea id="suggestion-text" rows="4" class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none" placeholder="Harika fikirlerinizi buraya yazabilirsiniz..."></textarea>
                <button id="submit-suggestion-btn" onclick="window.submitSuggestion()" class="mt-4 w-full bg-fuchsia-600 text-white font-bold py-2.5 rounded-lg hover:bg-fuchsia-700 transition-colors shadow-sm">Gönder</button>
            </div>
        </div>
    </div>

    <!-- ADMIN PANEL MODAL -->
    <div id="admin-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border-2 border-red-500">
            <div class="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-red-50 dark:bg-red-900/30">
                <h2 class="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Yönetici Paneli - Gelen Öneriler
                </h2>
                <button onclick="window.closeAdminPanel()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div class="p-5 overflow-y-auto flex-1 custom-scrollbar bg-slate-50 dark:bg-slate-900" id="admin-suggestions-list">
                <!-- Suggestions injected here -->
            </div>
        </div>
    </div>

    <!-- STATS MODAL -->'''
content = content.replace(stats_modal_marker, modals_html)

# 4. Add JavaScript Logic
js_logic = '''        window.openSuggestionModal = function() {
            document.getElementById('suggestion-modal').classList.remove('hidden');
        }
        window.closeSuggestionModal = function() {
            document.getElementById('suggestion-modal').classList.add('hidden');
            document.getElementById('suggestion-text').value = '';
        }
        
        window.submitSuggestion = async function() {
            const text = document.getElementById('suggestion-text').value.trim();
            if(!text) return;
            
            // ADMIN EASTER EGG
            if(text === 'admin1453') {
                window.closeSuggestionModal();
                window.openAdminPanel();
                return;
            }
            
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
                
                alert('Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.');
                window.closeSuggestionModal();
                btn.textContent = 'Gönder';
                btn.disabled = false;
            } catch (e) {
                console.error(e);
                alert('Bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
                document.getElementById('submit-suggestion-btn').textContent = 'Tekrar Dene';
                document.getElementById('submit-suggestion-btn').disabled = false;
            }
        }

        window.openAdminPanel = async function() {
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

        window.closeAdminPanel = function() {
            document.getElementById('admin-modal').classList.add('hidden');
        }

        window.resetTest = function() {'''

content = content.replace('        window.resetTest = function() {', js_logic)


with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Suggestion button and Admin Panel successfully implemented!")
