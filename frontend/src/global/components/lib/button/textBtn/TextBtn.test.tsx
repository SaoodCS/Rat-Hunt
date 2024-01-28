import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { TextBtn } from './Style';

describe('TextBtn', () => {
   test('should render the text', () => {
      const { getByText } = render(<TextBtn isDarkTheme>Text</TextBtn>);
      expect(getByText('Text')).toBeTruthy();
   });
});
