import { IProfileRepository, ProfileUpdateInput } from "../../interfaces/IProfileRepository";
import { adminDb } from "../../config/firebaseAdmin";
import { Player, PLAYERS_COLLECTION } from "../../models/Player";

export class ProfileRepositoryFirebase implements IProfileRepository {
  async updateProfile(input: ProfileUpdateInput): Promise<Player> {
    const { uid, name, country, languages, platforms, favoriteGameIds, photoUrl } = input;

    const ref  = adminDb.collection(PLAYERS_COLLECTION).doc(uid);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Player não encontrado. Faça o cadastro primeiro.");

    const updates: any = {
      ...(name !== undefined && { name }),
      ...(country !== undefined && { country }),
      ...(languages !== undefined && { languages }),
      ...(platforms !== undefined && { platforms }),
      ...(favoriteGameIds !== undefined && { favoriteGameIds }),
      ...(photoUrl !== undefined && { photoUrl }), // ✅ aceita URL externa
      updatedAt: new Date()
    };

    await ref.update(updates);
    const after = await ref.get();
    return after.data() as Player;
  }

  async getByUid(uid: string): Promise<Player | null> {
    const snap = await adminDb.collection(PLAYERS_COLLECTION).doc(uid).get();
    return snap.exists ? (snap.data() as Player) : null;
  }
}
