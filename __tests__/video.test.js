import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideosWrapper from '../src/pages/media/video';

const title = 'title';
const artist = 'artist';

describe('Testing Video Page', () => {
    test('User able to type input', () => {
      const { getByPlaceholderText } = render(<VideosWrapper />);
  
      const titleInputField = getByPlaceholderText(/video title.../i);
      const buttonEl = screen.getByRole('button');
  
      fireEvent.change(titleInputField, { target: { value: title } });
  
      expect(titleInputField.value).toEqual(title);
      expect(buttonEl).toBeEnabled();
    })
  });