/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */
import { State } from "../state.js";
import { auth, db } from "../firebase.js";
import { doc, setDoc, collection, getDocs, query, deleteDoc } from "firebase/firestore";
import { showModal } from "../ui/modal.js";

// ==========================================
// ADMIN PANEL LOGIC
// ==========================================
export async function openAdminPanel() {
    const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
    if(!State.getCurrentUser() || !ADMIN_EMAILS.includes(State.getCurrentUser().email)) {
        showModal({ type: 'error', title: 'Hata', text: 'Yetkisiz eriÅŸim!', confirmText: 'Tamam' });
        return;
    }

    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('flex');
    document.getElementById('admin-screen').classList.remove('hidden');
    document.getElementById('admin-screen').classList.add('flex');

    const list = document.getElementById('admin-suggestions-list');
    if (list) {
        list.innerHTML = '<div class="text-center py-10 text-gray-500">VeritabanÄ±ndan Ã¶neriler Ã§ekiliyor...</div>';
        
        try {
            const q = query(collection(db, "suggestions"));
            const querySnapshot = await getDocs(q);
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            
            items.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            let html = '';
            items.forEach(item => {
                const dateStr = new Date(item.timestamp).toLocaleString('tr-TR');
                html += `
                    <div class="bg-white dark:bg-slate-800 p-4 mb-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 min-w-0 overflow-hidden">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 border-b border-gray-100 dark:border-slate-700 pb-2">
                            <div class="min-w-0">
                                <span class="font-bold text-blue-600 dark:text-blue-400">${window.escapeHTML(item.displayName)}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">(${window.escapeHTML(item.email || '')})</span>
                            </div>
                            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                                <span class="text-xs text-gray-500 dark:text-gray-400">${dateStr}</span>
                                <button onclick="window.deleteSuggestion('${item.id}')" class="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Sil">
                                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                        <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words overflow-hidden">${window.escapeHTML(item.text)}</div>
                    </div>
                `;
            });
            
            if(items.length === 0) {
                html = '<div class="text-center py-10 text-gray-500 font-medium">HenÃ¼z kimse bir Ã¶neri gÃ¶ndermemiÅŸ.</div>';
            }
            list.innerHTML = html;
        } catch (e) {
            console.error(e);
            list.innerHTML = '<div class="text-center text-red-500 py-10 font-bold">Veriler Ã§ekilemedi! Firebase Rules (Kurallar) izin vermiyor olabilir.</div>';
        }
    }
}

export function closeAdminPanel() {
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('flex');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('flex');
}

window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;

