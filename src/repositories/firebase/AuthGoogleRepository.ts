import { IAuthRepository, LoginResult, SignUpInput } from "../../interfaces/IAuthRepository";
import { adminAuth, adminDb } from "../../config/firebaseAdmin";
import { PLAYERS_COLLECTION, Player } from "../../models/Player";

export class AuthGoogleRepository implements IAuthRepository {
  // ✅ RF11: login com Google via idToken do Firebase (validado no Admin)
  async signInWithGoogleIdToken(idToken: string): Promise<LoginResult & { isNewUser?: boolean }> {
    if (!idToken) throw new Error("missing_id_token");

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || "";
    const displayName = (decoded as any).name as string | undefined;
    const photoUrl = (decoded as any).picture as string | undefined;

    const ref = adminDb.collection(PLAYERS_COLLECTION).doc(uid);
    const snap = await ref.get();
    let isNewUser = false;

    if (!snap.exists) {
      const now = new Date();
      const player: Player = {
        id: uid,
        authUid: uid,
        email,
        name: displayName || email.split("@")[0],
        photoUrl,
        country: "BR",
        languages: ["pt"],
        favoriteGameIds: [],
        platforms: [],
        verified: false,
        createdAt: now,
        updatedAt: now
      };
      await ref.set(player);
      isNewUser = true;
    } else {
      await ref.update({
        ...(displayName && { name: displayName }),
        ...(photoUrl && { photoUrl }),
        updatedAt: new Date()
      });
    }

    return { uid, email, displayName, idToken, isNewUser };
  }

  // Métodos não usados por essa classe; apenas para satisfazer a interface:
  async signUpEmailPassword(_data: SignUpInput): Promise<Player> {
    throw new Error("not_supported_in_google_repo");
  }
  async signInWithEmail(_email: string, _password: string): Promise<LoginResult> {
    throw new Error("not_supported_in_google_repo");
  }
  async sendPasswordReset(_email: string): Promise<void> {
    throw new Error("not_supported_in_google_repo");
  }
}
