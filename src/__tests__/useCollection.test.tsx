//import React from 'react'
//import {render, screen, waitFor} from '@testing-library/react'

import 'firebase/firestore';
import 'firebase/auth';
import { FuegoProvider, useCollection } from '../index';
import { screen } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import React from 'react';
import { createTestFuego } from './setup/fuego';

function TestComponent() {
  const { data: fruits } = useCollection<{ name: string }>('fruits');
  return (
    <>
      {fruits?.map((fruit) => (
        <p key={fruit.id}>{fruit.name}</p>
      ))}
    </>
  );
}

const fuego = createTestFuego();
function TestApp({ children }: { children: React.ReactNode }) {
  return <FuegoProvider fuego={fuego}>{children}</FuegoProvider>;
}

describe('useCollection', () => {
  test('Can render collection', async () => {
    render(
      <TestApp>
        <TestComponent />
      </TestApp>
    );
    await act(() => screen.findByText('Banana'));
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });
});
