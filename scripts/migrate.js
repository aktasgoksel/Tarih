import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { testsData } from '../src/js/data.js';

const firebaseConfig = {
    apiKey: "AIzaSyCTFhx0ozrGj-0I_12gQofynPvyuAAstD8",
    authDomain: "tarih-db7a7.firebaseapp.com",
    projectId: "tarih-db7a7",
    storageBucket: "tarih-db7a7.firebasestorage.app",
    messagingSenderId: "511484512084",
    appId: "1:511484512084:web:61bb301451bfe262e0aac1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
    console.log("Migration started...");
    let successCount = 0;
    
    try {
        for (let i = 0; i < testsData.length; i++) {
            const test = testsData[i];
            const testId = `test_${i+1}`;
            
            // Log progress
            console.log(`Uploading ${testId}: ${test.title} (${test.questions.length} questions)...`);
            
            await setDoc(doc(db, "tests", testId), {
                id: testId,
                title: test.title,
                order: i + 1,
                questions: test.questions
            });
            successCount++;
        }
        
        console.log(`Migration Complete! ${successCount} tests successfully uploaded to Firestore.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateData();
