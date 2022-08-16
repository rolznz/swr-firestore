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
  DocumentSnapshot,
} from 'firebase/firestore';
import React from 'react';
import useSWR, { useSWRConfig, Cache } from 'swr';
import { ScopedMutator } from 'swr/dist/types';
import { log } from '../utils/log';

export type UseCollectionOptions = {
  constraints?: QueryConstraint[];
  listen?: boolean;
};

function useCollectionInternal<T>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const { cache, compare, mutate } = useSWRConfig();
  const collectionQuery = getCollectionQuery(path, options);
  const key = getCollectionQueryKey(collectionQuery);

  const fetcher = React.useCallback(async () => {
    if (!collectionQuery) {
      throw new Error('query is null');
    }
    log('fetch collection start', key);
    let result = await (await getDocs(collectionQuery)).docs;
    const cachedValue = cache.get(key) as typeof result;
    const isSame = compare(
      result.map((doc) => doc.data()),
      cachedValue?.map((doc) => doc.data())
    );
    log('fetch collection end', key, isSame);
    if (isSame) {
      // return cached object to not trigger a re-render
      result = cachedValue;
    } else {
      // only update the individual documents that actually changed
      updateDocuments(result, cache, compare, mutate);
    }

    return result as unknown as QueryDocumentSnapshot<T>[];
  }, []);

  return useSWR(key, fetcher);
}

export function useCollection<T>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const { cache, compare, mutate } = useSWRConfig();
  const swr = useCollectionInternal<T>(path, options);
  React.useEffect(() => {
    let unsub = () => {};
    if (path && options?.listen) {
      const collectionQuery = getCollectionQuery(path, options);
      if (collectionQuery) {
        unsub = onSnapshot(collectionQuery, (querySnapshot) => {
          // only update if the collection data actually changed
          const key = getCollectionQueryKey(collectionQuery);
          const cachedValue = cache.get(key) as typeof querySnapshot.docs;
          const isSame = compare(
            querySnapshot.docs.map((doc) => doc.data()),
            cachedValue?.map((doc) => doc.data())
          );
          log('collection onSnapshot', path, isSame);
          if (!isSame) {
            swr.mutate(querySnapshot.docs as QueryDocumentSnapshot<T>[], false);
            // only update the individual documents that actually changed
            updateDocuments(querySnapshot.docs, cache, compare, mutate);
          }
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
function getCollectionQueryKey(collectionQuery: Query<DocumentData> | null) {
  let key: string | null = null;
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
  return key;
}

function updateDocuments(
  result: QueryDocumentSnapshot<DocumentData>[],
  cache: Cache<any>,
  compare: (a: any, b: any) => boolean,
  mutate: ScopedMutator<undefined>
) {
  result.forEach((doc) => {
    const cachedValue = cache.get(
      doc.ref.path
    ) as DocumentSnapshot<DocumentData>;
    const isSame = compare(doc.data(), cachedValue?.data());
    log('fetch collection - update single document', doc.ref.path, isSame);
    if (!isSame) {
      mutate(doc.ref.path, doc, false);
    }
  });
}
