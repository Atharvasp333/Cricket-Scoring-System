import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9OsF5xRQ9kziBIzDSp-MP7BODs9rRROA",
  authDomain: "cricket-scoring-system-33fd6.firebaseapp.com",
  projectId: "cricket-scoring-system-33fd6",
  storageBucket: "cricket-scoring-system-33fd6.firebasestorage.app",
  messagingSenderId: "127423774564",
  appId: "1:127423774564:web:1b44f09683bb9863ff0471",
  measurementId: "G-WE1VR7DPSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };