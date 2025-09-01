import { v4 as uuid } from "uuid";
import { adminDb } from "../../config/firebaseAdmin";
import { CALLS_COLLECTION, Call } from "../../models/Call";
import { CreateCallInput, ICallRepository, ListCallsFilter } from "../../interfaces/ICallRepository";

export class CallRepositoryFirebase implements ICallRepository {
  async create(data: CreateCallInput): Promise<Call> {
    const id = uuid();
    const now = new Date();

    const call: Call = {
      id,
      ownerUid: data.ownerUid,
      title: data.title,
      description: data.description,
      gameId: data.gameId,
      platform: data.platform,
      skillLevel: data.skillLevel,
      objective: data.objective,
      region: data.region,
      language: data.language,
      slots: Math.max(1, data.slots),
      participants: [data.ownerUid],
      status: "open",
      createdAt: now,
      updatedAt: now
    };

    await adminDb.collection(CALLS_COLLECTION).doc(id).set(call);
    return call;
  }

  async listOpen(filter: ListCallsFilter = {}, limit = 30): Promise<Call[]> {
    let q: FirebaseFirestore.Query = adminDb.collection(CALLS_COLLECTION).where("status", "==", "open");

    if (filter.gameId)   q = q.where("gameId", "==", filter.gameId);
    if (filter.platform) q = q.where("platform", "==", filter.platform);
    if (filter.region)   q = q.where("region", "==", filter.region);
    if (filter.language) q = q.where("language", "==", filter.language);
    if (filter.skillLevel) q = q.where("skillLevel", "==", filter.skillLevel);
    if (filter.objective)  q = q.where("objective", "==", filter.objective);

    q = q.orderBy("createdAt", "desc").limit(limit);
    const snap = await q.get();
    return snap.docs.map(d => d.data() as Call);
  }

  async get(callId: string): Promise<Call | null> {
    const doc = await adminDb.collection(CALLS_COLLECTION).doc(callId).get();
    return doc.exists ? (doc.data() as Call) : null;
  }

  async join(callId: string, uid: string): Promise<Call> {
    const ref = adminDb.collection(CALLS_COLLECTION).doc(callId);

    await adminDb.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) throw new Error("call_not_found");
      const call = doc.data() as Call;

      if (call.status !== "open") throw new Error("call_closed");

      const already = call.participants.includes(uid);
      if (already) return; // nada a fazer

      if (call.participants.length >= call.slots) throw new Error("no_slots_available");

      const updated = {
        participants: [...call.participants, uid],
        updatedAt: new Date()
      };
      tx.update(ref, updated);
    });

    const after = await ref.get();
    return after.data() as Call;
  }

  async close(callId: string, ownerUid: string): Promise<Call> {
    const ref = adminDb.collection(CALLS_COLLECTION).doc(callId);

    await adminDb.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) throw new Error("call_not_found");
      const call = doc.data() as Call;

      if (call.ownerUid !== ownerUid) throw new Error("forbidden_call_owner");
      if (call.status === "closed") return;

      tx.update(ref, { status: "closed", updatedAt: new Date() });
    });

    const after = await ref.get();
    return after.data() as Call;
  }
}
