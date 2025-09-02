import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// carrega config do window.__env
const cfg = window.__env || {};
const firebaseConfig = {
  apiKey:            cfg.FIREBASE_API_KEY,
  authDomain:        cfg.FIREBASE_AUTH_DOMAIN,
  projectId:         cfg.FIREBASE_PROJECT_ID,
  storageBucket:     cfg.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: cfg.FIREBASE_MESSAGING_SENDER_ID,
  appId:             cfg.FIREBASE_APP_ID,
  measurementId:     cfg.FIREBASE_MEASUREMENT_ID
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// inicialização segura da persistência (sem top-level await)
export async function ensurePersistence() {
  try { await setPersistence(auth, browserLocalPersistence); }
  catch (e) { console.error('Auth persistence error:', e); }
}

export async function signInEmailPassword(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user.getIdToken(true);
}

export async function signUpEmailPassword(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user.getIdToken(true);
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
