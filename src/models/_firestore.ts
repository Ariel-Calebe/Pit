import { FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore";

export function firestoreConverter<T extends object>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: WithFieldValue<T>) { return modelObject as T; },
    fromFirestore(snapshot: QueryDocumentSnapshot) { return snapshot.data() as T; }
  };
}
