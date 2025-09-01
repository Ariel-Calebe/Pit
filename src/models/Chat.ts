export type ChatScope = { type: "partida"; id: string } |
                        { type: "match";   id: string } |
                        { type: "dm";      players: [string,string] };

export interface ChatRoom {
  id: string;
  scope: ChatScope;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;               // playerId
  text?: string;
  attachments?: { url: string; kind: "image"|"file" }[];
  createdAt: Date;
  // Para RF18 (somente verificados): validação é feita nas Rules/Service
}

export const CHAT_ROOMS_COLLECTION = "chatRooms";
export const CHAT_MESSAGES_SUBCOLLECTION = "messages"; // /chatRooms/{roomId}/messages
