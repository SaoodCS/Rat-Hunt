import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { GlobalTheme } from '../../css/theme/theme';
import CSS_Color from '../../css/utils/colors';
import { CSS_Media } from '../../css/utils/media';
import Device from '../../helpers/pwa/deviceHelper';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ThemeContext } from './ThemeContext';

interface IThemeContextProvider {
   children: ReactNode;
}

export default function ThemeContextProvider(props: IThemeContextProvider): JSX.Element {
   const { children } = props;
   const [isDarkTheme, setIsDarkTheme] = useLocalStorage(`isDarkTheme`, Device.isSystemDarkTheme());
   const [isPortableDevice, setIsPortableDevice] = useState<boolean>(
      window.innerWidth < CSS_Media.PortableBp.asNum,
   );

   useEffect(() => {
      const handleResize = (): void =>
         setIsPortableDevice(window.innerWidth < CSS_Media.PortableBp.asNum);
      window.addEventListener(`resize`, handleResize);
      return () => {
         window.removeEventListener(`resize`, handleResize);
      };
   }, []);

   useLayoutEffect(() => {
      const metaThemeColor = document.querySelector(`meta[name=theme-color]`);
      if (metaThemeColor) {
         metaThemeColor.setAttribute(
            `content`,
            isDarkTheme ? CSS_Color.darkThm.bg : CSS_Color.lightThm.bg,
         );
      }
   }, [isDarkTheme]);

   const contextMemo = useMemo(
      () => ({
         isDarkTheme,
         toggleTheme: () => setIsDarkTheme(!isDarkTheme),
         isPortableDevice,
      }),
      [isDarkTheme, isPortableDevice],
   );

   return (
      <>
         <ThemeContext.Provider value={contextMemo}>
            <GlobalTheme darkTheme={isDarkTheme} />
            {children}
         </ThemeContext.Provider>
      </>
   );
}
