// src/repositories/firebase/ChatRepositoryFirebase.ts
import { adminDb } from '../../config/firebaseAdmin.js';
import { randomUUID } from 'node:crypto';
import { CHAT_ROOMS_COLLECTION, CHAT_MESSAGES_SUBCOLLECTION } from '../../models/Chat.js';
export class ChatRepositoryFirebase {
    roomsCol = adminDb.collection(CHAT_ROOMS_COLLECTION);
    async createRoom(input) {
        // Check if room already exists for these participants
        const existing = await this.getRoomByParticipants(input.participants);
        if (existing)
            return existing;
        const id = randomUUID();
        const now = new Date();
        const room = {
            id,
            participants: input.participants.sort(), // Sort for consistent ordering
            createdAt: now,
        };
        await this.roomsCol.doc(id).set(room);
        return room;
    }
    async getRoomById(roomId) {
        const doc = await this.roomsCol.doc(roomId).get();
        return doc.exists ? doc.data() : null;
    }
    async getRoomByParticipants(participants) {
        const sortedParticipants = participants.sort();
        const snap = await this.roomsCol
            .where('participants', '==', sortedParticipants)
            .limit(1)
            .get();
        if (snap.empty)
            return null;
        return snap.docs[0].data();
    }
    async sendMessage(input) {
        const id = randomUUID();
        const now = new Date();
        const message = {
            id,
            roomId: input.roomId,
            senderId: input.senderId,
            text: input.text.trim(),
            createdAt: now,
        };
        await this.roomsCol.doc(input.roomId).collection(CHAT_MESSAGES_SUBCOLLECTION).doc(id).set(message);
        return message;
    }
    async getMessages(roomId, limit = 50) {
        const snap = await this.roomsCol
            .doc(roomId)
            .collection(CHAT_MESSAGES_SUBCOLLECTION)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        return snap.docs.map(doc => doc.data()).reverse(); // Reverse to get chronological order
    }
}
