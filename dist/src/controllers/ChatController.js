export class ChatController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    /** Get or create room for friends */
    getFriendRoom = async (req, res) => {
        try {
            const uid = req.uid;
            const { friendUid } = req.params;
            console.log('Getting friend room for:', uid, friendUid); // Debug log
            const room = await this.svc.getOrCreateRoom([uid, friendUid]);
            console.log('Friend room:', room); // Debug log
            if (req.headers.accept?.includes('application/json')) {
                return res.status(200).json(room);
            }
            // For EJS, redirect or render with room data
            res.redirect(`/friends?roomId=${room.id}`);
        }
        catch (e) {
            console.error('[chat_getFriendRoom_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'get_friend_room_error' });
        }
    };
    /** Get room for call */
    getCallRoom = async (req, res) => {
        try {
            const { callId } = req.params;
            const call = await this.svc.getRoomById(callId); // Assuming callId is used as roomId
            if (!call) {
                // Get call participants from CallService
                const { CallService } = await import('../services/CallService.js');
                const { CallRepositoryFirebase } = await import('../repositories/firebase/CallRepositoryFirebase.js');
                const callRepo = new CallRepositoryFirebase();
                const callSvc = new CallService(callRepo);
                const callData = await callSvc.getById(callId);
                if (!callData)
                    return res.status(404).json({ error: 'call_not_found' });
                const room = await this.svc.getCallRoom(callId, callData.participants);
                return res.status(200).json(room);
            }
            return res.status(200).json(call);
        }
        catch (e) {
            console.error('[chat_getCallRoom_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'get_call_room_error' });
        }
    };
    /** Send message */
    sendMessage = async (req, res) => {
        try {
            const uid = req.uid;
            const { roomId, text } = req.body;
            const message = await this.svc.sendMessage({ roomId, senderId: uid, text });
            return res.status(200).json(message);
        }
        catch (e) {
            console.error('[chat_sendMessage_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'send_message_error' });
        }
    };
    /** Get messages for a room */
    getMessages = async (req, res) => {
        try {
            const { roomId } = req.params;
            const limit = parseInt(req.query.limit) || 50;
            const messages = await this.svc.getMessages(roomId, limit);
            // Enrich messages with sender names
            const { adminDb } = await import('../config/firebaseAdmin.js');
            const { PLAYERS_COLLECTION } = await import('../models/Player.js');
            const senderIds = [...new Set(messages.map(m => m.senderId))];
            const senderPromises = senderIds.map(id => adminDb.collection(PLAYERS_COLLECTION).doc(id).get());
            const senderDocs = await Promise.all(senderPromises);
            const senderMap = new Map();
            senderDocs.forEach((doc, index) => {
                if (doc.exists) {
                    const data = doc.data();
                    senderMap.set(senderIds[index], data?.name || 'Usuário');
                }
            });
            const enrichedMessages = messages.map(msg => ({
                ...msg,
                senderName: senderMap.get(msg.senderId) || 'Usuário',
                senderPhotoUrl: senderDocs.find((doc, index) => {
                    if (doc.exists && senderIds[index] === msg.senderId) {
                        return doc.data()?.photoUrl;
                    }
                    return null;
                })?.data()?.photoUrl || null
            }));
            console.log('Enriched messages:', enrichedMessages); // Debug log
            return res.status(200).json(enrichedMessages);
        }
        catch (e) {
            console.error('[chat_getMessages_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'get_messages_error' });
        }
    };
}
