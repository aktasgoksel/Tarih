import codecs

with codecs.open('index_dev.html', 'r', 'utf-8') as f:
    content = f.read()

admin_html = """
    <!-- ADMIN SCREEN -->
    <div id="admin-screen" class="hidden min-h-screen bg-slate-50 dark:bg-slate-900 flex-col pb-20">
        <header class="bg-indigo-600 dark:bg-indigo-800 text-white p-4 shadow-lg sticky top-0 z-50">
            <div class="max-w-4xl mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Soru Yönetim Paneli
                </h1>
                <button onclick="window.closeAdminPanel()" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Ana Ekrana Dön
                </button>
            </div>
        </header>

        <main class="max-w-4xl mx-auto w-full p-4 mt-6">
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
                <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Yeni Soru Ekle</h2>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Test Seçin veya Yeni Test Adı Yazın</label>
                    <input type="text" id="admin-test-title" placeholder="Örn: Test 63: Çağdaş Türk ve Dünya Tarihi" class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Soru Metni</label>
                    <textarea id="admin-question-text" rows="4" placeholder="Soru metnini buraya yazın..." class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">A Şıkkı</label>
                        <input type="text" id="admin-opt-a" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">B Şıkkı</label>
                        <input type="text" id="admin-opt-b" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">C Şıkkı</label>
                        <input type="text" id="admin-opt-c" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">D Şıkkı</label>
                        <input type="text" id="admin-opt-d" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E Şıkkı</label>
                        <input type="text" id="admin-opt-e" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doğru Cevap</label>
                        <select id="admin-correct-answer" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Çözüm / Açıklama (İsteğe Bağlı)</label>
                        <textarea id="admin-solution" rows="2" class="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"></textarea>
                    </div>
                </div>

                <button onclick="window.saveAdminQuestion()" id="admin-save-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors">
                    Soruyu Veritabanına Kaydet
                </button>
                <div id="admin-feedback" class="mt-4 text-center font-medium hidden"></div>
            </div>
        </main>
    </div>
"""

idx = content.find('</body>')
new_content = content[:idx] + admin_html + '\n' + content[idx:]

with codecs.open('index_dev.html', 'w', 'utf-8') as f:
    f.write(new_content)
