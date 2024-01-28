import { useContext } from 'react';
import type { IThemeContext } from '../ThemeContext';
import { ThemeContext } from '../ThemeContext';

export default function useThemeContext(): IThemeContext {
   const { isDarkTheme, toggleTheme, isPortableDevice } = useContext(ThemeContext);

   return { isDarkTheme, toggleTheme, isPortableDevice };
}
