import { IAuthRepository, SignUpInput } from "../interfaces/IAuthRepository";
import { Player } from "../models/Player";

export class AuthService {
  constructor(private repo: IAuthRepository) {}

  async signUp(data: SignUpInput): Promise<Player> {
    if (!data.email || !data.password || !data.name) throw new Error("Dados obrigatórios ausentes");
    if (!data.country) throw new Error("country é obrigatório");
    if (!data.languages?.length) throw new Error("languages deve ter ao menos 1 idioma");
    return this.repo.signUpEmailPassword(data);
  }

  async loginWithEmail(email: string, password: string) {
    if (!email || !password) throw new Error("Email e senha são obrigatórios");
    return this.repo.signInWithEmail(email, password);
  }

  async sendResetEmail(email: string) {
    if (!email) throw new Error("Informe o e-mail");
    return this.repo.sendPasswordReset(email);
  }

  async loginWithGoogleIdToken(idToken: string) {
    if (!this.repo.signInWithGoogleIdToken) throw new Error("Google login não suportado neste repositório");
    if (!idToken) throw new Error("missing_id_token");
    return this.repo.signInWithGoogleIdToken(idToken);
  }
}
