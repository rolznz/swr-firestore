import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTestFuego } from './setup/fuego';

const fuego = createTestFuego();
describe('Index', () => {
  test('Framework is running', async () => {
    render(<p>Hi</p>);
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });
  test('Can access firestore', async () => {
    const result = await fuego.db.collection('fruits').get();
    expect(result.docs.length).toBeGreaterThan(0);
  });
});
