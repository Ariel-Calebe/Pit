
import type { Platform } from "./Game";

export type PartidaStatus = "open" | "filled" | "finished" | "canceled";

export interface Partida {
  id: string;
  gameId: string;               // ref Game
  ownerPlayerId: string;        // criador
  title: string;                // ex.: “Ranked duo — plat+”
  description?: string;

  country: string;              // ← no lugar de região
  language?: string;            // “pt-BR”, “en-US”…
  platform?: Platform;

  objective?: string;           // “ranked climb”, “casual”, “daily quest”
  requiredSkillMin?: number;    // filtros (RF07)
  requiredSkillMax?: number;

  scheduledAt?: Date;           // se marcada p/ um horário
  maxPlayers?: number;          // limite
  status: PartidaStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const PARTIDAS_COLLECTION = "partidas";
