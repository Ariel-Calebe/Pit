import { Player } from "../models/Player";

export type ProfileUpdateInput = {
  uid: string;
  name?: string;
  country?: string;
  languages?: string[];
  platforms?: string[];
  favoriteGameIds?: string[];
  photoUrl?: string;
};

export interface IProfileRepository {
  updateProfile(input: ProfileUpdateInput): Promise<Player>;
  getByUid(uid: string): Promise<Player | null>;
}
