import { db } from "../firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { State } from "../state.js";

let loaderTimeout = null;

export function showLoader(msg = "Yükleniyor...") {
    const loader = document.getElementById('global-loader');
    if(loader) {
        document.getElementById('loader-text').textContent = msg;
        loader.classList.remove('hidden');
        loader.classList.add('flex');
        
        if (loaderTimeout) {
            clearTimeout(loaderTimeout);
        }
        
        // Timeout after 15 seconds to prevent hanging loading screen
        loaderTimeout = setTimeout(() => {
            if (loader && !loader.classList.contains('hidden')) {
                hideLoader();
                const errorMsg = 'Yükleme işlemi beklenenden uzun sürdü. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.';
                if (window.showModal) {
                    window.showModal({ type: 'error', title: 'Bağlantı Zaman Aşımı', text: errorMsg, confirmText: 'Yeniden Dene', onConfirm: () => window.location.reload() });
                } else {
                    alert(errorMsg);
                }
            }
        }, 15000);
    }
}

export function hideLoader() {
    const loader = document.getElementById('global-loader');
    if(loader) {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
    if (loaderTimeout) {
        clearTimeout(loaderTimeout);
        loaderTimeout = null;
    }
}

// Load tests from Firestore
export async function loadTestsFromFirestore() {
    try {
        console.log("Fetching tests from Firestore...");
        const querySnapshot = await getDocs(collection(db, "tests"));
        let fetchedTests = [];
        querySnapshot.forEach((doc) => {
            fetchedTests.push(doc.data());
        });
        
        // Sort by order
        fetchedTests.sort((a, b) => a.order - b.order);
        State.setTestData(fetchedTests);
        
        // Force instant-feedback to be false on load to prevent browser caching
        const instantToggle = document.getElementById('instant-feedback');
        if (instantToggle) instantToggle.checked = false;
        
    } catch (error) {
        console.error("Failed to fetch tests:", error);
        throw error;
    }
}
