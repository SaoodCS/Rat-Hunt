import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface ILoaderContext {
   showLoader: boolean;
   setShowLoader: Dispatch<SetStateAction<boolean>>;
   toggleLoader: (show: boolean) => void;
}

export const LoaderContext = createContext<ILoaderContext>({
   showLoader: false,
   setShowLoader: () => {},
   toggleLoader: () => {},
});
