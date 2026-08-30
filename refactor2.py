import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

imports = """import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification, sendPasswordResetEmail, updateProfile, deleteUser, updateEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
"""

if "firebase-auth.js" not in content:
    content = content.replace('import { auth, db } from "./firebase.js";', 'import { auth, db } from "./firebase.js";\n' + imports)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)
