import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Update Footer HTML
old_footer = '''                <div class="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 font-medium">
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
                </div>'''

new_footer = '''                <div class="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 font-medium">
                    <button onclick="window.showLegalModal('terms')" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kullanım Koşulları</button>
                    <button onclick="window.showLegalModal('privacy')" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gizlilik Politikası</button>
                    <button onclick="window.openSuggestionModal()" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</button>
                    <span class="text-gray-300 dark:text-gray-700 hidden lg:inline">|</span>
                    <span class="text-gray-400 dark:text-gray-600">v1.0.0</span>
                </div>'''

content = content.replace(old_footer, new_footer)


# 2. Add Legal Modal HTML
legal_modal_html = '''    <!-- LEGAL MODAL -->
    <div id="legal-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity opacity-0">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-200 dark:border-slate-700 transform scale-95 transition-transform duration-300">
            <div class="p-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/80 shrink-0">
                <h2 id="legal-title" class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Başlık
                </h2>
                <button onclick="window.closeLegalModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div id="legal-content" class="p-6 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <!-- Dynamic content -->
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 flex justify-end shrink-0">
                <button onclick="window.closeLegalModal()" class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors shadow-sm">Kapat</button>
            </div>
        </div>
    </div>

    <!-- CUSTOM UI MODAL -->'''

content = content.replace('    <!-- CUSTOM UI MODAL -->', legal_modal_html)

# 3. Add Legal JS Logic
legal_js = '''
        const legalTexts = {
            'terms': {
                title: 'Kullanım Koşulları',
                content: `
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">1. Hizmetin Kapsamı</h3>
                    <p class="mb-4">TarihApp, KPSS ve benzeri sınavlara hazırlanan öğrencilere yönelik tamamen ücretsiz bir eğitim asistanıdır. Sistemdeki sorular ve denemeler eğitim amacıyla sunulmaktadır. Geliştirici, soruların kesin doğruluğunu taahhüt etmez.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">2. Hesap ve Veri Güvenliği</h3>
                    <p class="mb-4">Uygulamamızı kullanırken oluşturduğunuz hesap bilgileri Google Firebase altyapısı ile şifrelenerek korunmaktadır. Kullanıcı, kendi hesabının güvenliğinden sorumludur.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">3. Kötüye Kullanım</h3>
                    <p class="mb-4">Sistemin işleyişini bozacak, veri trafiğini manipüle edecek her türlü otomasyon aracının (bot vb.) kullanılması yasaktır. Bu tür durumlar tespit edildiğinde hesabınız kalıcı olarak silinebilir.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">4. Değişiklik Hakları</h3>
                    <p>Yönetim, uygulama içerisindeki özellikleri, soru tiplerini veya kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar.</p>
                `
            },
            'privacy': {
                title: 'Gizlilik Politikası',
                content: `
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">1. Toplanan Veriler</h3>
                    <p class="mb-4">Sizlere daha iyi bir deneyim sunabilmek için şu verileri depolarız: E-posta adresiniz, belirlediğiniz kullanıcı adı, çözdüğünüz testlerin istatistikleri, yanlış yaptığınız ve favoriye aldığınız sorular.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">2. Verilerin Kullanımı</h3>
                    <p class="mb-4">Toplanan istatistiksel veriler (çözülen sorular, hatalar vs.) tamamen size özel kişiselleştirilmiş "Yanlışlarım" veya "İstatistikler" ekranlarını oluşturmak için kullanılır. Verileriniz hiçbir şekilde üçüncü şahıs veya reklam şirketleriyle paylaşılmaz, satılmaz.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">3. Çerezler (Cookies) ve Yerel Depolama</h3>
                    <p class="mb-4">Uygulama, "Karanlık Mod/Aydınlık Mod" tercihlerinizi ve aktif oturum bilgilerinizi hatırlamak için tarayıcınızın yerel depolama (Local Storage) özelliğini kullanır. İzleme (Tracking) veya reklam çerezleri kullanılmamaktadır.</p>
                    
                    <h3 class="font-bold text-gray-900 dark:text-white text-base mb-1">4. KVKK ve Unutulma Hakkı</h3>
                    <p>Kullanıcılar istedikleri zaman "Profil ve Ayarlar" paneli üzerinden hesaplarını ve ilişkili tüm verilerini (yanlışlar, favoriler, çözülen testler) sistemden kalıcı olarak silebilirler. Bu işlem geri alınamaz.</p>
                `
            }
        };

        window.showLegalModal = function(type) {
            const modal = document.getElementById('legal-modal');
            const inner = modal.querySelector('div');
            
            document.getElementById('legal-title').innerHTML = `
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                ${legalTexts[type].title}
            `;
            document.getElementById('legal-content').innerHTML = legalTexts[type].content;
            
            modal.classList.remove('hidden');
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            inner.classList.remove('scale-95');
        };

        window.closeLegalModal = function() {
            const modal = document.getElementById('legal-modal');
            const inner = modal.querySelector('div');
            modal.classList.add('opacity-0');
            inner.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };
        
        window.showModal = function(options) {'''

content = content.replace('        window.showModal = function(options) {', legal_js)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Updated footer links and added Legal Modal.")
