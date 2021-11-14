import {
  getFirestore,
  getDoc,
  doc,
  DocumentSnapshot,
} from 'firebase/firestore';
import useSWR from 'swr';

export function useDocument<T>(path: string | null) {
  return useSWR(path, async () => {
    if (!path) {
      throw new Error('path is null');
    }
    const result = await getDoc(doc(getFirestore(), path));
    return result as unknown as DocumentSnapshot<T>;
  });
}
