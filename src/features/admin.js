import { State } from "../state.js";
import { auth, db } from "../firebase.js";
import { doc, setDoc, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { showModal } from "../ui/modal.js";

// ==========================================
// ADMIN PANEL LOGIC
// ==========================================
export async function openAdminPanel() {
    const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];
    if(!State.getCurrentUser() || !ADMIN_EMAILS.includes(State.getCurrentUser().email)) {
        showModal({ type: 'error', title: 'Hata', text: 'Yetkisiz erişim!', confirmText: 'Tamam' });
        return;
    }

    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('flex');
    document.getElementById('admin-screen').classList.remove('hidden');
    document.getElementById('admin-screen').classList.add('flex');

    const list = document.getElementById('admin-suggestions-list');
    if (list) {
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
                existingQuestions = State.getTestData()[i].questions || [];
                break;
            }
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
        
        feedback.textContent = 'Soru başarıyla kaydedildi!';
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
        await window.loadTestsFromFirestore();
        
    } catch(err) {
        console.error('Soru kaydedilemedi:', err);
        feedback.textContent = 'Hata: ' + err.message;
        feedback.className = 'mt-4 text-center font-medium text-red-500 block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Soruyu Veritabanına Kaydet';
    }
};