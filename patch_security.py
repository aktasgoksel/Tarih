import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Auth State to check Admin role
old_auth_set = '''                // Logged in & Verified
                currentUser = user;
                document.getElementById('auth-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('flex');'''

new_auth_set = '''                // Logged in & Verified
                currentUser = user;
                document.getElementById('auth-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('flex');
                
                // ADMIN ROLE CHECK
                const ADMIN_EMAILS = ['aktasgoksel@gmail.com', 'gokselaktas@gmail.com'];
                if(ADMIN_EMAILS.includes(currentUser.email)) {
                    document.getElementById('admin-panel-btn').classList.remove('hidden');
                } else {
                    document.getElementById('admin-panel-btn').classList.add('hidden');
                }'''
content = content.replace(old_auth_set, new_auth_set)


# 2. Add Admin Button to Dashboard UI
old_suggestion_btn = '''<!-- Suggestion Button -->
                            <button onclick="window.openSuggestionModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Bize Öneri veya Hata Bildirin">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                Öneri Gönder
                            </button>
                            <!-- Stats Button -->'''

new_suggestion_btn_and_admin = '''<!-- Suggestion Button -->
                            <button onclick="window.openSuggestionModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Bize Öneri veya Hata Bildirin">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                Öneri Gönder
                            </button>
                            <!-- Admin Panel Button (Hidden by default) -->
                            <button id="admin-panel-btn" onclick="window.openAdminPanel()" class="hidden flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors items-center justify-center gap-2 shadow-sm" title="Yönetici Paneli">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Yönetim
                            </button>
                            <!-- Stats Button -->'''
content = content.replace(old_suggestion_btn, new_suggestion_btn_and_admin)

# 3. Remove Easter Egg from submitSuggestion and secure openAdminPanel
old_submit_js = '''            // ADMIN EASTER EGG
            if(text === 'admin1453') {
                window.closeSuggestionModal();
                window.openAdminPanel();
                return;
            }'''
content = content.replace(old_submit_js, '')

# Prevent opening admin panel via browser console if not admin
old_open_admin = '''        window.openAdminPanel = async function() {
            document.getElementById('admin-modal').classList.remove('hidden');'''

new_open_admin = '''        window.openAdminPanel = async function() {
            const ADMIN_EMAILS = ['aktasgoksel@gmail.com', 'gokselaktas@gmail.com'];
            if(!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
                alert("Yetkisiz erişim!");
                return;
            }
            document.getElementById('admin-modal').classList.remove('hidden');'''
content = content.replace(old_open_admin, new_open_admin)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Security patch applied!")
