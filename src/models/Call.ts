export const CALLS_COLLECTION = "calls" as const;

export type Call = {
  id: string;
  ownerUid: string;
  title: string;
  description?: string;

  gameId: string;            // jogo do chamado (ex.: "valorant")
  platform: string;          // ex.: "pc", "ps", "xbox"
  skillLevel?: string;       // ex.: "casual", "ranked", "gold", etc.
  objective?: string;        // ex.: "rank up", "scrim", "daily"

  region?: string;           // ex.: "BR"
  language?: string;         // ex.: "pt"
  slots: number;             // total de vagas (inclui o dono)
  participants: string[];    // uids (owner SEMPRE está incluso)

  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
};
