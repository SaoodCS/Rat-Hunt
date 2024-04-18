import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import ConditionalRender from '../../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import Device from '../../../helpers/pwa/deviceHelper';
import { SplashScreenContext } from './SplashScreenContext';
import { SimpleAnimator } from '../../../components/lib/animation/simpleAnimator/SimpleAnimator';

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
            <SimpleAnimator
               animateType={['fade']}
               duration={splashDurationSecs}
               startWhen={!isSplashScreenDisplayed}
               style={{ height: '100dvh', width: '100dvw' }}
            >
               {children}
            </SimpleAnimator>
         </SplashScreenContext.Provider>
         <ConditionalRender condition={isSplashScreenDisplayed}>
            <SplashScreen component={splashScreenContent} durationSecs={splashDurationSecs} />
         </ConditionalRender>
      </>
   );
}
