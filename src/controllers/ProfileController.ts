import { Request, Response } from "express";
import { ProfileService } from "../services/ProfileService";

export class ProfileController {
  constructor(private svc: ProfileService) {}

  // POST /profile/setup  (configurar/editar perfil)
  setup = async (req: Request, res: Response) => {
    try {
      const tokenUid = (req as any).uid; // uid do idToken validado
      if (!tokenUid) return res.status(401).json({ error: "missing_token_uid" });
      if (req.body.uid && req.body.uid !== tokenUid) {
        return res.status(403).json({ error: "forbidden_uid_mismatch" });
      }
      req.body.uid = tokenUid; // força UID do token
      const player = await this.svc.update(req.body);
      return res.status(200).json(player);
    } catch (e: any) {
      console.error("Erro no setup:", e);
      return res.status(400).json({ error: e?.message || "Erro ao configurar perfil" });
    }
  };

  // GET /profile/me  (retorna o perfil do usuário autenticado)
  me = async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      if (!uid) return res.status(401).json({ error: "missing_token_uid" });
      const player = await this.svc.me(uid);
      if (!player) return res.status(404).json({ error: "not_found" });
      return res.status(200).json(player);
    } catch (e: any) {
      console.error("Erro no me:", e);
      return res.status(400).json({ error: e?.message || "Erro ao buscar perfil" });
    }
  };
}
