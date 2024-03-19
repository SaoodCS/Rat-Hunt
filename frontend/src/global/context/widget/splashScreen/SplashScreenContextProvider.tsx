import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import { SplashScreenContext } from './SplashScreenContext';

interface ISplashScreenContextProvider {
   children: ReactNode;
}

export default function SplashScreenContextProvider(
   props: ISplashScreenContextProvider,
): JSX.Element {
   const { children } = props;
   const [isSplashScreenDisplayed, setIsSplashScreenDisplayed] = useState(false);
   const [splashScreenContent, setSplashScreenContent] = useState<JSX.Element>(<></>);

   useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (isSplashScreenDisplayed) {
         timer = setTimeout(() => setIsSplashScreenDisplayed(false), 3000);
      } else {
         timer && clearTimeout(timer);
      }
      return () => {
         timer && clearTimeout(timer);
      };
   }, [isSplashScreenDisplayed]);

   function handleCloseSplashScreen(): void {
      setIsSplashScreenDisplayed(false);
      setSplashScreenContent(<></>);
   }

   function toggleSplashScreen(show: boolean): void {
      if (show) setIsSplashScreenDisplayed(true);
      else handleCloseSplashScreen();
   }

   const contextMemo = useMemo(
      () => ({
         toggleSplashScreen,
         splashScreenContent,
         setSplashScreenContent,
         isSplashScreenDisplayed,
      }),
      [toggleSplashScreen, splashScreenContent, setSplashScreenContent, isSplashScreenDisplayed],
   );

   return (
      <>
         <SplashScreenContext.Provider value={contextMemo}>{children}</SplashScreenContext.Provider>
         <SplashScreen isDisplayed={isSplashScreenDisplayed} component={splashScreenContent} />
      </>
   );
}
