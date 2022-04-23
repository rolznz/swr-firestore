import {
  query,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  getFirestore,
  QueryConstraint,
  Query,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore';
import React from 'react';
import useSWR from 'swr';
import { useSWRConfig } from 'swr';

export type UseCollectionOptions = {
  constraints?: QueryConstraint[];
  listen?: boolean;
};

function useCollectionInternal<T>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const { mutate } = useSWRConfig();
  let key = null;
  const collectionQuery = getCollectionQuery(path, options);
  if (collectionQuery) {
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

export function useCollection<T>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const swr = useCollectionInternal<T>(path, options);
  React.useEffect(() => {
    let unsub = () => {};
    if (path && options?.listen) {
      const collectionQuery = getCollectionQuery(path, options);
      if (collectionQuery) {
        unsub = onSnapshot(collectionQuery, (querySnapshot) => {
          swr.mutate(querySnapshot.docs as QueryDocumentSnapshot<T>[]);
        });
      }
    }
    return unsub;
  }, [options, path]);

  return swr;
}

function getCollectionQuery(
  path: string | null,
  options: UseCollectionOptions | undefined
) {
  let collectionQuery: Query<DocumentData> | null = null;
  if (path) {
    collectionQuery = path
      ? query(collection(getFirestore(), path), ...(options?.constraints ?? []))
      : null;
  }
  return collectionQuery;
}
