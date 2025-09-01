import { Player } from "../models/Player";
export const playerJSON = (p: Player) => ({
  id: p.id, name: p.name, email: p.email, photoUrl: p.photoUrl,
  country: p.country, languages: p.languages, favoriteGameIds: p.favoriteGameIds ?? []
});
