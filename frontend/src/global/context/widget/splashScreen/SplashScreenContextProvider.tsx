import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import Fader from '../../../components/lib/animation/fader/Fader';
import ConditionalRender from '../../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import Device from '../../../helpers/pwa/deviceHelper';
import { SplashScreenContext } from './SplashScreenContext';

interface ISplashScreenContextProvider {
   children: ReactNode;
}

export default function SplashScreenContextProvider(
   props: ISplashScreenContextProvider,
): JSX.Element {
   const { children } = props;
   const [splashDurationSecs, setSplashDurationSecs] = useState(2);
   const [isSplashScreenDisplayed, setIsSplashScreenDisplayed] = useState(Device.isPwa());
   const [splashScreenContent, setSplashScreenContent] = useState<JSX.Element | undefined>(
      undefined,
   );

   useLayoutEffect(() => {
      if (!isSplashScreenDisplayed) return;
      const timer = setTimeout(() => {
         toggleSplashScreen(false);
      }, NumberHelper.secsToMs(splashDurationSecs));
      return () => clearTimeout(timer);
   }, [isSplashScreenDisplayed]);

   function toggleSplashScreen(show: boolean): void {
      if (show) setIsSplashScreenDisplayed(true);
      else {
         setIsSplashScreenDisplayed(false);
         setSplashScreenContent(undefined);
         setSplashDurationSecs(2);
      }
   }

   const contextMemo = useMemo(
      () => ({
         toggleSplashScreen,
         splashScreenContent,
         setSplashScreenContent,
         isSplashScreenDisplayed,
         splashDurationSecs,
         setSplashDurationSecs,
      }),
      [
         toggleSplashScreen,
         splashScreenContent,
         setSplashScreenContent,
         isSplashScreenDisplayed,
         splashDurationSecs,
         setSplashDurationSecs,
      ],
   );

   return (
      <>
         <SplashScreenContext.Provider value={contextMemo}>
            <Fader
               fadeInCondition={!isSplashScreenDisplayed}
               transitionDuration={splashDurationSecs}
               height={'100dvh'}
               width={'100dvw'}
            >
               {children}
            </Fader>
         </SplashScreenContext.Provider>
         <ConditionalRender condition={isSplashScreenDisplayed}>
            <SplashScreen component={splashScreenContent} durationSecs={splashDurationSecs} />
         </ConditionalRender>
      </>
   );
}
