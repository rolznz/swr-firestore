import {
  getFirestore,
  getDoc,
  doc,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';
import React from 'react';
import useSWR from 'swr';

export type UseDocumentOptions = {
  listen?: boolean;
};

function useDocumentInternal<T>(path: string | null) {
  return useSWR(path, async () => {
    if (!path) {
      throw new Error('path is null');
    }
    const result = await getDoc(doc(getFirestore(), path));
    return result as unknown as DocumentSnapshot<T>;
  });
}

export function useDocument<T>(
  path: string | null,
  options?: UseDocumentOptions
) {
  const swr = useDocumentInternal<T>(path);
  React.useEffect(() => {
    let unsub = () => {};
    if (path && options?.listen) {
      unsub = onSnapshot(doc(getFirestore(), path), (doc) => {
        swr.mutate(doc as DocumentSnapshot<T>);
      });
    }
    return unsub;
  }, [options?.listen, path]);

  return swr;
}
