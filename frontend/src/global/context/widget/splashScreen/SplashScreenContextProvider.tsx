import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import Device from '../../../helpers/pwa/deviceHelper';
import { SplashScreenContext } from './SplashScreenContext';
import Fader from '../../../components/lib/animation/fader/Fader';

interface ISplashScreenContextProvider {
   children: ReactNode;
}

export default function SplashScreenContextProvider(
   props: ISplashScreenContextProvider,
): JSX.Element {
   const { children } = props;
   const [isSplashScreenDisplayed, setIsSplashScreenDisplayed] = useState(Device.isPwa());
   const [splashScreenContent, setSplashScreenContent] = useState<JSX.Element | undefined>(
      undefined,
   );

   useLayoutEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      if (isSplashScreenDisplayed) {
         timer = setTimeout(() => {
            toggleSplashScreen(false);
         }, NumberHelper.secsToMs(2));
      } else {
         timer && clearTimeout(timer);
      }
      return () => {
         timer && clearTimeout(timer);
      };
   }, [isSplashScreenDisplayed]);

   function toggleSplashScreen(show: boolean): void {
      if (show) setIsSplashScreenDisplayed(true);
      else {
         setIsSplashScreenDisplayed(false);
         setSplashScreenContent(undefined);
      }
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
         <SplashScreenContext.Provider value={contextMemo}>
            <Fader fadeInCondition={!isSplashScreenDisplayed}>{children}</Fader>
         </SplashScreenContext.Provider>
         <SplashScreen isDisplayed={isSplashScreenDisplayed} component={splashScreenContent} />
      </>
   );
}
