import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Fix submitBtn logic in JS
old_submitBtn_logic1 = '''                if (canSubmit) {
                    submitBtn.style.display = 'inline-block';
                    submitBtn.classList.add('flex');
                    submitBtn.classList.remove('hidden');
                } else {
                    submitBtn.style.display = 'none';
                    submitBtn.classList.remove('flex');
                    submitBtn.classList.add('hidden');
                }
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
                submitBtn.classList.remove('flex');
                submitBtn.classList.add('hidden');
            }'''

new_submitBtn_logic1 = '''                if (canSubmit) {
                    submitBtn.classList.remove('hidden');
                    submitBtn.classList.add('flex');
                } else {
                    submitBtn.classList.remove('flex');
                    submitBtn.classList.add('hidden');
                }
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.classList.remove('flex');
                submitBtn.classList.add('hidden');
            }'''

content = content.replace(old_submitBtn_logic1, new_submitBtn_logic1)

# 2. Fix Dropdown Name Logic
old_dropdown_logic = '''                let scoreText = '';
                if(isFinished) {
                    const score = userData.testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${index + 1}. ${test.title}${scoreText}`;
                dropdown.appendChild(opt);'''

new_dropdown_logic = '''                let scoreText = '';
                if(isFinished) {
                    const score = userData.testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${test.title}${scoreText}`;
                dropdown.appendChild(opt);'''

content = content.replace(old_dropdown_logic, new_dropdown_logic)

# 3. Fix Control Panel UI Layout
old_control_panel = '''                    <div class="w-full md:w-1/2 flex flex-col items-end gap-3">
                        <div class="flex flex-wrap justify-end gap-2 w-full md:w-auto">
                            <!-- Suggestion Button -->
                            <button onclick="window.openSuggestionModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg font-bold hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm" title="Bize Öneri veya Hata Bildirin">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                Öneri Gönder
                            </button>
                            <!-- Admin Panel Button (Hidden by default) -->
                            <button id="admin-panel-btn" onclick="window.openAdminPanel()" class="hidden flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors items-center justify-center gap-2 shadow-sm" title="Yönetici Paneli">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Yönetim
                            </button>
                            <!-- Stats Button -->
                            <button onclick="window.showStatsModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                İstatistikler
                            </button>
                            <!-- Favorites Button -->
                            <button onclick="window.showTest('FAVORITES')" id="dashboard-favorite-btn" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                Favoriler <span id="favorite-badge" class="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full ml-1">0</span>
                            </button>
                            <!-- Mistakes Button -->
                            <button onclick="window.showTest('MISTAKES')" id="dashboard-mistake-btn" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>
                                Yanlışlar <span id="mistake-badge" class="bg-rose-600 text-white text-xs px-2.5 py-0.5 rounded-full ml-1">0</span>
                            </button>
                            
                            <button onclick="window.clearAllMistakes()" id="clear-mistakes-btn" class="px-3 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center shadow-sm" title="Tüm Yanlış Kayıtlarını Sıfırla">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                        
                        <label class="flex items-center cursor-pointer mt-2 md:mt-1 self-start md:self-end">
                            <div class="relative">
                                <input type="checkbox" id="instant-feedback" class="sr-only">
                                <div class="block bg-gray-200 dark:bg-slate-600 w-11 h-6 rounded-full transition-colors border border-gray-300 dark:border-slate-500"></div>
                                <div class="dot absolute left-1 top-1 bg-white dark:bg-slate-200 w-4 h-4 rounded-full transition-transform duration-200 shadow-sm"></div>
                            </div>
                            <div class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Anında Çözüm Göster</div>
                        </label>
                    </div>'''

new_control_panel = '''                    <div class="w-full md:w-auto flex flex-col gap-3 md:ml-auto">
                        <!-- Top Row: Admin & Suggestion -->
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
                        
                        <!-- Middle Row: Stats & Favorites -->
                        <div class="flex flex-wrap items-center justify-start md:justify-end gap-2">
                            <button onclick="window.showStatsModal()" class="flex-1 md:flex-none px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                İstatistikler
                            </button>
                            <button onclick="window.showTest('FAVORITES')" id="dashboard-favorite-btn" class="flex-1 md:flex-none px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                Favoriler <span id="favorite-badge" class="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full ml-1">0</span>
                            </button>
                        </div>
                        
                        <!-- Bottom Row: Mistakes & Toggle -->
                        <div class="flex flex-wrap items-center justify-start md:justify-end gap-3">
                            <div class="flex items-center">
                                <button onclick="window.showTest('MISTAKES')" id="dashboard-mistake-btn" class="px-4 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-l-lg font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>
                                    Yanlışlar <span id="mistake-badge" class="bg-rose-600 text-white text-xs px-2.5 py-0.5 rounded-full ml-1">0</span>
                                </button>
                                <button onclick="window.clearAllMistakes()" id="clear-mistakes-btn" class="px-3 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-y border-r border-gray-300 dark:border-slate-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center shadow-sm" title="Tüm Yanlış Kayıtlarını Sıfırla">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                            
                            <label class="flex items-center cursor-pointer md:ml-2">
                                <div class="relative">
                                    <input type="checkbox" id="instant-feedback" class="sr-only">
                                    <div class="block bg-gray-200 dark:bg-slate-600 w-11 h-6 rounded-full transition-colors border border-gray-300 dark:border-slate-500"></div>
                                    <div class="dot absolute left-1 top-1 bg-white dark:bg-slate-200 w-4 h-4 rounded-full transition-transform duration-200 shadow-sm"></div>
                                </div>
                                <div class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Anında Çözüm Göster</div>
                            </label>
                        </div>
                    </div>'''

content = content.replace(old_control_panel, new_control_panel)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("UI flaws fixed successfully!")
