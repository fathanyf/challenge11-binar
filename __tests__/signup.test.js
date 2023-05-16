import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../src/pages/auth/signup';

describe('Home', () => {
  it('renders a sign in', () => {
    render(<SignUp />);

    const button = screen.getByRole('button', {
      name: 'Sign Up',
    });

    expect(button).toBeInTheDocument();
  }),
    it('renders a signin input user email', () => {
      render(<SignUp />);

      const emailInputEl = screen.getByPlaceholderText('your email...');

      expect(emailInputEl).toBeInTheDocument();
    }),
    it('renders a signin inpur user password', () => {
      render(<SignUp />);

      const passwordInputEl = screen.getByPlaceholderText(
        'make your password...'
      );

      expect(passwordInputEl).toBeInTheDocument();
    }),
    it('email input should change', () => {
      render(<SignUp />);

      const emailInputEl = screen.getByPlaceholderText('your email...');
      const testValue = 'test';
      fireEvent.change(emailInputEl, { target: { value: testValue } });
      expect(emailInputEl.value).toBe(testValue);
    }),
    it('password input should change', () => {
      render(<SignUp />);

      const passwordInputEl = screen.getByPlaceholderText(
        'make your password...'
      );
      const testValue = 'test';
      fireEvent.change(passwordInputEl, { target: { value: testValue } });
      expect(passwordInputEl.value).toBe('test value');
    });
});
