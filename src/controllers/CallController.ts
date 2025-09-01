import { Request, Response } from "express";
import { CallService } from "../services/CallService";

export class CallController {
  constructor(private svc: CallService) {}

  // POST /calls  (cria um chamado)
  create = async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid; // do requireAuth
      const call = await this.svc.create({ ownerUid: uid, ...req.body });
      res.status(201).json(call);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || "create_call_error" });
    }
  };

  // GET /calls  (lista abertos com filtros opcionais)
  listOpen = async (req: Request, res: Response) => {
    try {
      const { gameId, platform, region, language, skillLevel, objective, limit } = req.query as any;
      const calls = await this.svc.listOpen(
        { gameId, platform, region, language, skillLevel, objective },
        limit ? Number(limit) : 30
      );
      res.status(200).json(calls);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || "list_calls_error" });
    }
  };

  // POST /calls/:id/join
  join = async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid;
      const call = await this.svc.join(req.params.id, uid);
      res.status(200).json(call);
    } catch (e: any) {
      const code = e?.message || "join_error";
      const http = code === "no_slots_available" ? 409
                 : code === "call_closed" ? 409
                 : code === "call_not_found" ? 404
                 : 400;
      res.status(http).json({ error: code });
    }
  };

  // POST /calls/:id/close
  close = async (req: Request, res: Response) => {
    try {
      const ownerUid = (req as any).uid;
      const call = await this.svc.close(req.params.id, ownerUid);
      res.status(200).json(call);
    } catch (e: any) {
      const code = e?.message || "close_error";
      const http = code === "forbidden_call_owner" ? 403
                 : code === "call_not_found" ? 404
                 : 400;
      res.status(http).json({ error: code });
    }
  };

  // GET /calls/:id
  get = async (req: Request, res: Response) => {
    try {
      const call = await this.svc.get(req.params.id);
      if (!call) return res.status(404).json({ error: "call_not_found" });
      res.status(200).json(call);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || "get_call_error" });
    }
  };
}
