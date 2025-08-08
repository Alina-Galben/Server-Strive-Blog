import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page title', () => {
  render(<App />);
  const headingElement = screen.getByText(/Benvenuto sullo Strive Blog!/i);
  expect(headingElement).toBeInTheDocument();
});
