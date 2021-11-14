require('dotenv').config();
import { initializeApp } from 'firebase/app';

export function createTestSWRFirestore() {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error('Please set a firebase config in .env');
  }
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  return initializeApp(firebaseConfig);
}