window.saveAdminQuestion = async function() {
    const btn = document.getElementById('admin-save-btn');
    const feedback = document.getElementById('admin-feedback');
    const title = document.getElementById('admin-test-title').value.trim();
    const qText = document.getElementById('admin-question-text').value.trim();
    const optA = document.getElementById('admin-opt-a').value.trim();
    const optB = document.getElementById('admin-opt-b').value.trim();
    const optC = document.getElementById('admin-opt-c').value.trim();
    const optD = document.getElementById('admin-opt-d').value.trim();
    const optE = document.getElementById('admin-opt-e').value.trim();
    const ans = document.getElementById('admin-correct-answer').value;
    const sol = document.getElementById('admin-solution').value.trim();
    
    if(!title || !qText || !optA || !optB || !optC || !optD || !optE) {
        feedback.textContent = 'Lütfen tüm soru ve şık alanlarını doldurun!';
        feedback.className = 'mt-4 text-center font-medium text-red-500 block';
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Kaydediliyor...';
    
    try {
        // Find existing test or create new
        let targetTestId = null;
        let targetTestOrder = State.getTestData().length + 1;
        let existingQuestions = [];
        
        for(let i=0; i<State.getTestData().length; i++) {
            if(State.getTestData()[i].title === title) {
                targetTestId = State.getTestData()[i].id;
                targetTestOrder = State.getTestData()[i].order;
                existingQuestions = [...(State.getTestData()[i].questions || [])];
                break;
            }
        }
        
        // Validation: max 24 questions per test
        if(existingQuestions.length >= 24) {
            feedback.textContent = `Bu test zaten 24 soruya sahip. Daha fazla soru eklenemez.`;
            feedback.className = 'mt-4 text-center font-medium text-red-500 block';
            btn.disabled = false;
            btn.textContent = 'Soruyu Veritabanına Kaydet';
            return;
        }
        
        if(!targetTestId) {
            targetTestId = 'test_' + Date.now(); // Unique ID for new tests
        }
        
        const newQuestion = {
            qNum: existingQuestions.length + 1,
            question: qText,
            options: { A: optA, B: optB, C: optC, D: optD, E: optE },
            answer: ans,
            solution: sol
        };
        
        existingQuestions.push(newQuestion);
        
        const docRef = doc(db, 'tests', targetTestId);
        await setDoc(docRef, {
            id: targetTestId,
            title: title,
            order: targetTestOrder,
            questions: existingQuestions
        });
        
        const remaining = 24 - existingQuestions.length;
        if (remaining > 0) {
            feedback.textContent = `Soru başarıyla kaydedildi! (${existingQuestions.length}/24 — ${remaining} soru daha eklenebilir)`;
        } else {
            feedback.textContent = `Soru başarıyla kaydedildi! Test tamamlandı (24/24) ✓`;
        }
        feedback.className = 'mt-4 text-center font-bold text-green-500 block';
        
        // Clear form
        document.getElementById('admin-question-text').value = '';
        document.getElementById('admin-opt-a').value = '';
        document.getElementById('admin-opt-b').value = '';
        document.getElementById('admin-opt-c').value = '';
        document.getElementById('admin-opt-d').value = '';
        document.getElementById('admin-opt-e').value = '';
        document.getElementById('admin-solution').value = '';
        
        // Reload tests
        const { loadTestsFromFirestore } = await import('../ui/loader.js');
        await loadTestsFromFirestore();
        if (typeof window.renderDropdown === 'function') window.renderDropdown();
        
    } catch(err) {
        console.error('Soru kaydedilemedi:', err);
        feedback.textContent = 'Hata: ' + err.message;
        feedback.className = 'mt-4 text-center font-medium text-red-500 block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Soruyu Veritabanına Kaydet';
    }
};

// Database Audit: Check all tests for question count
window.auditTests = function() {
    const tests = State.getTestData();
    if (!tests || tests.length === 0) {
        showModal({ type: 'error', title: 'Denetim Hatası', text: 'Test verisi yüklenmemiş. Lütfen önce giriş yapın.', confirmText: 'Tamam' });
        return;
    }
    
    let report = '';
    let incompleteCount = 0;
    
    const sorted = [...tests].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    for (const t of sorted) {
        const qCount = Array.isArray(t.questions) ? t.questions.length : 0;
        if (qCount !== 24) {
            incompleteCount++;
            report += `\n❌ "${t.title}" → ${qCount}/24 soru (${24 - qCount} eksik)`;
        }
    }
    
    if (incompleteCount === 0) {
        showModal({ type: 'success', title: 'Veritabanı Denetimi', text: `Tüm ${tests.length} test eksiksiz (24/24 soru). ✓`, confirmText: 'Harika' });
    } else {
        showModal({ type: 'warning', title: 'Veritabanı Denetimi', text: `${tests.length} testten ${incompleteCount} tanesinde eksik soru var:\n${report}`, confirmText: 'Anladım' });
    }
};

export async function deleteSuggestion(suggestionId) {
    showModal({
        type: 'warning',
        title: 'Ã–neriyi Sil',
        text: 'Bu Ã¶neriyi silmek istediÄŸinize emin misiniz? Bu iÅŸlem geri alÄ±namaz.',
        confirmText: 'Evet, Sil',
        cancelText: 'Ä°ptal',
        onConfirm: async () => {
            try {
                await deleteDoc(doc(db, "suggestions", suggestionId));
                // Reload suggestions list instantly
                await openAdminPanel();
                showModal({ type: 'success', title: 'BaÅŸarÄ±lÄ±', text: 'Ã–neri baÅŸarÄ±yla silindi.', confirmText: 'Kapat' });
            } catch (e) {
                console.error(e);
                showModal({ type: 'error', title: 'Hata', text: 'Ã–neri silinirken bir hata oluÅŸtu: ' + e.message, confirmText: 'Tamam' });
            }
        }
    });
}

window.deleteSuggestion = deleteSuggestion;

window.injectMissingQuestions = async function() {
    if (!confirm("Eksik sorular veritabanına eklenecek. Onaylıyor musunuz?")) return;
    
    try {
        const { missingQuestions } = await import('../data/missing_questions.js');
        let successCount = 0;
        let skipCount = 0;
        let totalAdded = 0;
        
        for (const [testNum, newQs] of Object.entries(missingQuestions)) {
            const testId = `test_${testNum}`;
            const testRef = doc(db, "tests", testId);
            const snap = await getDoc(testRef);
            
            if (snap.exists()) {
                const data = snap.data();
                let existingQuestions = [...(data.questions || [])];
                
                if (existingQuestions.length < 24) {
                    for (const nq of newQs) {
                        const formattedQ = {
                            questionText: nq.question,
                            options: [
                                { id: 'A', text: nq.options.A || nq.options.a || '' },
                                { id: 'B', text: nq.options.B || nq.options.b || '' },
                                { id: 'C', text: nq.options.C || nq.options.c || '' },
                                { id: 'D', text: nq.options.D || nq.options.d || '' },
                                { id: 'E', text: nq.options.E || nq.options.e || '' }
                            ],
                            correctAnswer: (nq.answer || '').toUpperCase().trim(),
                            solution: nq.solution || ''
                        };
                        existingQuestions.push(formattedQ);
                        totalAdded++;
                    }
                    
                    if (existingQuestions.length > 24) {
                        existingQuestions = existingQuestions.slice(0, 24);
                    }
                    
                    await updateDoc(testRef, { questions: existingQuestions });
                    successCount++;
                    console.log(`[OK] ${testId} güncellendi. Yeni soru sayısı: ${existingQuestions.length}`);
                } else {
                    skipCount++;
                }
            }
        }
        
        alert(`Tamamlandı!\n\nGüncellenen Test: ${successCount}\nEklenen Toplam Soru: ${totalAdded}\nAtlanan (Zaten Tam): ${skipCount}`);
        
        if (typeof window.auditTests === 'function') {
            window.auditTests();
        }
        
    } catch (e) {
        console.error("Enjeksiyon hatası:", e);
        alert("Bir hata oluştu. Lütfen konsola bakın.");
    }
};
