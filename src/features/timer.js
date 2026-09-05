/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";
import { showModal } from "../ui/modal.js";
import { submitCurrentTest } from "./tests.js";

export function prepareTimer(totalQuestions) {
    window.stopTimer();
    State.setTestTotalQuestionsForTimer(totalQuestions);
    State.setTimeRemaining(totalQuestions * 60); // 1 min per question
    updateTimerUI();
    
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.classList.remove('hidden');
        startBtn.classList.add('flex');
    }
    const stbm2 = document.getElementById('start-timer-btn-mobile');
    if (stbm2) {
        stbm2.classList.remove('hidden');
        stbm2.classList.add('flex');
    }
    const mobileBar = document.getElementById('mobile-timer-bar');
    if (mobileBar) {
        mobileBar.classList.remove('hidden');
        mobileBar.classList.add('flex');
    }
    
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        timerContainer.classList.add('hidden');
        timerContainer.classList.remove('flex');
    }
    const mobileTimer = document.getElementById('mobile-timer-container');
    if (mobileTimer) {
        mobileTimer.classList.add('hidden');
        mobileTimer.classList.remove('flex');
    }
}

export function startTimerManually() {
    if(State.getIsTimerRunning()) return;
    
    State.setIsTimerPaused(false);
    updatePauseIcons();
    
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.classList.add('hidden');
        startBtn.classList.remove('flex');
    }
    const stbm = document.getElementById('start-timer-btn-mobile');
    if (stbm) {
        stbm.classList.add('hidden');
        stbm.classList.remove('flex');
    }
    
    document.getElementById('timer-container').classList.remove('hidden');
    document.getElementById('timer-container').classList.add('flex');
    document.getElementById('mobile-timer-container').classList.remove('hidden');
    document.getElementById('mobile-timer-container').classList.add('flex');
    
    State.setIsTimerRunning(true);
    State.setTimerInterval(setInterval(() => {
        if(!State.getIsTimerPaused()) {
            State.setTimeRemaining(State.getTimeRemaining() - 1);
            updateTimerUI();
            if(State.getTimeRemaining() <= 0) {
                window.stopTimer();
                showModal({
                    type: 'warning',
                    title: 'Süre Doldu!',
                    text: 'Test süreniz sona erdi. Test otomatik olarak bitiriliyor.',
                    confirmText: 'Sonucu Gör',
                    onConfirm: () => {
                        submitCurrentTest(true);
                    }
                });
            }
        }
    }, 1000));
}

export function pauseTimer() {
    State.setIsTimerPaused(!State.getIsTimerPaused());
    updatePauseIcons();
}

function updatePauseIcons() {
    const btns = document.querySelectorAll('.timer-pause-btn');
    const playIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`;
    const pauseIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
    
    btns.forEach(btn => {
        btn.innerHTML = State.getIsTimerPaused() ? playIcon : pauseIcon;
        if(State.getIsTimerPaused()) {
            btn.classList.add('text-yellow-400');
            btn.classList.add('animate-pulse');
        } else {
            btn.classList.remove('text-yellow-400');
            btn.classList.remove('animate-pulse');
        }
    });
}

export function resetTimerManually() {
    window.stopTimer();
    window.prepareTimer(State.getTestTotalQuestionsForTimer());
}

export function stopTimer() {
    clearInterval(State.getTimerInterval());
    State.setTimerInterval(null);
    State.setIsTimerRunning(false);
    
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('timer-container').classList.remove('flex');
    document.getElementById('start-timer-btn').classList.add('hidden');
    
    document.getElementById('mobile-timer-bar').classList.add('hidden');
    document.getElementById('mobile-timer-container').classList.add('hidden');
    document.getElementById('mobile-timer-container').classList.remove('flex');
    const stbm = document.getElementById('start-timer-btn-mobile'); if(stbm) stbm.classList.add('hidden');
}

function updateTimerUI() {
    const m = Math.floor(State.getTimeRemaining() / 60);
    const s = State.getTimeRemaining() % 60;
    const text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    const el = document.getElementById('timer-text');
    const mobEl = document.getElementById('mobile-timer-text');
    
    if (el) el.textContent = text;
    if (mobEl) mobEl.textContent = text;
    
    if(State.getTimeRemaining() < 60) {
        el.classList.add('text-red-400');
        mobEl.classList.add('text-red-400');
        mobEl.classList.remove('text-white');
    } else {
        el.classList.remove('text-red-400');
        mobEl.classList.remove('text-red-400');
        mobEl.classList.add('text-white');
    }
}

// Expose functions to window for legacy inline calls in HTML
window.prepareTimer = prepareTimer;
window.startTimerManually = startTimerManually;
window.pauseTimer = pauseTimer;
window.resetTimerManually = resetTimerManually;
window.stopTimer = stopTimer;
