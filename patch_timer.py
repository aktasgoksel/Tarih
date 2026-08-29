import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Profile Button and Remove "Çözülüyor"
old_header_start = '''                <div class="flex justify-between items-center w-full text-sm font-medium text-blue-100 dark:text-gray-300">
                    <button onclick="window.openProfileModal()" class="flex items-center hover:bg-white/10 px-2 py-1.5 -ml-2 rounded-lg transition-colors group cursor-pointer max-w-[70%]" title="Profil ve Ayarlar">
                        <svg class="w-5 h-5 mr-1.5 shrink-0 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span id="welcome-text" class="truncate font-semibold">Hoş geldin</span>
                        <span id="user-level" class="hidden shrink-0 ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </button>'''
new_header_start = '''                <div class="flex justify-between items-center w-full text-sm font-medium text-blue-100 dark:text-gray-300">
                    <button onclick="window.openProfileModal()" class="flex items-center bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-lg transition-colors group cursor-pointer max-w-[70%] shadow-sm" title="Profil ve Ayarlar">
                        <svg class="w-5 h-5 mr-1.5 shrink-0 text-blue-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span id="welcome-text" class="truncate font-semibold text-white">Hoş geldin</span>
                        <span id="user-level" class="hidden shrink-0 ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>
                    </button>'''
content = content.replace(old_header_start, new_header_start)

old_desktop_timer = '''                        <div id="timer-container" class="hidden flex items-center bg-black/30 rounded-lg px-3 py-1.5 border border-white/20">
                            <svg class="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span id="timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                        </div>
                        <span id="test-status" class="px-3 py-1.5 rounded-full text-sm font-bold bg-yellow-400 text-yellow-900 border border-yellow-500 shadow-sm">Çözülüyor</span>
                    </div>'''
new_desktop_timer = '''                        <div id="timer-container" class="hidden flex items-center bg-black/30 rounded-lg border border-white/20 overflow-hidden">
                            <div class="flex items-center px-3 py-1.5 border-r border-white/20">
                                <svg class="w-4 h-4 mr-1.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span id="timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                            </div>
                            <button onclick="window.pauseTimer()" class="timer-pause-btn px-2.5 py-1.5 hover:bg-white/10 hover:text-yellow-400 transition-colors" title="Durdur/Devam Et">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                            </button>
                            <button onclick="window.resetTimerManually()" class="px-2.5 py-1.5 hover:bg-white/10 hover:text-red-400 transition-colors" title="Sıfırla">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                    </div>'''
content = content.replace(old_desktop_timer, new_desktop_timer)

old_mobile_timer = '''                <div id="mobile-timer-container" class="hidden flex items-center text-white">
                    <svg class="w-4 h-4 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span id="mobile-timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                </div>'''
new_mobile_timer = '''                <div id="mobile-timer-container" class="hidden flex items-center bg-black/30 rounded-lg border border-white/20 overflow-hidden text-white">
                    <div class="flex items-center px-3 py-1.5 border-r border-white/20">
                        <svg class="w-4 h-4 mr-1.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span id="mobile-timer-text" class="text-sm font-bold font-mono tracking-wider">24:00</span>
                    </div>
                    <button onclick="window.pauseTimer()" class="timer-pause-btn px-3 py-1.5 hover:bg-white/10 hover:text-yellow-400 transition-colors" title="Durdur/Devam Et">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    </button>
                    <button onclick="window.resetTimerManually()" class="px-3 py-1.5 hover:bg-white/10 hover:text-red-400 transition-colors" title="Sıfırla">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>'''
content = content.replace(old_mobile_timer, new_mobile_timer)


# 2. Update Timer JS Logic
old_timer_logic = '''        // --- TIMER LOGIC ---
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
                    window.showModal({
                        type: 'warning',
                        title: 'Süre Doldu!',
                        text: 'Test süreniz sona erdi. Test otomatik olarak bitiriliyor.',
                        confirmText: 'Sonucu Gör',
                        onConfirm: () => {
                            window.submitCurrentTest(true);
                        }
                    });
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
        }'''

new_timer_logic = '''        // --- TIMER LOGIC ---
        let isTimerRunning = false;
        let isTimerPaused = false;
        let testTotalQuestionsForTimer = 0;
        
        function prepareTimer(totalQuestions) {
            stopTimer();
            testTotalQuestionsForTimer = totalQuestions;
            timeRemaining = totalQuestions * 60; // 1 min per question
            updateTimerUI();
            
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
            
            isTimerPaused = false;
            updatePauseIcons();
            
            document.getElementById('start-timer-btn').classList.add('hidden');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
            
            document.getElementById('timer-container').classList.remove('hidden');
            document.getElementById('timer-container').classList.add('flex');
            document.getElementById('mobile-timer-container').classList.remove('hidden');
            document.getElementById('mobile-timer-container').classList.add('flex');
            
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if(!isTimerPaused) {
                    timeRemaining--;
                    updateTimerUI();
                    if(timeRemaining <= 0) {
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
                    }
                }
            }, 1000);
        }
        
        window.pauseTimer = function() {
            isTimerPaused = !isTimerPaused;
            updatePauseIcons();
        }
        
        function updatePauseIcons() {
            const btns = document.querySelectorAll('.timer-pause-btn');
            const playIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`;
            const pauseIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
            
            btns.forEach(btn => {
                btn.innerHTML = isTimerPaused ? playIcon : pauseIcon;
                if(isTimerPaused) {
                    btn.classList.add('text-yellow-400');
                    btn.classList.add('animate-pulse');
                } else {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.remove('animate-pulse');
                }
            });
        }
        
        window.resetTimerManually = function() {
            stopTimer();
            prepareTimer(testTotalQuestionsForTimer);
        }

        function stopTimer() {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            document.getElementById('timer-container').classList.add('hidden');
            document.getElementById('timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn').classList.add('hidden');
            
            document.getElementById('mobile-timer-bar').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.add('hidden');
            document.getElementById('mobile-timer-container').classList.remove('flex');
            document.getElementById('start-timer-btn-mobile').classList.add('hidden');
        }'''
content = content.replace(old_timer_logic, new_timer_logic)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Timer controls added and profile button styled!")
