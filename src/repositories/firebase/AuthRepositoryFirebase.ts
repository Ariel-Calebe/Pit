import { IAuthRepository, SignUpInput, LoginResult } from "../../interfaces/IAuthRepository";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Player, PLAYERS_COLLECTION } from "../../models/Player";
import { toPlatforms } from "../../util/platform";

function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== undefined)) as T;
}

export class AuthRepositoryFirebase implements IAuthRepository {
  async signUpEmailPassword(data: SignUpInput): Promise<Player> {
    const { email, password, name, photoUrl, country, languages, favoriteGameIds = [], platforms = [] } = data;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (photoUrl || name) await updateProfile(cred.user, { displayName: name, photoURL: photoUrl });

    const now = new Date();
    const player: Player = {
      id: cred.user.uid,
      authUid: cred.user.uid,
      name,
      email,
      photoUrl,
      country,
      languages,
      platforms: toPlatforms(platforms),         // << aqui
      favoriteGameIds,
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    const ref = doc(db, PLAYERS_COLLECTION, player.id);
    await setDoc(ref, { ...player, createdAt: now, updatedAt: now });

    return player;
  }

  async signInWithEmail(email: string, password: string): Promise<LoginResult> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await cred.user.getIdToken();
    return {
      uid: cred.user.uid,
      email: cred.user.email ?? email,
      displayName: cred.user.displayName ?? undefined,
      idToken
    };
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email); 
  }
}
