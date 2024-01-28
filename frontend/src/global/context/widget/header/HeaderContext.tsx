import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export interface IHeaderContext {
   headerTitle: string;
   setHeaderTitle: React.Dispatch<React.SetStateAction<string>>;
   showBackBtn: boolean;
   setShowBackBtn: React.Dispatch<React.SetStateAction<boolean>>;
   handleBackBtnClick: () => void;
   setHandleBackBtnClick: Dispatch<SetStateAction<() => void>>;
   hideAndResetBackBtn: () => void;
   headerRightElement: JSX.Element | null;
   setHeaderRightElement: Dispatch<SetStateAction<JSX.Element | null>>;
}

export const HeaderContext = createContext<IHeaderContext>({
   headerTitle: '',
   setHeaderTitle: () => {},
   showBackBtn: false,
   setShowBackBtn: () => {},
   handleBackBtnClick: () => {},
   setHandleBackBtnClick: () => {},
   hideAndResetBackBtn: () => {},
   headerRightElement: null,
   setHeaderRightElement: () => {},
});
