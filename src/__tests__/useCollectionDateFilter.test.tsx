import { screen } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { createTestSWRFirestore } from './setup/createTestFirestore';
import { where, Timestamp } from 'firebase/firestore';
import { useCollection } from '../hooks/useCollection';
import { Fruit } from './setup/types';
import { deleteApp } from '@firebase/app';

function TestComponent() {
  const { data: fruits } = useCollection<Fruit>('fruits', {
    constraints: [
      where(
        'createdTimestamp',
        '<',
        Timestamp.fromDate(new Date(2021, 10, 11))
      ),
      where('createdTimestamp', '>', Timestamp.fromDate(new Date(2021, 10, 9))),
    ],
  });

  return (
    <>
      {fruits?.map((fruit) => (
        <p role="fruit" key={fruit.id}>
          {fruit.data().name}
        </p>
      ))}
    </>
  );
}

describe('useCollection', () => {
  test('Can render collection', async () => {
    const app = createTestSWRFirestore();
    render(<TestComponent />);
    await act(() => screen.findByText('Banana'));
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getAllByRole('fruit').length).toBe(1);
    await deleteApp(app);
  });
});
