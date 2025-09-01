export type Platform = "pc" | "xbox" | "playstation" | "switch" | "mobile";

export interface Game {
  id: string;
  name: string;
  platforms: Platform[];        // em quais plataformas o jogo existe
  genres?: string[];            // opcional (fps, moba…)
  createdAt: Date;
  updatedAt: Date;
}

export const GAMES_COLLECTION = "games";
