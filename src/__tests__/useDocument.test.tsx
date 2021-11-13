import { screen } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { createTestSWRFirestore } from './setup/createTestFirestore';
import { useDocument } from '../hooks/useDocument';
import { Fruit } from './setup/types';
import { deleteApp } from '@firebase/app';

function TestComponent() {
  const { data: banana } = useDocument<Fruit>('fruits/banana');
  return <p>{banana?.data()?.name}</p>;
}

describe('useDocument', () => {
  test('Can render document', async () => {
    const app = createTestSWRFirestore();
    render(<TestComponent />);
    await act(() => screen.findByText('Banana'));
    expect(screen.getByText('Banana')).toBeInTheDocument();
    await deleteApp(app);
  });
});
