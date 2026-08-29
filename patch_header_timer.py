import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Fix the Header HTML Layout
old_header = '''        <header class="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-slate-800 dark:to-slate-900 shadow-md sticky top-0 z-20 text-white transition-colors duration-200 border-b border-transparent dark:border-slate-700">
            <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-blue-100 dark:text-gray-300 mb-1 flex justify-between items-center gap-2">
                        <div class="flex items-center">
                            <span id="welcome-text" class="truncate">Hoş geldin</span>
                            <span id="user-level" class="hidden ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button onclick="window.toggleDarkMode()" class="text-xs bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors" title="Karanlık/Aydınlık Mod">
                                <svg id="theme-icon-app" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                            </button>
                            <button onclick="window.logout()" class="text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded transition-colors">Çıkış Yap</button>
                        </div>
                    </div>
                    <h1 class="text-lg md:text-xl font-bold text-white truncate" id="current-test-title">Yükleniyor...</h1>
                </div>
                <div class="hidden sm:flex items-center shrink-0 gap-3">
                    <div id="timer-container" class="hidden flex items-center bg-black/20 rounded-lg px-3 py-1 border border-white/10">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span id="timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                    </div>
                    <span id="test-status" class="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">Çözülüyor</span>
                </div>
            </div>
            
            <div id="mobile-timer-container" class="sm:hidden flex items-center justify-center bg-black/20 py-1.5 border-t border-white/10 hidden">
                <svg class="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span id="mobile-timer-text" class="text-sm font-bold font-mono tracking-wider text-white">24:00</span>
            </div>
        </header>'''

new_header = '''        <header class="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-slate-800 dark:to-slate-900 shadow-md sticky top-0 z-20 text-white transition-colors duration-200 border-b border-transparent dark:border-slate-700">
            <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-2">
                <!-- Row 1: User & Controls -->
                <div class="flex justify-between items-center text-sm font-medium text-blue-100 dark:text-gray-300">
                    <div class="flex items-center">
                        <span id="welcome-text" class="truncate">Hoş geldin</span>
                        <span id="user-level" class="hidden ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </div>
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
            </div>
            
            <div id="mobile-timer-bar" class="sm:hidden flex items-center justify-center bg-black/20 py-2 border-t border-white/10 hidden">
                <button onclick="window.startTimerManually()" id="start-timer-btn-mobile" class="hidden flex items-center bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-4 py-1 text-sm font-bold transition-colors shadow-sm">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                    Süreyi Başlat
                </button>
                <div id="mobile-timer-container" class="hidden flex items-center text-white">
                    <svg class="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span id="mobile-timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                </div>
            </div>
        </header>'''

content = content.replace(old_header, new_header)

# 2. Timer JS logic replace
old_timer_logic = '''        // --- TIMER LOGIC ---
        function startTimer(totalQuestions) {
            stopTimer();
            document.getElementById('timer-container').classList.remove('hidden');
            document.getElementById('timer-container').classList.add('flex');
            document.getElementById('mobile-timer-container').classList.remove('hidden');
            
            timeRemaining = totalQuestions * 60; // 1 min per question
            updateTimerUI();
            
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerUI();
                if(timeRemaining <= 0) {
                    stopTimer();
                    alert("Süreniz doldu! Test otomatik olarak bitiriliyor.");
                    window.submitCurrentTest(true); 
                }
            }, 1000);
        }

        function stopTimer() {
            clearInterval(timerInterval);
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('mobile-timer-container').classList.add('hidden');
        }

        function updateTimerUI() {'''

new_timer_logic = '''        // --- TIMER LOGIC ---
        let isTimerRunning = false;
        
        function prepareTimer(totalQuestions) {
            stopTimer();
            timeRemaining = totalQuestions * 60; // 1 min per question
            updateTimerUI();
            
            // Show start button, hide timer
            document.getElementById('start-timer-btn').classList.remove('hidden');
            document.getElementById('start-timer-btn-mobile').classList.remove('hidden');
            document.getElementById('mobile-timer-bar').classList.remove('hidden');
            
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
        }
        
        window.startTimerManually = function() {
            if(isTimerRunning) return;
            
            document.getElementById('start-timer-btn').classList.add('hidden');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
            
            document.getElementById('timer-container').classList.remove('hidden');
            document.getElementById('timer-container').classList.add('flex');
            document.getElementById('mobile-timer-container').classList.remove('hidden');
            document.getElementById('mobile-timer-container').classList.add('flex');
            
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerUI();
                if(timeRemaining <= 0) {
                    stopTimer();
                    alert("Süreniz doldu! Test otomatik olarak bitiriliyor.");
                    window.submitCurrentTest(true); 
                }
            }, 1000);
        }

        function stopTimer() {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            // Hide everything timer related when completely stopped
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn').classList.add('hidden');
            
            document.getElementById('mobile-timer-bar').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
        }

        function updateTimerUI() {'''

content = content.replace(old_timer_logic, new_timer_logic)

# 3. Replace `startTimer(` calls with `prepareTimer(`
content = content.replace('startTimer(currentTestQuestions.length);', 'prepareTimer(currentTestQuestions.length);')

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Header layout fixed and manual timer button added!")
