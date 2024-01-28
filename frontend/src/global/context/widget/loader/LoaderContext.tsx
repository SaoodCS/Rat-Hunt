import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface ILoaderContext {
   showLoader: boolean;
   setShowLoader: Dispatch<SetStateAction<boolean>>;
   loaderZIndex: number | undefined;
   setLoaderZIndex: Dispatch<SetStateAction<number | undefined>>;
}

export const LoaderContext = createContext<ILoaderContext>({
   showLoader: false,
   setShowLoader: () => {},
   loaderZIndex: undefined,
   setLoaderZIndex: () => {},
});
