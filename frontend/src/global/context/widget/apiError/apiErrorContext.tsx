import { createContext } from 'react';

export interface IApiErrorContext {
   apiError: string;
   setApiError: React.Dispatch<React.SetStateAction<string>>;
}

export const ApiErrorContext = createContext<IApiErrorContext>({
   apiError: '',
   setApiError: () => {},
});
