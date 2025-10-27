// src/config/firebaseAdmin.ts
import admin from 'firebase-admin';
import { env } from './env.js';

// Decodifica o JSON da service account (vindo do .env em Base64)
const serviceAccountJson = Buffer.from(
  env.firebase.serviceAccountBase64,
  'base64'
).toString('utf8');
const serviceAccount = JSON.parse(serviceAccountJson);

// Inicializa o Firebase Admin **uma única vez**
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: env.firebase.projectId,
    storageBucket: `${env.firebase.projectId}.appspot.com`,
  });

  // Firestore: ignora campos undefined em todos os sets/updates
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

// Exports das instâncias
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminBucket = admin.storage().bucket();

console.log('✅ Firebase Admin conectado com sucesso');
