import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. SEO and Chart.js
seo_tags = '''    <title>TarihApp - Akıllı KPSS Asistanı</title>
    <!-- SEO Meta Tags -->
    <meta name="description" content="KPSS Tarih akıllı soru bankası. Yanlışlarınızı takip edin, istatistiklerinizi görün ve netlerinizi artırın.">
    <meta property="og:title" content="TarihApp - KPSS Asistanı">
    <meta property="og:description" content="KPSS Tarih akıllı soru bankası. Yanlışlarınızı takip edin, istatistiklerinizi görün ve netlerinizi artırın.">
    <meta property="og:image" content="https://cdn-icons-png.flaticon.com/512/3253/3253112.png">
    <meta property="og:url" content="https://aktasgoksel.github.io/Tarih/">
    <!-- PWA Manifest -->'''
content = content.replace('    <title>TarihApp - Akıllı KPSS Asistanı</title>\n    <!-- PWA Manifest -->', seo_tags)

chart_js = '''    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'''
content = content.replace('    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>', chart_js)


# 2. Stats Button
stats_btn = '''                            <!-- Stats Button -->
                            <button onclick="window.showStatsModal()" class="flex-1 md:flex-none md:w-auto px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                İstatistikler
                            </button>
                            <!-- Favorites Button -->'''
content = content.replace('                            <!-- Favorites Button -->', stats_btn)


# 3. Modal HTML
modal_html = '''        </main>
    </div>
    
    <!-- STATS MODAL -->
    <div id="stats-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity opacity-0 p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform scale-95 transition-transform duration-300">
            <div class="p-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/80">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Konu Analizi ve Başarı Grafiği
                </h2>
                <button onclick="window.closeStatsModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div id="stats-empty" class="hidden text-center py-12">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium">Henüz tamamlanmış bir testiniz bulunmuyor.<br>İstatistiklerinizi görmek için en az 1 testi bitirmelisiniz.</p>
                </div>
                <div id="stats-content" class="flex flex-col md:flex-row gap-8 items-center">
                    <div class="w-full md:w-1/2 flex items-center justify-center relative">
                        <canvas id="categoryChart"></canvas>
                    </div>
                    <div class="w-full md:w-1/2 space-y-4" id="category-details">
                        <!-- Category progress bars injected here -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>'''
content = content.replace('        </main>\n    </div>\n\n    <style>', modal_html)


# 4. JavaScript Logic
js_logic = '''        let myChart = null;

        window.showStatsModal = function() {
            const modal = document.getElementById('stats-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
            
            renderStats();
        }

        window.closeStatsModal = function() {
            const modal = document.getElementById('stats-modal');
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            modal.firstElementChild.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
        
        function getCategoryName(title) {
            if(!title.includes(':')) return "Genel";
            const part = title.split(':')[1];
            return part.split('-')[0].trim();
        }

        function renderStats() {
            let catData = {};
            let hasData = false;
            
            if(userData.testProgress) {
                Object.keys(userData.testProgress).forEach(tIdx => {
                    const prog = userData.testProgress[tIdx];
                    if(prog && prog.finished) {
                        hasData = true;
                        const test = testData[tIdx];
                        const cat = getCategoryName(test.title);
                        if(!catData[cat]) catData[cat] = { correct: 0, total: 0 };
                        catData[cat].correct += prog.score;
                        catData[cat].total += test.questions.length;
                    }
                });
            }
            
            const emptyEl = document.getElementById('stats-empty');
            const contentEl = document.getElementById('stats-content');
            
            if(!hasData) {
                emptyEl.classList.remove('hidden');
                contentEl.classList.add('hidden');
                return;
            }
            
            emptyEl.classList.add('hidden');
            contentEl.classList.remove('hidden');
            
            // Sort categories by total questions solved (descending)
            const labels = Object.keys(catData).sort((a,b) => catData[b].total - catData[a].total);
            const correctData = labels.map(l => catData[l].correct);
            const wrongData = labels.map(l => catData[l].total - catData[l].correct);
            
            // Build progress bars
            const detailsEl = document.getElementById('category-details');
            detailsEl.innerHTML = '<h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">Konu Bazlı Başarı Oranları</h3>';
            
            labels.forEach(l => {
                const pct = Math.round((catData[l].correct / catData[l].total) * 100);
                let colorClass = 'bg-emerald-500';
                if(pct < 50) colorClass = 'bg-rose-500';
                else if(pct < 75) colorClass = 'bg-yellow-400';
                else if(pct < 90) colorClass = 'bg-blue-500';
                
                detailsEl.innerHTML += `
                    <div class="mb-4">
                        <div class="flex justify-between text-xs mb-1 font-bold text-gray-700 dark:text-gray-300">
                            <span class="truncate pr-2">${l}</span>
                            <span class="shrink-0">%${pct} (${catData[l].correct}/${catData[l].total})</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <div class="${colorClass} h-2 rounded-full transition-all" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            });
            
            // Render Chart
            const ctx = document.getElementById('categoryChart').getContext('2d');
            if(myChart) myChart.destroy();
            
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#e2e8f0' : '#475569';
            
            myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doğru Sayısı',
                        data: correctData,
                        backgroundColor: [
                            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#f97316', '#6366f1', '#84cc16'
                        ],
                        borderWidth: isDark ? 2 : 1,
                        borderColor: isDark ? '#1e293b' : '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '65%',
                    plugins: {
                        legend: { 
                            position: 'bottom', 
                            labels: { color: textColor, font: { family: 'Inter', size: 11, weight: '500' }, padding: 15 } 
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const val = context.raw || 0;
                                    const total = catData[label].total;
                                    const pct = Math.round((val / total) * 100);
                                    return ` ${label}: ${val} Doğru (%${pct})`;
                                }
                            }
                        }
                    }
                }
            });
        }

        window.resetTest = function() {'''

content = content.replace('        window.resetTest = function() {', js_logic)


with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("SEO Tags and Chart.js stats implemented!")
