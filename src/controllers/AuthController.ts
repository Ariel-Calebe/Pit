import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private svc: AuthService) {}

  // POST /auth/signup
  signUp = async (req: Request, res: Response) => {
    try {
      const player = await this.svc.signUp(req.body);
      res.status(201).json(player);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao cadastrar" });
    }
  };

  // POST /auth/login
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const session = await this.svc.loginWithEmail(email, password);
      res.status(200).json(session);
    } catch (e: any) {
      res.status(401).json({ error: e.message ?? "Credenciais inválidas" });
    }
  };

  // POST /auth/reset-password
  resetPassword = async (req: Request, res: Response) => {
    try {
      await this.svc.sendResetEmail(req.body.email);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e?.code || e?.message || "auth/unknown" });
    }
  };

  // ✅ POST /auth/google { idToken }
  googleLogin = async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      const session = await this.svc.loginWithGoogleIdToken(idToken);
      res.status(200).json(session); // { uid, email, displayName?, idToken, isNewUser? }
    } catch (e: any) {
      res.status(401).json({ error: e?.code || e?.message || "auth/invalid-google-token" });
    }
  };
}
