import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTFhx0ozrGj-0I_12gQofynPvyuAAstD8",
    authDomain: "tarih-db7a7.firebaseapp.com",
    projectId: "tarih-db7a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    console.log("Checking Firestore...");
    try {
        const querySnapshot = await getDocs(collection(db, "tests"));
        console.log("Found", querySnapshot.size, "tests in Firestore.");
        process.exit(0);
    } catch(e) {
        console.error("Error reading from Firestore:", e);
        process.exit(1);
    }
}
check();
