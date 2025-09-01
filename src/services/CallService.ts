import { ICallRepository, CreateCallInput, ListCallsFilter } from "../interfaces/ICallRepository";

export class CallService {
  constructor(private repo: ICallRepository) {}

  async create(input: CreateCallInput) {
    if (!input.ownerUid) throw new Error("missing_ownerUid");
    if (!input.title || !input.gameId || !input.platform) throw new Error("missing_required_fields");
    if (input.slots && input.slots < 1) throw new Error("slots_invalid");
    return this.repo.create(input);
  }

  async listOpen(filter: ListCallsFilter = {}, limit = 30) {
    return this.repo.listOpen(filter, limit);
  }

  async join(callId: string, uid: string) {
    if (!uid) throw new Error("missing_uid");
    return this.repo.join(callId, uid);
  }

  async close(callId: string, ownerUid: string) {
    if (!ownerUid) throw new Error("missing_owner_uid");
    return this.repo.close(callId, ownerUid);
  }

  async get(callId: string) { return this.repo.get(callId); }
}
