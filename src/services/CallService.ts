// src/services/CallService.ts
import { ICallRepository, CreateCallInput, Call } from '../repositories/firebase/CallRepositoryFirebase.js';
import { ListOpenFilters } from '../interfaces/ICallRepository.js';

export class CallService {
  constructor(private readonly repo: ICallRepository) {}

  /** Cria um novo chamado com validações */
  async create(input: CreateCallInput): Promise<Call> {
    if (!input?.ownerUid) throw new Error('missing_ownerUid');
    if (!input.title || input.title.trim().length < 3) throw new Error('invalid_title');
    if (!input.gameId) throw new Error('invalid_gameId');
    if (!input.platform) throw new Error('invalid_platform');

    const payload: CreateCallInput = {
      ownerUid: input.ownerUid,
      title: input.title.trim(),
      gameId: String(input.gameId).trim().toLowerCase(),
      platform: String(input.platform).trim().toLowerCase(),
      callFriendly: input.callFriendly,
      playstyles: input.playstyles,
    };

    return this.repo.create(payload);
  }

  /** Lista chamados abertos (máximo de 20 por vez, por padrão) */
  async listOpen(limit = 20, filters?: ListOpenFilters): Promise<Call[]> {
    if (limit <= 0) limit = 20;
    if (limit > 100) limit = 100; // limite de segurança
    return this.repo.listOpen(limit, filters);
  }

  /** Obtém um chamado por ID */
  async getById(id: string): Promise<Call | null> {
    if (!id) throw new Error('missing_call_id');
    return this.repo.getById(id);
  }

  /** Entra em um chamado existente */
  async join(callId: string, uid: string): Promise<Call> {
    if (!callId) throw new Error('missing_call_id');
    if (!uid) throw new Error('missing_uid');
    return this.repo.join(callId, uid);
  }

  /** Fecha um chamado (somente o dono pode fechar) */
  async close(callId: string, ownerUid: string): Promise<Call> {
    if (!callId) throw new Error('missing_call_id');
    if (!ownerUid) throw new Error('missing_ownerUid');
    return this.repo.close(callId, ownerUid);
  }

  /** Remove um participante do chamado (somente o dono pode remover) */
  async removeParticipant(callId: string, participantUid: string): Promise<Call> {
    if (!callId) throw new Error('missing_call_id');
    if (!participantUid) throw new Error('missing_participantUid');
    return this.repo.removeParticipant(callId, participantUid);
  }
}
