import Images from '../src/pages/media/images';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const post = 'lorem ipsum...';

describe('Testing Images Page', () => {
  test('User able to type input', () => {
    const { getByPlaceholderText } = render(<Images />);

    const postInputField = getByPlaceholderText(/post a comment.../i);
    const buttonEl = screen.getByRole('button');

    fireEvent.change(postInputField, { target: { value: post } });

    expect(postInputField.value).toEqual(post);
    expect(buttonEl).toBeEnabled();
  });
});
