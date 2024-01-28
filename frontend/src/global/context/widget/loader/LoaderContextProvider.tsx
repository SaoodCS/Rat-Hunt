import type { ReactNode } from 'react';
import { useState } from 'react';
import Loader from '../../../components/lib/loader/fullScreen/Loader';
import { LoaderContext } from './LoaderContext';

interface ILoaderContextProvider {
   children: ReactNode;
}

export const LoaderContextProvider = (props: ILoaderContextProvider): JSX.Element => {
   const { children } = props;
   const [showLoader, setShowLoader] = useState(false);
   const [loaderZIndex, setLoaderZIndex] = useState<number | undefined>(undefined);

   return (
      <>
         <LoaderContext.Provider
            value={{ showLoader, setShowLoader, loaderZIndex, setLoaderZIndex }}
         >
            {children}
         </LoaderContext.Provider>
         <Loader isDisplayed={showLoader} zIndex={loaderZIndex} />
      </>
   );
};
