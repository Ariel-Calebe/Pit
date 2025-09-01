import { IProfileRepository, ProfileUpdateInput } from "../interfaces/IProfileRepository";

export class ProfileService {
  constructor(private repo: IProfileRepository) {}

  async update(input: ProfileUpdateInput) {
    if (!input?.uid) throw new Error("uid é obrigatório");
    if (input.languages && input.languages.length === 0) {
      throw new Error("languages deve ter ao menos 1 idioma");
    }
    return this.repo.updateProfile(input);
  }

  async me(uid: string) {
    return this.repo.getByUid(uid);
  }
}
