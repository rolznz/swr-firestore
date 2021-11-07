require('dotenv').config();
import { Fuego } from '../..';

export function createTestFuego() {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error('Please set a firebase config in .env');
  }
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  return new Fuego(firebaseConfig);
}
