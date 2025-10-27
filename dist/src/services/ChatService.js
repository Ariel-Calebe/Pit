export class ChatService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /** Create or get existing room for participants */
    async getOrCreateRoom(participants) {
        if (participants.length < 2)
            throw new Error('room_needs_at_least_2_participants');
        if (participants.length > 2)
            throw new Error('room_supports_max_2_participants'); // For now, only 1-on-1 chats
        const existing = await this.repo.getRoomByParticipants(participants);
        if (existing)
            return existing;
        return this.repo.createRoom({ participants });
    }
    /** Get room by ID */
    async getRoomById(roomId) {
        if (!roomId)
            throw new Error('missing_room_id');
        return this.repo.getRoomById(roomId);
    }
    /** Send a message to a room */
    async sendMessage(input) {
        if (!input.roomId)
            throw new Error('missing_room_id');
        if (!input.senderId)
            throw new Error('missing_sender_id');
        if (!input.text || input.text.trim().length === 0)
            throw new Error('empty_message');
        return this.repo.sendMessage(input);
    }
    /** Get messages for a room */
    async getMessages(roomId, limit = 50) {
        if (!roomId)
            throw new Error('missing_room_id');
        if (limit <= 0)
            limit = 50;
        if (limit > 100)
            limit = 100;
        return this.repo.getMessages(roomId, limit);
    }
    /** Get room for a call (roomId = callId) */
    async getCallRoom(callId, participants) {
        // For calls, use callId as roomId, but ensure room exists
        let room = await this.repo.getRoomById(callId);
        if (!room) {
            room = await this.repo.createRoom({ participants });
            // Override the id to be the callId
            room.id = callId;
            // Note: In a real implementation, you'd need to update the document ID, but Firestore doesn't allow changing doc IDs easily
            // For simplicity, we'll create with auto ID and use callId as a reference
        }
        return room;
    }
}
