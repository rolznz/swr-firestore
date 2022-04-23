import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { createTestSWRFirestore } from './setup/createTestFirestore';
import { useDocument } from '../hooks/useDocument';
import { Fruit } from './setup/types';
import { deleteApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { waitForSetup } from './setup/setupTests';

function TestComponent() {
  const { data: apple } = useDocument<Fruit>('fruits/apple', { listen: true });
  console.log('Rendered apple with color: ', apple?.data()?.color);
  return <p>{apple?.data()?.color}</p>;
}

describe('useDocument', () => {
  test('Can render document', async () => {
    await waitForSetup();
    const app = createTestSWRFirestore();
    //await updateDoc(doc(getFirestore(), 'fruits/apple'), { color: '#ff0000' });
    render(<TestComponent />);
    await act(() => screen.findByText('#ff0000'));
    expect(screen.getByText('#ff0000')).toBeInTheDocument();

    await act(() =>
      updateDoc(doc(getFirestore(), 'fruits/apple'), { color: '#ff5500' })
    );

    await act(() => screen.findByText('#ff5500'));
    expect(screen.getByText('#ff5500')).toBeInTheDocument();

    await deleteApp(app);
  });
});
