import { contextBridge } from 'electron';

// Você pode popular process.env via script start, cross-env, ou dotenv no main.
// Para dev simples, set no terminal antes de `npm run dev`, ou crie um loader que leia .env.

contextBridge.exposeInMainWorld('__env', {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',

  FIREBASE_API_KEY:        process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN:    process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID:     process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID:         process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
});
