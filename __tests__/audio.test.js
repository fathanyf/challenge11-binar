import Audio from '../src/pages/media/audio';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const title = 'title';
const artist = 'artist';

describe('Testing Audio Page', () => {
  test('User able to type input', () => {
    const { getByPlaceholderText } = render(<Audio />);

    const titleInputField = getByPlaceholderText(/song title.../i);
    const artistInputField = getByPlaceholderText(/Artist.../i);
    const buttonEl = screen.getByRole('button');

    fireEvent.change(titleInputField, { target: { value: title } });
    fireEvent.change(artistInputField, { target: { value: artist } });

    expect(titleInputField.value).toEqual(title);
    expect(artistInputField.value).toEqual(artist);
    expect(buttonEl).toBeEnabled();
  });
});
