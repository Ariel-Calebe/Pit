import { Request, Response } from "express";
import { PlayersService } from "../services/PlayersService";
import { playerPublicJSON } from "../views/playerPublicView";

export class PlayersController {
  constructor(private svc: PlayersService) {}

  // GET /players/:id
  getById = async (req: Request, res: Response) => {
    try {
      const uid = req.params.id;
      const player = await this.svc.getPublicById(uid);
      if (!player) return res.status(404).json({ error: "not_found" });
      return res.status(200).json(playerPublicJSON(player));
    } catch (e: any) {
      return res.status(400).json({ error: e?.message || "get_player_error" });
    }
  };
}
