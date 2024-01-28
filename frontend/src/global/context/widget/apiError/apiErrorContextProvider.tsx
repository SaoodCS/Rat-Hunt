import type { ReactNode } from 'react';
import { useState } from 'react';
import { ApiErrorContext } from './apiErrorContext';

interface IApiErrorContextProvider {
   children: ReactNode;
}

export default function ApiErrorContextProvider(props: IApiErrorContextProvider): JSX.Element {
   const { children } = props;
   const [apiError, setApiError] = useState<string>('');

   return (
      <ApiErrorContext.Provider
         value={{
            apiError,
            setApiError,
         }}
      >
         {children}
      </ApiErrorContext.Provider>
   );
}
