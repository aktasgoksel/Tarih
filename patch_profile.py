import codecs
import re

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Firebase Imports (Add deleteUser and deleteDoc)
old_auth_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";'
new_auth_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";'
content = content.replace(old_auth_imports, new_auth_imports)

old_fs_imports = 'import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";'
new_fs_imports = 'import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";'
content = content.replace(old_fs_imports, new_fs_imports)

# 2. Update Header HTML (Make "Hoş geldin" clickable)
old_header_user = '''                    <div class="flex items-center">
                        <span id="welcome-text" class="truncate">Hoş geldin</span>
                        <span id="user-level" class="hidden ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </div>'''

new_header_user = '''                    <button onclick="window.openProfileModal()" class="flex items-center hover:bg-white/10 px-2 py-1.5 -ml-2 rounded-lg transition-colors group cursor-pointer" title="Profil ve Ayarlar">
                        <svg class="w-5 h-5 mr-1.5 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span id="welcome-text" class="truncate font-semibold">Hoş geldin</span>
                        <span id="user-level" class="hidden ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </button>'''
content = content.replace(old_header_user, new_header_user)

# 3. Add Profile Modal HTML
custom_modal_marker = '    <!-- CUSTOM UI MODAL -->'
profile_modal_html = '''    <!-- PROFILE MODAL -->
    <div id="profile-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity opacity-0">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-95 transition-transform duration-300 border border-gray-200 dark:border-slate-700">
            <div class="p-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/80">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Profil ve Ayarlar
                </h2>
                <button onclick="window.closeProfileModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6">
                <!-- Stats Section -->
                <div class="grid grid-cols-3 gap-3 mb-6">
                    <div class="bg-blue-50 dark:bg-slate-700/50 p-3 rounded-lg text-center border border-blue-100 dark:border-slate-600">
                        <div class="text-xl font-bold text-blue-600 dark:text-blue-400" id="profile-stat-total">0</div>
                        <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Çözülen Soru</div>
                    </div>
                    <div class="bg-emerald-50 dark:bg-slate-700/50 p-3 rounded-lg text-center border border-emerald-100 dark:border-slate-600">
                        <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400" id="profile-stat-correct">0</div>
                        <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Doğru Sayısı</div>
                    </div>
                    <div class="bg-rose-50 dark:bg-slate-700/50 p-3 rounded-lg text-center border border-rose-100 dark:border-slate-600">
                        <div class="text-xl font-bold text-rose-600 dark:text-rose-400" id="profile-stat-wrong">0</div>
                        <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Yanlış Sayısı</div>
                    </div>
                </div>
                
                <!-- Form Section -->
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">E-posta Adresi</label>
                        <input type="text" id="profile-email" disabled class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kullanıcı Adı</label>
                        <div class="flex gap-2">
                            <input type="text" id="profile-username" class="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none transition-colors">
                            <button onclick="window.updateUsername()" id="profile-update-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap">Güncelle</button>
                        </div>
                    </div>
                </div>
                
                <!-- Danger Zone -->
                <div class="border-t border-red-200 dark:border-red-900/30 pt-5 mt-2">
                    <h3 class="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Tehlikeli Bölge</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Hesabınızı ve tüm verilerinizi (yanlışlar, favoriler, istatistikler) kalıcı olarak silmek istiyorsanız bu butonu kullanın. KVKK gereği bu işlem geri alınamaz.</p>
                    <button onclick="window.deleteAccount()" class="w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Hesabımı Tamamen Sil
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- CUSTOM UI MODAL -->'''
content = content.replace(custom_modal_marker, profile_modal_html)

# 4. Add JavaScript Logic
profile_logic = '''        window.openProfileModal = function() {
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
                
                window.showModal({ type: 'success', title: 'Başarılı', text: 'Kullanıcı adınız başarıyla güncellendi.', confirmText: 'Tamam' });
            } catch(e) {
                console.error(e);
                window.showModal({ type: 'error', title: 'Hata', text: 'Kullanıcı adı güncellenirken bir hata oluştu.', confirmText: 'Tamam' });
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

        // --- CUSTOM MODAL SYSTEM ---'''
content = content.replace('        // --- CUSTOM MODAL SYSTEM ---', profile_logic)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Profile and Settings modal successfully implemented!")
