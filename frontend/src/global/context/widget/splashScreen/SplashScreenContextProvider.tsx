import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import SplashScreen from '../../../components/lib/splashScreen/SplashScreen';
import Device from '../../../helpers/pwa/deviceHelper';
import { SPLASHSCRN_DEFAULT_DURATION_SECS, SplashScreenContext } from './SplashScreenContext';
import { SimpleAnimator } from '../../../components/lib/animation/simpleAnimator/SimpleAnimator';

interface ISplashScreenContextProvider {
   children: ReactNode;
}

export default function SplashScreenContextProvider(
   props: ISplashScreenContextProvider,
): JSX.Element {
   const { children } = props;
   const [splashDurationSecs, setSplashDurationSecs] = useState(SPLASHSCRN_DEFAULT_DURATION_SECS);
   const [isSplashScreenDisplayed, setIsSplashScreenDisplayed] = useState(Device.isPwa());
   const [splashScreenContent, setSplashScreenContent] = useState<JSX.Element | undefined>(
      undefined,
   );

   function toggleSplashScreen(show: boolean): void {
      if (show) setIsSplashScreenDisplayed(true);
      else handleOnClose();
   }

   function handleOnClose(): void {
      setIsSplashScreenDisplayed(false);
      setSplashScreenContent(undefined);
      setSplashDurationSecs(SPLASHSCRN_DEFAULT_DURATION_SECS);
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
               key="splashScreenContent"
               animateType={['fade']}
               duration={0.5}
               startWhen={!isSplashScreenDisplayed}
               style={{ height: '100dvh', width: '100dvw' }}
            >
               {children}
            </SimpleAnimator>
         </SplashScreenContext.Provider>
         <SplashScreen
            component={splashScreenContent}
            durationSecs={splashDurationSecs}
            isDisplayed={isSplashScreenDisplayed}
            onClose={handleOnClose}
         />
      </>
   );
}
