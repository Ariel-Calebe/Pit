import { Player } from "../models/Player";

export interface SignUpInput {
  email: string; password: string; name: string;
  country: string; languages: string[]; favoriteGameIds?: string[];
  photoUrl?: string; platforms?: string[];
}

export interface LoginResult {
  uid: string; email: string; displayName?: string; idToken: string;
}

export interface IAuthRepository {
  signUpEmailPassword(data: SignUpInput): Promise<Player>;
  signInWithEmail(email: string, password: string): Promise<LoginResult>;
  sendPasswordReset(email: string): Promise<void>;
  signOut?(): Promise<void>;

  signInWithGoogleIdToken?(idToken: string): Promise<LoginResult & { isNewUser?: boolean }>;
}
