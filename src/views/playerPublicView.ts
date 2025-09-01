import { Player } from "../models/Player";

export const playerPublicJSON = (p: Player) => ({
  id: p.id,
  name: p.name,
  photoUrl: p.photoUrl ?? null,
  country: p.country,
  languages: p.languages ?? [],
  platforms: p.platforms ?? [],
  favoriteGameIds: p.favoriteGameIds ?? [],
  playStyle: p.playStyle ?? null,
  commPreference: p.commPreference ?? null,
  skillLevel: p.skillLevel ?? null,
  rating: p.rating ?? null,
});
