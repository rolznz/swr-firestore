import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { deleteApp } from 'firebase/app';
import {
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { createTestSWRFirestore } from './createTestFirestore';

let setupFinished = false;

(async () => {
  const app = createTestSWRFirestore();

  await deleteDoc(doc(getFirestore(), 'fruits/grape'));

  await setDoc(doc(getFirestore(), 'fruits/banana'), {
    name: 'Banana',
    color: '#ffff00',
    createdTimestamp: Timestamp.fromDate(new Date('2021-11-10')),
  });
  await setDoc(doc(getFirestore(), 'fruits/apple'), {
    name: 'Apple',
    color: '#ff0000',
  });

  await deleteApp(app);
  setupFinished = true;
})();

export async function waitForSetup() {
  while (!setupFinished) {
    console.log('Waiting for setup to complete');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
