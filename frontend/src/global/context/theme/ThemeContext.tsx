import { createContext } from 'react';
import { CSS_Media } from '../../css/utils/media';

export interface IThemeContext {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isPortableDevice: boolean;
}

export const ThemeContext = createContext<IThemeContext>({
   isDarkTheme: localStorage.getItem(`isDarkTheme`) === `true` || false,
   toggleTheme: () => {},
   isPortableDevice: window.innerWidth < CSS_Media.PortableBp.asNum,
});
