import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../src/pages/auth/signin';

describe('Home', () => {
  it('renders a sign in', () => {
    render(<SignIn />);

    const button = screen.getByRole('button', {
      name: 'Sign In',
    });

    expect(button).toBeInTheDocument();
  }),
    it('renders a signin input user email', () => {
      render(<SignIn />);

      const emailInputEl = screen.getByPlaceholderText('email');

      expect(emailInputEl).toBeInTheDocument();
    }),
    it('renders a signin inpur user password', () => {
      render(<SignIn />);

      const passwordInputEl = screen.getByPlaceholderText('password');

      expect(passwordInputEl).toBeInTheDocument();
    }),
    it('email input should change', () => {
      render(<SignIn />);

      const emailInputEl = screen.getByPlaceholderText('email');
      const testValue = 'test';

      fireEvent.change(emailInputEl, { target: { value: testValue } });
      expect(emailInputEl.value).toBe('testValue');
    }),
    it('password input should change', () => {
      render(<SignIn />);

      const passwordInputEl = screen.getByPlaceholderText('password');
      const testValue = 'test';

      fireEvent.change(passwordInputEl, { target: { value: testValue } });
      expect(passwordInputEl.value).toBe(testValue);
    });
});
