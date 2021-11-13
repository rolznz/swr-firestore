import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Index', () => {
  test('Framework is running', async () => {
    render(<p>Hi</p>);
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });
});
