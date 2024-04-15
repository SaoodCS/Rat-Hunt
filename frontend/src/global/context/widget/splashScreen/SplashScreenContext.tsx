import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export interface ISplashScreenContext {
   toggleSplashScreen: (show: boolean) => void;
   splashScreenContent: JSX.Element | undefined;
   setSplashScreenContent: Dispatch<SetStateAction<JSX.Element | undefined>>;
   isSplashScreenDisplayed: boolean;
}

export const SplashScreenContext = createContext<ISplashScreenContext>({
   toggleSplashScreen: () => {},
   splashScreenContent: undefined,
   setSplashScreenContent: () => {},
   isSplashScreenDisplayed: false,
});
