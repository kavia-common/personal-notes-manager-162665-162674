import { render, screen } from '@testing-library/react';
import App from './App';

test('renders topbar and buttons', () => {
  render(<App />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
});
