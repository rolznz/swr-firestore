import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { createTestSWRFirestore } from './setup/createTestFirestore';
import { useCollection } from '../hooks/useCollection';
import { Fruit } from './setup/types';
import { deleteApp } from 'firebase/app';
import { waitForSetup } from './setup/setupTests';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

function TestComponent() {
  const { data: fruits } = useCollection<Fruit>('fruits', { listen: true });

  return (
    <>
      {fruits?.map((fruit) => (
        <p key={fruit.id}>{fruit.data().name}</p>
      ))}
    </>
  );
}

describe('useCollection', () => {
  test('Can render collection', async () => {
    await waitForSetup();
    const app = createTestSWRFirestore();
    render(<TestComponent />);
    await act(() => screen.findByText('Banana'));
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Grape')).not.toBeInTheDocument();
    await act(() =>
      setDoc(doc(getFirestore(), 'fruits/grape'), {
        name: 'Grape',
        color: '#00ff00',
      })
    );
    await act(() => screen.findByText('Grape'));
    expect(screen.queryByText('Grape')).toBeInTheDocument();

    await deleteApp(app);
  });
});
