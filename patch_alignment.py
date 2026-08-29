import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_header_block = '''            <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-2">
                <!-- Row 1: User & Controls -->
                <div class="flex justify-between items-center text-sm font-medium text-blue-100 dark:text-gray-300">
                    <button onclick="window.openProfileModal()" class="flex items-center hover:bg-white/10 px-2 py-1.5 -ml-2 rounded-lg transition-colors group cursor-pointer" title="Profil ve Ayarlar">
                        <svg class="w-5 h-5 mr-1.5 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span id="welcome-text" class="truncate font-semibold">Hoş geldin</span>
                        <span id="user-level" class="hidden ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </button>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="window.toggleDarkMode()" class="text-xs bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors" title="Karanlık/Aydınlık Mod">
                            <svg id="theme-icon-app" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                        </button>
                        <button onclick="window.logout()" class="text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded transition-colors">Çıkış Yap</button>
                    </div>
                </div>
                <!-- Row 2: Title & Status/Timer -->
                <div class="flex justify-between items-center gap-3">
                    <h1 class="text-lg md:text-xl font-bold text-white truncate flex-1" id="current-test-title">Yükleniyor...</h1>
                    <div class="hidden sm:flex items-center shrink-0 gap-3">
                        <button onclick="window.startTimerManually()" id="start-timer-btn" class="hidden flex items-center bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-3 py-1 text-sm font-bold transition-colors shadow-sm">
                            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                            Süreyi Başlat
                        </button>
                        <div id="timer-container" class="hidden flex items-center bg-black/20 rounded-lg px-3 py-1 border border-white/10">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span id="timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                        </div>
                        <span id="test-status" class="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">Çözülüyor</span>
                    </div>
                </div>
            </div>'''

new_header_block = '''            <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-2 w-full">
                <!-- Row 1: User & Controls -->
                <div class="flex justify-between items-center w-full text-sm font-medium text-blue-100 dark:text-gray-300">
                    <button onclick="window.openProfileModal()" class="flex items-center hover:bg-white/10 px-2 py-1.5 -ml-2 rounded-lg transition-colors group cursor-pointer max-w-[70%]" title="Profil ve Ayarlar">
                        <svg class="w-5 h-5 mr-1.5 shrink-0 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span id="welcome-text" class="truncate font-semibold">Hoş geldin</span>
                        <span id="user-level" class="hidden shrink-0 ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </button>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="window.toggleDarkMode()" class="text-xs bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors" title="Karanlık/Aydınlık Mod">
                            <svg id="theme-icon-app" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                        </button>
                        <button onclick="window.logout()" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors font-medium">Çıkış Yap</button>
                    </div>
                </div>
                <!-- Row 2: Title & Status/Timer -->
                <div class="flex justify-between items-center gap-3 w-full">
                    <h1 class="text-lg md:text-xl font-bold text-white truncate min-w-0 flex-1" id="current-test-title">Yükleniyor...</h1>
                    <div class="hidden sm:flex items-center shrink-0 gap-3">
                        <button onclick="window.startTimerManually()" id="start-timer-btn" class="hidden flex items-center bg-blue-500/80 hover:bg-blue-400 text-white rounded-lg px-3 py-1.5 text-sm font-bold transition-colors shadow-sm border border-white/20">
                            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                            Süreyi Başlat
                        </button>
                        <div id="timer-container" class="hidden flex items-center bg-black/30 rounded-lg px-3 py-1.5 border border-white/20">
                            <svg class="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span id="timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                        </div>
                        <span id="test-status" class="px-3 py-1.5 rounded-full text-sm font-bold bg-yellow-400 text-yellow-900 border border-yellow-500 shadow-sm">Çözülüyor</span>
                    </div>
                </div>
            </div>'''

content = content.replace(old_header_block, new_header_block)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Header alignment fixed!")
