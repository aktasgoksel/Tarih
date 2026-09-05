/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";

import { db } from "../firebase.js";
import { deleteUser, updateEmail, updateProfile } from "firebase/auth";
import { doc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { saveUserDataCloud, updateMistakeBadge, updateFavoritesBadge } from "../core/auth.js";
import { renderGrid, updateGridUI } from "./optic.js";
import { prepareTimer, stopTimer } from "./timer.js";
import { showModal } from "../ui/modal.js";


// --- APP LOGIC ---

        export function renderDropdown() {
            const dropdown = document.getElementById('test-dropdown');
            dropdown.innerHTML = '';
            
            // Random Trial Option
            const randomOpt = document.createElement('option');
            randomOpt.value = 'RANDOM_27';
            randomOpt.textContent = 'ğŸ² Gerçek KPSS Denemesi (Rastgele 27 Soru)';
            randomOpt.className = 'font-bold text-indigo-600 dark:text-indigo-400';
            dropdown.appendChild(randomOpt);
            
            // Mistake Option
            const mistakeOpt = document.createElement('option');
            mistakeOpt.value = 'MISTAKES';
            mistakeOpt.textContent = 'ğŸ”¥ Yanlış Yaptığım Sorular (Özel Test)';
            mistakeOpt.className = 'font-bold text-rose-600 dark:text-rose-400';
            dropdown.appendChild(mistakeOpt);
            
            // Favorite Option
            const favOpt = document.createElement('option');
            favOpt.value = 'FAVORITES';
            favOpt.textContent = 'â­ Favori Sorularım (Kaydedilenler)';
            favOpt.className = 'font-bold text-amber-600 dark:text-amber-400';
            dropdown.appendChild(favOpt);
            
            State.getTestData().forEach((test, index) => {
                const opt = document.createElement('option');
                opt.value = index;
                const isFinished = State.getUserData().testProgress[index] && State.getUserData().testProgress[index].finished;
                
                let scoreText = '';
                if(isFinished) {
                    const score = State.getUserData().testProgress[index].score;
                    scoreText = ` \u2713 (Çözüldü - ${score}/${test.questions.length})`;
                }
                opt.textContent = `${test.title}${scoreText}`;
                dropdown.appendChild(opt);
            });
        }

        export function generateTestFromList(mode, sourceList, maxItems, emptyMessage, titlePrefix, titleSuffix) {
            State.setCurrentMode(mode);
            State.setCurrentTestQuestions([]);
            setReshuffleVisible(false);
            
            const shuffled = [...sourceList].sort(() => 0.5 - Math.random());
            const selected = maxItems ? shuffled.slice(0, maxItems) : shuffled;
            
            selected.forEach(m => {
                const test = State.getTestData()[m.testIdx];
                if(test && test.questions && test.questions[m.qIdx]) {
                    State.getCurrentTestQuestions().push({
                        originalTestIdx: m.testIdx,
                        originalQIdx: m.qIdx,
                        data: test.questions[m.qIdx]
                    });
                }
            });
            
            const cTitle = document.getElementById('current-test-title'); 
            if(cTitle) cTitle.textContent = State.getCurrentTestQuestions().length > 0 
                ? `${titlePrefix} (${State.getCurrentTestQuestions().length} ${titleSuffix})` 
                : emptyMessage;
                
            State.setCurrentQuestionIndex(0);
            renderTestUI(State.getCurrentTestQuestions());
            renderGrid(State.getCurrentTestQuestions().length);
            
            if(State.getCurrentTestQuestions().length > 0) {
                prepareTimer(State.getCurrentTestQuestions().length);
            } else {
                stopTimer();
                document.getElementById('grid-container').classList.add('hidden');
            }
            window.updateUI();
        }

        export function generateMistakeTest() {
            generateTestFromList(
                'MISTAKES',
                State.getUserData().mistakes || [],
                30,
                'Hiç yanlışınız yok! Tebrikler!',
                '🔥 Yanlışlarım',
                'Soru'
            );
        }
        
        export function generateFavoritesTest() {
            generateTestFromList(
                'FAVORITES',
                State.getUserData().favorites || [],
                null,
                'Henüz favori sorunuz yok.',
                '⭐ Favori Sorularım',
                'Soru'
            );
        }

        function setReshuffleVisible(visible) {
            const btn = document.getElementById('reshuffle-random-btn');
            if (!btn) return;
            if (visible) {
                btn.classList.remove('hidden');
                btn.classList.add('inline-flex');
            } else {
                btn.classList.add('hidden');
                btn.classList.remove('inline-flex');
            }
        }

        export function generateRandomTest() {
            State.setCurrentMode('RANDOM_27');
            State.setCurrentTestQuestions([]);
            setReshuffleVisible(true);
            
            let allQ = [];
            State.getTestData().forEach((test, tIdx) => {
                (test.questions || []).forEach((q, qIdx) => {
                    allQ.push({ originalTestIdx: tIdx, originalQIdx: qIdx, data: q });
                });
            });
            
            allQ.sort(() => 0.5 - Math.random());
            State.setCurrentTestQuestions(allQ.slice(0, 27));
            
            const cTitle3 = document.getElementById('current-test-title'); if(cTitle3) cTitle3.textContent = 'ğŸ² Rastgele KPSS Denemesi (27 Soru)';
            State.setCurrentQuestionIndex(0);
            
            renderTestUI(State.getCurrentTestQuestions());
            renderGrid(State.getCurrentTestQuestions().length);
            
            if(State.getCurrentTestQuestions().length > 0) {
                prepareTimer(State.getCurrentTestQuestions().length);
            } else {
                stopTimer();
                document.getElementById('grid-container').classList.add('hidden');
            }
            window.updateUI();
        }

        export function showTest(val) {
            if(val === 'MISTAKES') {
                document.getElementById('test-dropdown').value = 'MISTAKES';
                generateMistakeTest();
                return;
            }
            if(val === 'FAVORITES') {
                document.getElementById('test-dropdown').value = 'FAVORITES';
                generateFavoritesTest();
                return;
            }
            if(val === 'RANDOM_27') {
                document.getElementById('test-dropdown').value = 'RANDOM_27';
                window.generateRandomTest();
                return;
            }
            
            State.setCurrentMode('NORMAL');
            setReshuffleVisible(false);
            let index = parseInt(val, 10);
            const tests = State.getTestData();
            if (!Number.isFinite(index) || index < 0 || !tests[index]) {
                index = 0;
            }
            if (!tests[index]) {
                const cTitleEmpty = document.getElementById('current-test-title');
                if (cTitleEmpty) cTitleEmpty.textContent = 'Henüz test yüklenmedi';
                return;
            }
            State.setCurrentTestIndex(index);
            State.setCurrentQuestionIndex(0);
            
            document.getElementById('test-dropdown').value = String(index);
            const cTitle = document.getElementById('current-test-title'); if(cTitle) cTitle.textContent = tests[index].title;
            
            State.setCurrentTestQuestions(State.getTestData()[index].questions.map((q, idx) => ({
                originalTestIdx: index,
                originalQIdx: idx,
                data: q
            })));
            
            renderTestUI(State.getCurrentTestQuestions());
            renderGrid(State.getCurrentTestQuestions().length);
            
            const isFinished = State.getUserData().testProgress[index] && State.getUserData().testProgress[index].finished;
            
            if (isFinished) {
                stopTimer();
                evaluateTest(State.getCurrentTestQuestions());
            } else {
                prepareTimer(State.getCurrentTestQuestions().length);
            }
            
            window.updateUI();
        }

        function renderTestUI(questions) {
            const container = document.getElementById('questions-container');
            container.innerHTML = '';
            
            if(questions.length === 0) {
                container.innerHTML = '<div class="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><span class="text-gray-500 dark:text-gray-400 font-medium text-lg">Gösterilecek soru bulunamadı.</span></div>';
                document.getElementById('submit-btn').style.display = 'none';
                return;
            }

            questions.forEach((qObj, index) => {
                const q = qObj.data;
                const questionEl = document.createElement('div');
                questionEl.className = 'question-block relative bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 md:p-8 transition-colors duration-200';
                questionEl.id = `q-block-${index}`;
                
                let sourceBadge = '';
                if(State.getCurrentMode() !== 'NORMAL') {
                    sourceBadge = `<span class="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-5 inline-block font-medium border border-indigo-200 dark:border-indigo-800/50 shadow-sm">Kaynak: ${window.escapeHTML(State.getTestData()[qObj.originalTestIdx].title)} (Soru ${q.qNum})</span>`;
                }
                
                let isFav = State.getUserData().favorites && State.getUserData().favorites.find(f => f.testIdx === qObj.originalTestIdx && f.qIdx === qObj.originalQIdx);
                let starSvg = isFav 
                    ? `<svg class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
                    : `<svg class="w-6 h-6 text-gray-400 hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;

                const favButton = `<button id="star-btn-${index}" onclick="window.toggleFavorite(${index})" class="absolute top-4 right-4 min-h-11 min-w-11 p-2 bg-white dark:bg-slate-800 rounded-full focus:outline-none z-10 transition-transform hover:scale-110 flex items-center justify-center" title="Favorilere Ekle/Çıkar">${starSvg}</button>`;

                let optionsHtml = '';
                Object.keys(q.options).forEach((optKey, optIndex) => {
                    let optText = window.escapeHTML(q.options[optKey]);
                    if (typeof optText === 'string') optText = optText.replace(/\n/g, '<br>');
                    
                    const radioName = `question-${index}`;
                    
                    optionsHtml += 
                        `<div class="mb-3 relative group">
                            <input type="radio" id="opt-${index}-${optIndex}" name="${radioName}" value="${optKey}" class="peer sr-only" onchange="window.handleOptionSelect(${index}); window.updateGridUI();">
                            <label for="opt-${index}-${optIndex}" class="option-label block w-full p-4 border border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 group-hover:border-blue-300 dark:group-hover:border-blue-500/50 pr-10 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/30">
                                <span class="font-bold mr-2 text-blue-600 dark:text-blue-400">${optKey})</span> <span class="inline-block align-top">${optText}</span>
                            </label>
                        </div>`
                    ;
                });
                
                let qText = window.escapeHTML(q.question);
                if(typeof qText === 'string') qText = qText.replace(/\n/g, '<br>');

                questionEl.innerHTML = 
                    `${favButton}
                    ${sourceBadge}
                    <h3 class="text-lg md:text-xl font-semibold mb-6 pr-8 text-gray-800 dark:text-gray-100 leading-relaxed"><span class="text-blue-600 dark:text-blue-400 mr-2">${index + 1}.</span>${qText}</h3>
                    <div class="options-container mb-4">
                        ${optionsHtml}
                    </div>
                    
                    <div id="check-btn-container-${index}" class="mt-5 flex justify-end">
                        <button onclick="window.evaluateSingleQuestion(${index})" class="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold transition-colors text-sm shadow-sm flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Cevabı Kontrol Et
                        </button>
                    </div>

                    <div id="solution-${index}" class="hidden mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg">
                        <h4 class="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Çözüm ve Açıklama (Doğru Cevap: ${q.answer})
                        </h4>
                        <p class="text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">${q.solution ? (typeof q.solution === 'string' ? window.escapeHTML(q.solution).replace(/\n/g, '<br>') : window.escapeHTML(q.solution)) : 'Açıklama bulunmuyor.'}</p>
                    </div>`
                ;
                container.appendChild(questionEl);
            });
        }

        

        export function updateUI() {
            const totalQ = State.getCurrentTestQuestions().length;
            if(totalQ === 0) return;
            
            document.querySelectorAll('.question-block').forEach((el, idx) => {
                if(idx === State.getCurrentQuestionIndex()) {
                    el.classList.add('active');
                    updateGridUI();
        } else {
                    el.classList.remove('active');
                }
            });
            
            const counterText = `Soru ${State.getCurrentQuestionIndex() + 1} / ${totalQ}`;
            const qCounter = document.getElementById('question-counter'); if(qCounter) qCounter.textContent = counterText;
            
            const progressPct = ((State.getCurrentQuestionIndex()) / (totalQ - 1)) * 100 || 0;
            document.getElementById('progress-bar').style.width = `${progressPct}%`;
            
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            const resultContainer = document.getElementById('result-container');
            
            prevBtn.style.display = State.getCurrentQuestionIndex() > 0 ? 'flex' : 'none';
            
            const isFinished = (State.getCurrentMode() === 'NORMAL') ? (State.getUserData().testProgress[State.getCurrentTestIndex()] && State.getUserData().testProgress[State.getCurrentTestIndex()].finished) : false;
            // For special modes, they are never "finished" formally in DB, they just hide the submit button if they end. 
            // Actually, we can submit RANDOM tests to show results. Let's allow submit for RANDOM mode!
            
            const canSubmit = (State.getCurrentMode() === 'NORMAL' && !isFinished) || (State.getCurrentMode() === 'RANDOM_27');
            
            if (State.getCurrentQuestionIndex() === totalQ - 1) {
                nextBtn.style.display = 'none';
                if (canSubmit) {
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
            }
            
            const statusEl = document.getElementById('test-status');
            const mobStatusEl = document.getElementById('mobile-test-status');
            let statusText = '', statusClass = '', mobStatusClass = '';

            if(State.getCurrentMode() === 'MISTAKES' || State.getCurrentMode() === 'FAVORITES') {
                if (State.getCurrentMode() === 'MISTAKES') {
                    statusText = 'Hata Testi';
                    statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border border-transparent dark:border-rose-800/50';
                    mobStatusClass = 'sm:hidden px-3 py-1.5 text-xs border shadow-sm rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border-rose-200 dark:border-rose-800/50';
                } else {
                    statusText = 'Favoriler';
                    statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-transparent dark:border-amber-800/50';
                    mobStatusClass = 'sm:hidden px-3 py-1.5 text-xs border shadow-sm rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-800/50';
                }
                resultContainer.classList.add('hidden');
            } else if(State.getCurrentMode() === 'RANDOM_27' && !document.getElementById('result-container').classList.contains('hidden')) {
                // if random test is submitted, it will show result-container. We shouldn't force hide it here unless it's resetting.
                // It will be handled in evaluateTest / submitCurrentTest
            } else if(isFinished) {
                statusText = 'Tamamlandı';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-transparent dark:border-emerald-800/50';
                mobStatusClass = 'sm:hidden px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-800/50';
                resultContainer.classList.remove('hidden');
                stopTimer();
            } else {
                statusText = 'Çözülüyor';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 border border-transparent dark:border-yellow-800/50';
                mobStatusClass = 'sm:hidden px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800/50';
            }
            
            if(statusEl) {
                statusEl.textContent = statusText;
                statusEl.className = statusClass;
            }
            if (mobStatusEl) {
                mobStatusEl.textContent = statusText;
                mobStatusEl.className = mobStatusClass;
            }
            
            updateGridUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        export function nextQuestion() {
            const total = State.getCurrentTestQuestions().length;
            if (State.getCurrentQuestionIndex() < total - 1) {
                State.setCurrentQuestionIndex(State.getCurrentQuestionIndex() + 1);
                window.updateUI();
            }
        }

        export function prevQuestion() {
            if (State.getCurrentQuestionIndex() > 0) {
                State.setCurrentQuestionIndex(State.getCurrentQuestionIndex() - 1);
                window.updateUI();
            }
        }
        
        export function handleOptionSelect(qIndex) {
            const isInstant = document.getElementById('instant-feedback').checked;
            const isFinished = (State.getCurrentMode() === 'NORMAL') ? (State.getUserData().testProgress[State.getCurrentTestIndex()] && State.getUserData().testProgress[State.getCurrentTestIndex()].finished) : false;
            
            if (isInstant && !isFinished && State.getCurrentMode() !== 'RANDOM_27') {
                window.evaluateSingleQuestion(qIndex);
            }
        }
        
        function recordMistake(tIdx, qIdx, isMistake) {
            const existingIdx = State.getUserData().mistakes.findIndex(m => m.testIdx === tIdx && m.qIdx === qIdx);
            
            if(isMistake) {
                if(existingIdx === -1) {
                    State.getUserData().mistakes.push({ testIdx: tIdx, qIdx: qIdx });
                }
            } else {
                if(existingIdx !== -1) {
                    State.getUserData().mistakes.splice(existingIdx, 1);
                }
            }
            saveUserDataCloud();
        }

        function markQuestionAndDisableInputs(radioName, correctAnswer, selectedOption) {
            const inputs = document.querySelectorAll(`input[name="${radioName}"]`);
            inputs.forEach(input => input.disabled = true);

            const correctInput = document.querySelector(`input[name="${radioName}"][value="${correctAnswer}"]`);
            if(correctInput) {
                correctInput.nextElementSibling.classList.add('correct-answer');
            }

            if (selectedOption && selectedOption.value !== correctAnswer) {
                selectedOption.nextElementSibling.classList.add('incorrect-answer');
            }
        }

        export function evaluateSingleQuestion(uiIndex) {
            const qObj = State.getCurrentTestQuestions()[uiIndex];
            const q = qObj.data;
            const radioName = `question-${uiIndex}`;
            
            const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!selectedOption) {
                showModal({ type: 'info', title: 'Uyarı', text: 'Çözümü görmek için lütfen önce bir şık işaretleyin.', confirmText: 'Tamam' });
                return;
            }
            
            markQuestionAndDisableInputs(radioName, q.answer, selectedOption);

            const isMistake = selectedOption.value !== q.answer;
            recordMistake(qObj.originalTestIdx, qObj.originalQIdx, isMistake);
            
            const solutionDiv = document.getElementById(`solution-${uiIndex}`);
            if(solutionDiv) solutionDiv.classList.remove('hidden');
            
            const btnContainer = document.getElementById(`check-btn-container-${uiIndex}`);
            if(btnContainer) btnContainer.classList.add('hidden');
        }

        function evaluateTest(mappedQuestions) {
            let score = 0;
            
            mappedQuestions.forEach((qObj, uiIndex) => {
                const q = qObj.data;
                const radioName = `question-${uiIndex}`;
                
                const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                const solutionDiv = document.getElementById(`solution-${uiIndex}`);
                
                markQuestionAndDisableInputs(radioName, q.answer, selectedOption);

                if (selectedOption) {
                    if (selectedOption.value === q.answer) {
                        score++;
                        recordMistake(qObj.originalTestIdx, qObj.originalQIdx, false);
                    } else {
                        recordMistake(qObj.originalTestIdx, qObj.originalQIdx, true);
                    }
                } else {
                    recordMistake(qObj.originalTestIdx, qObj.originalQIdx, true);
                }
                
                if(solutionDiv) solutionDiv.classList.remove('hidden');
                
                const btnContainer = document.getElementById(`check-btn-container-${uiIndex}`);
                if(btnContainer) btnContainer.classList.add('hidden');
            });
            
            return score;
        }

        export function submitCurrentTest(forceSubmit = false) {
            if(State.getCurrentMode() === 'MISTAKES' || State.getCurrentMode() === 'FAVORITES') return;
            
            let answeredCount = 0;
            State.getCurrentTestQuestions().forEach((q, uiIndex) => {
                if(document.querySelector(`input[name="question-${uiIndex}"]:checked`)) {
                    answeredCount++;
                }
            });
            
            if(!forceSubmit && answeredCount < State.getCurrentTestQuestions().length) {
                const emptyCount = State.getCurrentTestQuestions().length - answeredCount;
                showModal({
                    type: 'warning',
                    title: 'Eksik Sorular Var',
                    text: `Henüz ${emptyCount} soruyu boş bıraktınız. Testi yine de bitirmek istediğinize emin misiniz?`,
                    confirmText: 'Evet, Bitir',
                    cancelText: 'Vazgeç',
                    onConfirm: () => {
                        window.submitCurrentTest(true);
                    }
                });
                return;
            }
            
            stopTimer(); 
            
            const score = evaluateTest(State.getCurrentTestQuestions());
            
            if (State.getCurrentMode() === 'NORMAL') {
                State.getUserData().testProgress[State.getCurrentTestIndex()] = {
                    finished: true,
                    score: score
                };
                saveUserDataCloud();
            }
            
            const resultContainer = document.getElementById('result-container');
            resultContainer.classList.remove('hidden');
            
            const scoreText = document.getElementById('score-text');
            scoreText.innerHTML = `${score} / ${State.getCurrentTestQuestions().length}`;
            
            const reviewBtn = document.getElementById('review-mistakes-btn');
            if (score < State.getCurrentTestQuestions().length) {
                reviewBtn.classList.remove('hidden');
                reviewBtn.classList.add('flex');
            } else {
                reviewBtn.classList.add('hidden');
                reviewBtn.classList.remove('flex');
            }
            
            // CONFETTI ANIMATION IF FULL SCORE
            if (score === State.getCurrentTestQuestions().length && typeof confetti === 'function') {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 },
                    colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#3b82f6']
                });
            }
            
            State.setCurrentQuestionIndex(0);
            window.updateUI();
            if(State.getCurrentMode() === 'NORMAL') renderDropdown();
        }
        
        export function showReviewMistakes() {
            for(let i=0; i<State.getCurrentTestQuestions().length; i++) {
                const radioName = `question-${i}`;
                const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
                const q = State.getCurrentTestQuestions()[i].data;
                
                if (!selectedOption || selectedOption.value !== q.answer) {
                    State.setCurrentQuestionIndex(i);
                    window.updateUI();
                    return;
                }
            }
        }

window.showReviewMistakes = showReviewMistakes;
window.updateUI = updateUI;
