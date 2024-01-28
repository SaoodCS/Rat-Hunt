import { createContext } from 'react';
import MyCSS from '../../css/MyCSS';

export interface IThemeContext {
   isDarkTheme: boolean;
   toggleTheme: () => void;
   isPortableDevice: boolean;
}

export const ThemeContext = createContext<IThemeContext>({
   isDarkTheme: localStorage.getItem(`isDarkTheme`) === `true` || false,
   toggleTheme: () => {},
   isPortableDevice: window.innerWidth < MyCSS.PortableBp.asNum,
});
