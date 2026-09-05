/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";

let myChart = null;

export function showStatsModal() {
    const modal = document.getElementById('stats-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
    
    renderStats();
}

export function closeStatsModal() {
    const modal = document.getElementById('stats-modal');
    modal.classList.add('opacity-0');
    modal.firstElementChild.classList.add('scale-95');
    modal.firstElementChild.classList.remove('scale-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }
    }, 300);
}

export function getCategoryName(title) {
    if(!title.includes(':')) return "Genel";
    const part = title.split(':')[1];
    return part.split('-')[0].trim();
}

export function renderStats() {
    let catData = {};
    let hasData = false;
    
    if(State.getUserData().testProgress) {
        Object.keys(State.getUserData().testProgress).forEach(tIdx => {
            const prog = State.getUserData().testProgress[tIdx];
            if(prog && prog.finished) {
                const test = State.getTestData()[tIdx];
                if (!test || !test.questions) return;
                hasData = true;
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
                    <span class="truncate pr-2">${window.escapeHTML(l)}</span>
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
    
    // eslint-disable-next-line no-undef
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

// Global exposure for legacy calls
window.showStatsModal = showStatsModal;
window.closeStatsModal = closeStatsModal;
