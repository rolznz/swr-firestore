import {
  query,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  getFirestore,
  QueryConstraint,
  Query,
  DocumentData,
} from 'firebase/firestore';
import useSWR from 'swr';

export function useCollection<T>(
  path: string | null,
  ...constraints: QueryConstraint[]
) {
  let key = null;
  let q: Query<DocumentData> | null = null;
  if (path) {
    q = path ? query(collection(getFirestore(), path), ...constraints) : null;
    key = q ? JSON.stringify((q as any)._query) : null;
    if (!key) {
      throw new Error(
        '_query property missing - check firestore implementation'
      );
    }
  }
  return useSWR(key, async () => {
    if (!q) {
      throw new Error('query is null');
    }
    const result = await (await getDocs(q)).docs;
    return result as unknown as QueryDocumentSnapshot<T>[];
  });
}
