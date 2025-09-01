import type { Platform } from "./Game";

export type CommPref = "voice" | "text" | "both";
export type PlayStyle = "casual" | "ranked" | "competitive";

export interface Player {
  id: string;                   // docId em /players (pode = uid do Auth)
  authUid: string;              // UID do Firebase Auth
  name: string;
  email: string;
  photoUrl?: string;

  country: string;              // ISO-3166 (ex.: "BR", "US")  ← substitui região
  languages: string[];          // ex.: ["pt-BR","en"]
  platforms: Platform[];        // plataformas que possui
  favoriteGameIds: string[];    // refs p/ Game

  skillLevel?: number;          // 1..5
  playStyle?: PlayStyle;
  commPreference?: CommPref;

  availability?: {              // janelas de horário (local)
    day: "mon"|"tue"|"wed"|"thu"|"fri"|"sat"|"sun";
    start: string;              // "18:00"
    end: string;                // "22:00"
  }[];

  rating?: { avg: number; count: number };  // RF20 suporte
  verified?: boolean;           // RF18
  createdAt: Date;
  updatedAt: Date;
}

export const PLAYERS_COLLECTION = "players";
