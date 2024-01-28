import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type NavItems from '../../../components/app/layout/utils/navItems';

export interface IFooterContext {
   handleFooterItemSecondClick: (footerItemName: NavItems.IFooterNames) => void;
   setHandleFooterItemSecondClick: Dispatch<SetStateAction<(footerItemName: string) => void>>;
   resetFooterItemSecondClick: () => void;
}

export const FooterContext = createContext<IFooterContext>({
   handleFooterItemSecondClick: () => {},
   setHandleFooterItemSecondClick: () => {},
   resetFooterItemSecondClick: () => {},
});
