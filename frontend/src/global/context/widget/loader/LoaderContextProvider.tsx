import type { ReactNode } from 'react';
import { useState } from 'react';
import Loader from '../../../components/lib/loader/fullScreen/Loader';
import { LoaderContext } from './LoaderContext';
import ConditionalRender from '../../../components/lib/renderModifiers/conditionalRender/ConditionalRender';

interface ILoaderContextProvider {
   children: ReactNode;
}

export const LoaderContextProvider = (props: ILoaderContextProvider): JSX.Element => {
   const { children } = props;
   const [showLoader, setShowLoader] = useState(false);

   return (
      <>
         <LoaderContext.Provider value={{ showLoader, setShowLoader }}>
            {children}
         </LoaderContext.Provider>
         <ConditionalRender condition={showLoader}>
            <Loader />
         </ConditionalRender>
      </>
   );
};
