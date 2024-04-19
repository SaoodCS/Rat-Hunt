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

   function toggleLoader(show: boolean): void {
      setShowLoader(show);
   }

   return (
      <>
         <LoaderContext.Provider value={{ showLoader, setShowLoader, toggleLoader }}>
            {children}
         </LoaderContext.Provider>
         <Loader isDisplayed={showLoader} />
      </>
   );
};
