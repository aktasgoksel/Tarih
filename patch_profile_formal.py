import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Firebase Imports (Add updateEmail)
old_auth_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";'
new_auth_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";'
content = content.replace(old_auth_imports, new_auth_imports)


# 2. Update Profile Modal HTML
old_profile_form = '''                <!-- Form Section -->
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
                </div>'''

new_profile_form = '''                <!-- Form Section -->
                <div class="space-y-5 mb-8">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">E-posta Adresi</label>
                        <div class="flex gap-3">
                            <input type="email" id="profile-email" class="flex-1 h-11 px-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none transition-colors text-sm">
                            <button onclick="window.updateEmailAddress()" id="profile-email-btn" class="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap text-sm flex items-center justify-center">Güncelle</button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kullanıcı Adı</label>
                        <div class="flex gap-3">
                            <input type="text" id="profile-username" class="flex-1 h-11 px-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none transition-colors text-sm">
                            <button onclick="window.updateUsername()" id="profile-update-btn" class="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap text-sm flex items-center justify-center">Güncelle</button>
                        </div>
                    </div>
                </div>
                
                <!-- Account Management -->
                <div class="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
                    <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Hesap Yönetimi</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">Hesabınızı ve size ait tüm kullanım verilerini kalıcı olarak sistemden kaldırmak istiyorsanız aşağıdaki butonu kullanabilirsiniz. Bu işlem KVKK gereği geri alınamaz.</p>
                    <button onclick="window.deleteAccount()" class="w-full h-11 bg-white hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800/50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Hesabımı Kalıcı Olarak Sil
                    </button>
                </div>'''
content = content.replace(old_profile_form, new_profile_form)


# 3. Add updateEmail JS logic
old_update_username_js = '''        window.updateUsername = async function() {
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
        }'''

new_update_logic = '''        window.updateUsername = async function() {
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
        }'''

content = content.replace(old_update_username_js, new_update_logic)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Profile logic made formal and email update added!")
