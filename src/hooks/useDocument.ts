import {
  getFirestore,
  getDoc,
  doc,
  DocumentSnapshot,
} from 'firebase/firestore';
import useSWR from 'swr';

export function useDocument<T>(path: string) {
  return useSWR(path, async () => {
    const result = await getDoc(doc(getFirestore(), path));
    return result as unknown as DocumentSnapshot<T>;
  });
}
