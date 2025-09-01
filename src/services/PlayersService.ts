import { IProfileRepository } from "../interfaces/IProfileRepository";
import { Player } from "../models/Player";

export class PlayersService {
  constructor(private repo: IProfileRepository) {}
  async getPublicById(uid: string): Promise<Player | null> {
    return this.repo.getByUid(uid);
  }
}
