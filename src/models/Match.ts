export interface Match {
  id: string;
  playerAId: string;
  playerBId: string;
  score: number;                  // compatibilidade calculada (RF16)
  createdAt: Date;
}

export const MATCHES_COLLECTION = "matches";
