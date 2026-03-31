import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0223758374",
  appId: "1:338780758217:web:2a5be3531b2b71423ded18",
  apiKey: "AIzaSyBNkgkOWnouUBb4PNxXoHsa0lb181w_Esg",
  authDomain: "gen-lang-client-0223758374.firebaseapp.com",
  storageBucket: "gen-lang-client-0223758374.firebasestorage.app",
  messagingSenderId: "338780758217"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
