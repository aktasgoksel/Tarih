/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";

// --- OPTIK FORM (GRID) LOGIC ---
export function renderGrid(totalQ) {
    const container = document.getElementById('grid-container');
    container.classList.remove('hidden');
    
    const grid = document.getElementById('question-grid');
    grid.innerHTML = '';
    
    for(let i=0; i<totalQ; i++) {
        const btn = document.createElement('button');
        btn.id = `grid-btn-${i}`;
        btn.textContent = i + 1;
        btn.className = "w-11 h-11 min-w-11 min-h-11 rounded-lg text-sm font-bold border transition-all flex items-center justify-center focus:outline-none";
        btn.onclick = () => {
            State.setCurrentQuestionIndex(i);
            window.updateUI();
        };
        grid.appendChild(btn);
    }
}

export function updateGridUI() {
    const totalQ = State.getCurrentTestQuestions().length;
    for(let i=0; i<totalQ; i++) {
        const btn = document.getElementById(`grid-btn-${i}`);
        if(!btn) continue;
        
        btn.className = "w-11 h-11 min-w-11 min-h-11 rounded-lg text-sm font-bold border transition-all flex items-center justify-center focus:outline-none cursor-pointer ";
        
        const isAnswered = document.querySelector(`input[name="question-${i}"]:checked`);
        
        if (i === State.getCurrentQuestionIndex()) {
            btn.className += ' border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 ring-2 ring-blue-300 dark:ring-blue-700';
        } else if (isAnswered) {
            btn.className += ' border-gray-300 bg-gray-200 text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 opacity-80';
        } else {
            btn.className += ' border-gray-200 bg-white text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700';
        }
    }
}

window.updateGridUI = updateGridUI;


