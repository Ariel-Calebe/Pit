import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "../../serviceAccount.json";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount as any),
    });

export const adminAuth = getAuth(app);
export const adminDb   = getFirestore(app);
