import {
  getFirestore,
  getDoc,
  doc,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { log } from '../utils/log';

export type UseDocumentOptions = {
  listen?: boolean;
};

function useDocumentInternal<T>(path: string | null) {
  const { cache, compare } = useSWRConfig();
  const fetcher = React.useCallback(async () => {
    if (!path) {
      throw new Error('path is null');
    }
    log('fetch document start', path);
    let result = await getDoc(doc(getFirestore(), path));
    const cachedValue = cache.get(path) as typeof result;
    const isSame = compare(result.data(), cachedValue?.data());
    log('fetch document end', path, isSame);
    if (isSame) {
      // return cached object to not trigger a re-render
      result = cachedValue;
    }

    return result as unknown as DocumentSnapshot<T>;
  }, [path, cache, compare]);

  return useSWR(path, fetcher);
}

export function useDocument<T>(
  path: string | null,
  options?: UseDocumentOptions
) {
  const { cache, compare } = useSWRConfig();
  const swr = useDocumentInternal<T>(path);
  const swrMutate = swr.mutate;
  React.useEffect(() => {
    let unsub = () => {};
    if (path && options?.listen) {
      unsub = onSnapshot(doc(getFirestore(), path), (doc) => {
        const cachedValue = cache.get(path) as typeof doc;
        const isSame = compare(doc.data(), cachedValue?.data());
        log('document onSnapshot', path, isSame);
        if (!isSame) {
          // only update the document if the data actually changed
          swrMutate(doc as DocumentSnapshot<T>, false);
        }
      });
    }
    return unsub;
  }, [options?.listen, path, cache, compare, swrMutate]);

  return swr;
}
