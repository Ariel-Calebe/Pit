export type ParticipationRole = "owner" | "member" | "guest";

export interface Participation {
  id: string;
  partidaId: string;
  playerId: string;
  role: ParticipationRole;
  joinedAt: Date;
  leftAt?: Date;
  result?: "win"|"loss"|"draw";     // opcional para histórico RF15
  ratingGiven?: number;             // nota que o player deu (RF20)
  comment?: string;                 // comentário opcional (RF20)
}

export const PARTICIPATIONS_COLLECTION = "participations";
