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
import { useSWRConfig } from 'swr';

export type UseCollectionOptions = {
  constraints: QueryConstraint[];
};

export function useCollection<T>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const { mutate } = useSWRConfig();
  let key = null;
  let collectionQuery: Query<DocumentData> | null = null;
  if (path) {
    collectionQuery = path
      ? query(collection(getFirestore(), path), ...(options?.constraints ?? []))
      : null;
    key = collectionQuery
      ? JSON.stringify((collectionQuery as any)._query)
      : null;
    if (!key) {
      throw new Error(
        '_query property missing - check firestore implementation'
      );
    }
  }
  return useSWR(key, async () => {
    if (!collectionQuery) {
      throw new Error('query is null');
    }
    const result = await (await getDocs(collectionQuery)).docs;
    result.forEach((doc) => {
      mutate(doc.ref.path, doc, false);
    });

    return result as unknown as QueryDocumentSnapshot<T>[];
  });
}
