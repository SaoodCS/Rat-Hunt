import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext } from 'react';

export type IBannerType = 'success' | 'error' | 'warning' | 'default';

interface IBannerContext {
   isBannerDisplayed: boolean;
   bannerMessage: string;
   setBannerMessage: Dispatch<SetStateAction<string>>;
   setHandleBannerClick: Dispatch<SetStateAction<() => void>>;
   setBannerIcon: Dispatch<SetStateAction<ReactNode>>;
   setBannerHeightEm: Dispatch<SetStateAction<number>>;
   bannerZIndex: number | undefined;
   setBannerZIndex: Dispatch<SetStateAction<number | undefined>>;
   setBannerType: Dispatch<SetStateAction<IBannerType>>;
   toggleBanner: (show: boolean) => void;
}

export const BannerContext = createContext<IBannerContext>({
   isBannerDisplayed: false,
   bannerMessage: '',
   setBannerMessage: () => {},
   setHandleBannerClick: () => {},
   setBannerIcon: () => {},
   setBannerHeightEm: () => {},
   bannerZIndex: undefined,
   setBannerZIndex: () => {},
   setBannerType: () => {},
   toggleBanner: () => {},
});
