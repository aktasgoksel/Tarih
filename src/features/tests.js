import { State } from "../state.js";

import { auth, db } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
            randomOpt.textContent = '🎲 Gerçek KPSS Denemesi (Rastgele 27 Soru)';
            randomOpt.className = 'font-bold text-indigo-600 dark:text-indigo-400';
            dropdown.appendChild(randomOpt);
            
            // Mistake Option
            const mistakeOpt = document.createElement('option');
            mistakeOpt.value = 'MISTAKES';
            mistakeOpt.textContent = '🔥 Yanlış Yaptığım Sorular (Özel Test)';
            mistakeOpt.className = 'font-bold text-rose-600 dark:text-rose-400';
            dropdown.appendChild(mistakeOpt);
            
            // Favorite Option
            const favOpt = document.createElement('option');
            favOpt.value = 'FAVORITES';
            favOpt.textContent = '⭐ Favori Sorularım (Kaydedilenler)';
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

        export function generateMistakeTest() {
            State.setCurrentMode('MISTAKES');
            State.setCurrentTestQuestions([]);
            
            const shuffled = [...State.getUserData().mistakes].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 30); // up to 30 mistake questions
            
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
            
            const cTitle2 = document.getElementById('current-test-title'); if(cTitle2) cTitle2.textContent = State.getCurrentTestQuestions().length > 0 
                ? `🔥 Yanlışlarım (${State.getCurrentTestQuestions().length} Soru)` 
                : 'Hiç yanlışınız yok! Tebrikler!';
                
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
        
        export function generateFavoritesTest() {
            State.setCurrentMode('FAVORITES');
            State.setCurrentTestQuestions([]);
            
            const shuffled = [...State.getUserData().favorites].sort(() => 0.5 - Math.random());
            
            shuffled.forEach(m => {
                const test = State.getTestData()[m.testIdx];
                if(test && test.questions && test.questions[m.qIdx]) {
                    State.getCurrentTestQuestions().push({
                        originalTestIdx: m.testIdx,
                        originalQIdx: m.qIdx,
                        data: test.questions[m.qIdx]
                    });
                }
            });
            
            const cTitle2 = document.getElementById('current-test-title'); if(cTitle2) cTitle2.textContent = State.getCurrentTestQuestions().length > 0 
                ? `⭐ Favori Sorularım (${State.getCurrentTestQuestions().length} Soru)` 
                : 'Henüz favori sorunuz yok.';
                
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

        export function generateRandomTest() {
            State.setCurrentMode('RANDOM_27');
            State.setCurrentTestQuestions([]);
            
            let allQ = [];
            State.getTestData().forEach((test, tIdx) => {
                test.questions.forEach((q, qIdx) => {
                    allQ.push({ originalTestIdx: tIdx, originalQIdx: qIdx, data: q });
                });
            });
            
            allQ.sort(() => 0.5 - Math.random());
            State.setCurrentTestQuestions(allQ.slice(0, 27));
            
            const cTitle3 = document.getElementById('current-test-title'); if(cTitle3) cTitle3.textContent = '🎲 Rastgele KPSS Denemesi (27 Soru)';
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
            let index = parseInt(val);
            State.setCurrentTestIndex(index);
            State.setCurrentQuestionIndex(0);
            
            document.getElementById('test-dropdown').value = index;
            const cTitle = document.getElementById('current-test-title'); if(cTitle) cTitle.textContent = State.getTestData()[index].title;
            
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

                const favButton = `<button id="star-btn-${index}" onclick="window.toggleFavorite(${index})" class="absolute top-5 right-5 p-1 bg-white dark:bg-slate-800 rounded-full focus:outline-none z-10 transition-transform hover:scale-110" title="Favorilere Ekle/Çıkar">${starSvg}</button>`;

                let optionsHtml = '';
                Object.keys(q.options).forEach((optKey, optIndex) => {
                    let optText = window.escapeHTML(q.options[optKey]);
                    if (typeof optText === 'string') optText = optText.replace(/\n/g, '<br>');
                    
                    const radioName = `question-${index}`;
                    
                    optionsHtml += 
                        `<div class="mb-3 relative group">
                            <input type="radio" id="opt-${index}-${optIndex}" name="${radioName}" value="${optKey}" class="peer sr-only" onchange="window.handleOptionSelect(${index}); updateGridUI();">
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
                statusText = (State.getCurrentMode() === 'MISTAKES') ? 'Hata Testi' : 'Favoriler';
                statusClass = 'px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border border-transparent dark:border-rose-800/50';
                if(State.getCurrentMode() === 'FAVORITES') statusClass = statusClass.replace(/rose/g, 'amber');
                mobStatusClass = statusClass.replace('px-3 py-1', 'sm:hidden px-3 py-1.5 text-xs border shadow-sm');
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

        export function evaluateSingleQuestion(uiIndex) {
            const qObj = State.getCurrentTestQuestions()[uiIndex];
            const q = qObj.data;
            const radioName = `question-${uiIndex}`;
            
            const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!selectedOption) {
                showModal({ type: 'info', title: 'Uyarı', text: 'Çözümü görmek için lütfen önce bir şık işaretleyin.', confirmText: 'Tamam' });
                return;
            }
            
            const inputs = document.querySelectorAll(`input[name="${radioName}"]`);
            inputs.forEach(input => input.disabled = true);

            const correctInput = document.querySelector(`input[name="${radioName}"][value="${q.answer}"]`);
            if(correctInput) {
                correctInput.nextElementSibling.classList.add('correct-answer');
            }

            let isMistake = false;
            if (selectedOption.value !== q.answer) {
                selectedOption.nextElementSibling.classList.add('incorrect-answer');
                isMistake = true;
            }
            
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
                
                const inputs = document.querySelectorAll(`input[name="${radioName}"]`);
                inputs.forEach(input => input.disabled = true);

                const correctInput = document.querySelector(`input[name="${radioName}"][value="${q.answer}"]`);
                if(correctInput) {
                    correctInput.nextElementSibling.classList.add('correct-answer');
                }

                if (selectedOption) {
                    if (selectedOption.value === q.answer) {
                        score++;
                        recordMistake(qObj.originalTestIdx, qObj.originalQIdx, false);
                    } else {
                        selectedOption.nextElementSibling.classList.add('incorrect-answer');
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
            if(State.getCurrentMode() === 'NORMAL') window.renderDropdown();
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

        let myChart = null;

        export function showStatsModal() {
            const modal = document.getElementById('stats-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
            
            window.renderStats();
        }

        export function closeStatsModal() {
            const modal = document.getElementById('stats-modal');
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            modal.firstElementChild.classList.remove('scale-100');
            setTimeout(() => {
                modal.classList.add('hidden');
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
                        hasData = true;
                        const test = State.getTestData()[tIdx];
                        const cat = window.getCategoryName(test.title);
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

        export function openSuggestionModal() {
            document.getElementById('suggestion-modal').classList.remove('hidden');
        }
        export function closeSuggestionModal() {
            document.getElementById('suggestion-modal').classList.add('hidden');
            document.getElementById('suggestion-text').value = '';
        }
        
        export async function submitSuggestion() {
            const text = document.getElementById('suggestion-text').value.trim();
            if(!text) return;
            

            
            try {
                const btn = document.getElementById('submit-suggestion-btn');
                btn.textContent = 'Gönderiliyor...';
                btn.disabled = true;
                
                await addDoc(collection(db, 'suggestions'), {
                    uid: State.getCurrentUser().uid,
                    displayName: State.getCurrentUser().displayName || State.getCurrentUser().email,
                    text: text,
                    timestamp: new Date().toISOString()
                });
                
                showModal({ type: 'success', title: 'Başarılı', text: 'Öneriniz başarıyla alındı! Geri bildiriminiz için teşekkür ederiz.', confirmText: 'Tamam' });
                window.closeSuggestionModal();
                btn.textContent = 'Gönder';
                btn.disabled = false;
            } catch (e) {
                console.error(e);
                let errorMsg = 'Bir hata oluştu. Lütfen bağlantınızı kontrol edin.';
                if (e.code === 'permission-denied' || (e.message && e.message.includes('permission'))) {
                    errorMsg = 'Veritabanı erişim yetkisi reddedildi. Firestore kurallarınızda "suggestions" koleksiyonuna yazma izni verildiğinden emin olun.';
                } else if (e.message) {
                    errorMsg = `Hata detayı: ${e.message}`;
                }
                showModal({ type: 'error', title: 'Hata', text: errorMsg, confirmText: 'Tamam' });
                document.getElementById('submit-suggestion-btn').textContent = 'Tekrar Dene';
                document.getElementById('submit-suggestion-btn').disabled = false;
            }
        }

        export async function openAdminPanel() {
            const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
            if(!State.getCurrentUser() || !ADMIN_EMAILS.includes(State.getCurrentUser().email)) {
                showModal({ type: 'error', title: 'Hata', text: 'Yetkisiz erişim!', confirmText: 'Tamam' });
                return;
            }
            document.getElementById('admin-modal').classList.remove('hidden');
            const list = document.getElementById('admin-suggestions-list');
            list.innerHTML = '<div class="text-center py-10 text-gray-500">Veritabanından öneriler çekiliyor...</div>';
            
            try {
                const q = query(collection(db, "suggestions"));
                const querySnapshot = await getDocs(q);
                let items = [];
                querySnapshot.forEach((doc) => {
                    items.push(doc.data());
                });
                
                items.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                let html = '';
                items.forEach(item => {
                    const dateStr = new Date(item.timestamp).toLocaleString('tr-TR');
                    html += `
                        <div class="bg-white dark:bg-slate-800 p-4 mb-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                            <div class="flex justify-between items-center mb-2 border-b border-gray-100 dark:border-slate-700 pb-2">
                                <span class="font-bold text-blue-600 dark:text-blue-400">${window.escapeHTML(item.displayName)}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">${dateStr}</span>
                            </div>
                            <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${window.escapeHTML(item.text)}</div>
                        </div>
                    `;
                });
                
                if(items.length === 0) {
                    html = '<div class="text-center py-10 text-gray-500 font-medium">Henüz kimse bir öneri göndermemiş.</div>';
                }
                list.innerHTML = html;
            } catch (e) {
                console.error(e);
                list.innerHTML = '<div class="text-center text-red-500 py-10 font-bold">Veriler çekilemedi! Firebase Rules (Kurallar) izin vermiyor olabilir.</div>';
            }
        }

        export function openProfileModal() {
            if(!State.getCurrentUser()) return;
            const modal = document.getElementById('profile-modal');
            
            document.getElementById('profile-email').value = State.getCurrentUser().email;
            document.getElementById('profile-username').value = State.getCurrentUser().displayName || State.getCurrentUser().email.split('@')[0];
            
            let totalQ = 0;
            let correctQ = 0;
            if(State.getUserData().testProgress) {
                Object.keys(State.getUserData().testProgress).forEach(tIdx => {
                    const prog = State.getUserData().testProgress[tIdx];
                    if(prog && prog.finished) {
                        const test = State.getTestData()[tIdx];
                        totalQ += test.questions.length;
                        correctQ += prog.score;
                    }
                });
            }
            
            const pst = document.getElementById('profile-stat-total'); if(pst) pst.textContent = totalQ;
            const psc = document.getElementById('profile-stat-correct'); if(psc) psc.textContent = correctQ;
            const psw = document.getElementById('profile-stat-wrong'); if(psw) psw.textContent = totalQ - correctQ;
            
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }, 10);
        }

        export function closeProfileModal() {
            const modal = document.getElementById('profile-modal');
            modal.classList.add('opacity-0');
            modal.firstElementChild.classList.add('scale-95');
            modal.firstElementChild.classList.remove('scale-100');
            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }

        export async function updateUsername() {
            const newName = document.getElementById('profile-username').value.trim();
            if(!newName) return;
            
            const btn = document.getElementById('profile-update-btn');
            btn.textContent = '...';
            btn.disabled = true;
            
            try {
                await updateProfile(State.getCurrentUser(), { displayName: newName });
                document.getElementById('welcome-text').textContent = `Hoş geldin, ${newName}`;
                
                showModal({ type: 'success', title: 'İşlem Başarılı', text: 'Kullanıcı adınız başarıyla güncellenmiştir.', confirmText: 'Tamam' });
            } catch(e) {
                console.error(e);
                showModal({ type: 'error', title: 'Hata', text: 'Kullanıcı adı güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
            }
            btn.textContent = 'Güncelle';
            btn.disabled = false;
        }

        export async function updateEmailAddress() {
            const newEmail = document.getElementById('profile-email').value.trim();
            if(!newEmail || newEmail === State.getCurrentUser().email) return;
            
            const btn = document.getElementById('profile-email-btn');
            btn.textContent = '...';
            btn.disabled = true;
            
            try {
                await updateEmail(State.getCurrentUser(), newEmail);
                showModal({ type: 'success', title: 'İşlem Başarılı', text: 'E-posta adresiniz başarıyla güncellenmiştir. Hesabınıza artık yeni e-posta adresinizle giriş yapabilirsiniz.', confirmText: 'Tamam' });
            } catch(error) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                    showModal({ type: 'error', title: 'Doğrulama Gerekiyor', text: 'Güvenlik prosedürleri gereği e-posta adresinizi değiştirmeden önce sistemden çıkış yapıp tekrar giriş yapmanız gerekmektedir.', confirmText: 'Anladım' });
                } else if (error.code === 'auth/email-already-in-use') {
                    showModal({ type: 'error', title: 'Hata', text: 'Girdiğiniz e-posta adresi başka bir hesaba aittir. Lütfen farklı bir adres deneyin.', confirmText: 'Kapat' });
                } else if (error.code === 'auth/invalid-email') {
                    showModal({ type: 'error', title: 'Hata', text: 'Geçersiz bir e-posta formatı girdiniz.', confirmText: 'Kapat' });
                } else {
                    showModal({ type: 'error', title: 'Hata', text: 'E-posta adresi güncellenirken sistemsel bir hata oluştu.', confirmText: 'Kapat' });
                }
            }
            btn.textContent = 'Güncelle';
            btn.disabled = false;
        }

        export function deleteAccount() {
            showModal({
                type: 'warning',
                title: 'Dikkat!',
                text: 'Hesabınızı ve çözdüğünüz tüm soruları kalıcı olarak silmek üzeresiniz. Bu işlem kesinlikle geri alınamaz. Onaylıyor musunuz?',
                confirmText: 'Evet, Hesabımı Sil',
                cancelText: 'İptal Et',
                onConfirm: async () => {
                    try {
                        await deleteDoc(doc(db, "users", State.getCurrentUser().uid));
                        await deleteUser(State.getCurrentUser());
                        
                        window.closeProfileModal();
                        showModal({ type: 'info', title: 'Hesap Silindi', text: 'Hesabınız ve tüm verileriniz kalıcı olarak silindi. Hoşçakalın!', confirmText: 'Tamam' });
                        setTimeout(() => window.location.reload(), 2000);
                        
                    } catch(error) {
                        console.error(error);
                        if (error.code === 'auth/requires-recent-login') {
                            showModal({ type: 'error', title: 'Güvenlik Doğrulaması', text: 'Güvenlik nedeniyle hesabınızı silebilmemiz için yakın zamanda giriş yapmış olmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yaptıktan sonra bu işlemi tekrarlayın.', confirmText: 'Tamam' });
                        } else {
                            showModal({ type: 'error', title: 'Hata', text: 'Hesap silinirken bir hata oluştu: ' + error.message, confirmText: 'Tamam' });
                        }
                    }
                }
            });
        }

        
// Expose functions to window for legacy inline calls in HTML
window.renderDropdown = renderDropdown;
window.showTest = showTest;
window.updateUI = updateUI;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.handleOptionSelect = handleOptionSelect;
window.evaluateSingleQuestion = evaluateSingleQuestion;
window.submitCurrentTest = submitCurrentTest;
window.generateRandomTest = generateRandomTest;
window.generateMistakeTest = generateMistakeTest;
window.generateFavoritesTest = generateFavoritesTest;
window.openSuggestionModal = openSuggestionModal;
window.closeSuggestionModal = closeSuggestionModal;
window.submitSuggestion = submitSuggestion;
window.openAdminPanel = openAdminPanel;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.updateUsername = updateUsername;
window.updateEmailAddress = updateEmailAddress;
window.deleteAccount = deleteAccount;
