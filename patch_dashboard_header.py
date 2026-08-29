import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_header_controls = '''                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="window.toggleDarkMode()" class="text-xs bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors" title="Karanlık/Aydınlık Mod">
                            <svg id="theme-icon-app" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                        </button>
                        <button onclick="window.logout()" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors font-medium">Çıkış Yap</button>
                    </div>'''

new_header_controls = '''                    <div class="flex items-center gap-2 shrink-0">
                        <!-- Admin Panel Button -->
                        <button id="admin-panel-btn" onclick="window.openAdminPanel()" class="hidden text-xs bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-400/30 px-2 py-1.5 rounded transition-colors flex items-center gap-1.5" title="Yönetici Paneli">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <span class="hidden sm:inline">Yönetim</span>
                        </button>
                        <!-- Suggestion Button -->
                        <button onclick="window.openSuggestionModal()" class="text-xs bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-100 border border-fuchsia-400/30 px-2 py-1.5 rounded transition-colors flex items-center gap-1.5" title="Bize Öneri veya Hata Bildirin">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                            <span class="hidden sm:inline">Öneri</span>
                        </button>
                        
                        <div class="w-px h-4 bg-white/20 mx-0.5"></div>
                        
                        <!-- Theme & Logout -->
                        <button onclick="window.toggleDarkMode()" class="text-xs bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors" title="Karanlık/Aydınlık Mod">
                            <svg id="theme-icon-app" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                        </button>
                        <button onclick="window.logout()" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors font-medium">Çıkış Yap</button>
                    </div>'''

content = content.replace(old_header_controls, new_header_controls)


old_dashboard_top_row = '''                        <!-- Top Row: Admin & Suggestion -->
                        <div class="flex flex-wrap items-center justify-start md:justify-end gap-2">
                            <button id="admin-panel-btn" onclick="window.openAdminPanel()" class="hidden px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Yönetici Paneli">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Yönetim
                            </button>
                            <button onclick="window.openSuggestionModal()" class="px-4 py-2 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Bize Öneri veya Hata Bildirin">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                Öneri Gönder
                            </button>
                        </div>
                        
                        <!-- Middle Row: Stats & Favorites -->'''

new_dashboard_top_row = '''                        <!-- Primary Row: Stats & Favorites -->'''

content = content.replace(old_dashboard_top_row, new_dashboard_top_row)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Moved Admin and Suggestion buttons to header.")
