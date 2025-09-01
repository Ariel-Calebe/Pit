import { Call } from "../models/Call";

export type CreateCallInput = {
  ownerUid: string;
  title: string;
  description?: string;
  gameId: string;
  platform: string;
  skillLevel?: string;
  objective?: string;
  region?: string;
  language?: string;
  slots: number;             // >= 1
};

export type ListCallsFilter = Partial<Pick<CreateCallInput,
  "gameId" | "platform" | "region" | "language" | "skillLevel" | "objective">>;

export interface ICallRepository {
  create(data: CreateCallInput): Promise<Call>;
  listOpen(filter?: ListCallsFilter, limit?: number): Promise<Call[]>;
  join(callId: string, uid: string): Promise<Call>;
  close(callId: string, ownerUid: string): Promise<Call>;
  get(callId: string): Promise<Call | null>;
}
