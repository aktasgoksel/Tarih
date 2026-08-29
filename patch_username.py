import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Register formuna "Kullanıcı Adı" input'u ekleme
old_register_form = '''<div id="register-form" class="auth-form hidden-form w-full">
                <h2 class="text-xl font-semibold mb-4 dark:text-white">Yeni Kayıt</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta</label>'''

new_register_form = '''<div id="register-form" class="auth-form hidden-form w-full">
                <h2 class="text-xl font-semibold mb-4 dark:text-white">Yeni Kayıt</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kullanıcı Adı</label>
                        <input type="text" id="register-displayname" onkeypress="window.handleEnter(event, 'register')" class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white outline-none transition-colors shadow-sm" placeholder="Örn: TarihKurdu">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta</label>'''

content = content.replace(old_register_form, new_register_form)


# 2. updateProfile fonksiyonunu importlara ekleme
old_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail }'
new_imports = 'import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile }'
content = content.replace(old_imports, new_imports)


# 3. register fonksiyonunu güncelleme (updateProfile kullanımı)
old_register_func = '''window.register = async function() {
            const email = document.getElementById('register-username').value.trim();
            const pass = document.getElementById('register-password').value;
            const err = document.getElementById('auth-error');
            
            if(!email || !pass) { err.textContent = 'Lütfen e-posta ve şifrenizi girin.'; return; }
            if(pass.length < 6) { err.textContent = 'Şifre en az 6 karakter olmalı.'; return; }
            
            err.textContent = 'Kayıt olunuyor... Lütfen bekleyin.';
            try {
                const userCred = await createUserWithEmailAndPassword(auth, email, pass);
                await sendEmailVerification(userCred.user);'''

new_register_func = '''window.register = async function() {
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
                await sendEmailVerification(userCred.user);'''

content = content.replace(old_register_func, new_register_func)


# 4. Inputları sıfırlama kısmına (logout) displayname'i de ekleme
content = content.replace("document.getElementById('register-username').value = '';", "document.getElementById('register-displayname').value = '';\n                document.getElementById('register-username').value = '';")


with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Kullanici adi (Username) sistemi eklendi!")
