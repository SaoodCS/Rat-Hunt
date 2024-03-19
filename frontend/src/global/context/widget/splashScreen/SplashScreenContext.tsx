import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export interface ISplashScreenContext {
   toggleSplashScreen: (show: boolean) => void;
   splashScreenContent: JSX.Element;
   setSplashScreenContent: Dispatch<SetStateAction<JSX.Element>>;
   isSplashScreenDisplayed: boolean;
}

export const SplashScreenContext = createContext<ISplashScreenContext>({
   toggleSplashScreen: () => {},
   splashScreenContent: <></>,
   setSplashScreenContent: () => {},
   isSplashScreenDisplayed: false,
});
