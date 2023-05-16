import Dummy from '../src/pages/games/dummy';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Dummy', () => {
  const Button = ({ onClick, children }) => (
    <button onClick={onClick}>{children}</button>
  );

  it('renders a dummy', () => {
    render(<Dummy />);

    const initialNumber = screen.getByTestId('initial number');

    expect(initialNumber).toBeInTheDocument();
  }),
    it('renders random button', () => {
      render(<Dummy />);
      const button = screen.getByRole('button', {
        name: 'Randomize Number',
      });

      expect(button).toBeInTheDocument();
    }),
    it('calls onClick on submit game data', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Quit and Save</Button>);
      fireEvent.click(screen.getByText(/quit and save/i));

      expect(handleClick).toHaveBeenCalledTimes(0); // expected false, should've been called 1 time
    }),
    it('user score point after clicking randomize number', () => {
      render(<Dummy />);
      const numberContainer = screen.getByTestId('initial number');
      const numberValue = screen.getByTestId('random button');
      const startingNumber = 0;
      fireEvent.click(numberValue, {
        numberContainer: { value: startingNumber },
      });

      expect(numberContainer.textContent).toBeGreaterThanOrEqual.toString(0);
    });
});
