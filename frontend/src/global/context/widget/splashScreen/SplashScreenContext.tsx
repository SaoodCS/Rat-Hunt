import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export const SPLASHSCRN_DEFAULT_DURATION_SECS = 2;

export interface ISplashScreenContext {
   toggleSplashScreen: (show: boolean) => void;
   splashScreenContent: JSX.Element | undefined;
   setSplashScreenContent: Dispatch<SetStateAction<JSX.Element | undefined>>;
   isSplashScreenDisplayed: boolean;
   splashDurationSecs: number;
   setSplashDurationSecs: Dispatch<SetStateAction<number>>;
}

export const SplashScreenContext = createContext<ISplashScreenContext>({
   toggleSplashScreen: () => {},
   splashScreenContent: undefined,
   setSplashScreenContent: () => {},
   isSplashScreenDisplayed: false,
   splashDurationSecs: SPLASHSCRN_DEFAULT_DURATION_SECS,
   setSplashDurationSecs: () => {},
});
