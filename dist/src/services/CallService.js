export class CallService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /** Cria um novo chamado com validações */
    async create(input) {
        if (!input?.ownerUid)
            throw new Error('missing_ownerUid');
        if (!input.title || input.title.trim().length < 3)
            throw new Error('invalid_title');
        if (!input.gameId)
            throw new Error('invalid_gameId');
        if (!input.platform)
            throw new Error('invalid_platform');
        const payload = {
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
    async listOpen(limit = 20, filters) {
        if (limit <= 0)
            limit = 20;
        if (limit > 100)
            limit = 100; // limite de segurança
        return this.repo.listOpen(limit, filters);
    }
    /** Obtém um chamado por ID */
    async getById(id) {
        if (!id)
            throw new Error('missing_call_id');
        return this.repo.getById(id);
    }
    /** Entra em um chamado existente */
    async join(callId, uid) {
        if (!callId)
            throw new Error('missing_call_id');
        if (!uid)
            throw new Error('missing_uid');
        return this.repo.join(callId, uid);
    }
    /** Fecha um chamado (somente o dono pode fechar) */
    async close(callId, ownerUid) {
        if (!callId)
            throw new Error('missing_call_id');
        if (!ownerUid)
            throw new Error('missing_ownerUid');
        return this.repo.close(callId, ownerUid);
    }
    /** Remove um participante do chamado (somente o dono pode remover) */
    async removeParticipant(callId, participantUid) {
        if (!callId)
            throw new Error('missing_call_id');
        if (!participantUid)
            throw new Error('missing_participantUid');
        return this.repo.removeParticipant(callId, participantUid);
    }
}
