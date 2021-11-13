import {
  query,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  getFirestore,
  QueryConstraint,
} from 'firebase/firestore';
import useSWR from 'swr';

export function useCollection<T>(
  path: string,
  ...constraints: QueryConstraint[]
) {
  const q = query(collection(getFirestore(), path), ...constraints);
  const key = JSON.stringify((q as any)._query);
  if (!key) {
    throw new Error('_query property missing - check firestore implementation');
  }
  return useSWR(JSON.stringify((q as any)._query), async () => {
    const result = await (await getDocs(q)).docs;
    return result as unknown as QueryDocumentSnapshot<T>[];
  });
}
