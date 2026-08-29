import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_code = '''        </main>
    </div>
    
    <!-- SUGGESTION MODAL -->'''

new_code = '''        </main>
        
        <!-- FOOTER -->
        <footer class="mt-auto py-6 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-xs">
            <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8">
                <div class="flex items-center gap-2 font-medium">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
                    <span>&copy; 2026 TarihApp - Göksel Aktaş. Tüm hakları saklıdır.</span>
                </div>
                <div class="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 font-medium">
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kullanım Koşulları</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gizlilik Politikası</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Güvenlik</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sistem Durumu</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Topluluk</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Belgeler</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</a>
                    <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Çerezleri Yönet</a>
                    <span class="text-gray-300 dark:text-gray-700 hidden lg:inline">|</span>
                    <span class="text-gray-400 dark:text-gray-600">v1.0.0-stable</span>
                </div>
            </div>
        </footer>
    </div>
    
    <!-- SUGGESTION MODAL -->'''

content = content.replace(old_code, new_code)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Footer added to the bottom of the page.")
