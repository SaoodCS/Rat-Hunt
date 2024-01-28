import type { ReactNode } from 'react';
import useFuncState from '../../../hooks/useFuncState';
import { FooterContext } from './FooterContext';

interface IFooterContextProvider {
   children: ReactNode;
}

export default function FooterContextProvider(props: IFooterContextProvider): JSX.Element {
   const { children } = props;
   const [handleFooterItemSecondClick, setHandleFooterItemSecondClick] = useFuncState(() => {});

   function resetFooterItemSecondClick(): void {
      setHandleFooterItemSecondClick(() => {});
   }

   return (
      <FooterContext.Provider
         value={{
            handleFooterItemSecondClick,
            setHandleFooterItemSecondClick,
            resetFooterItemSecondClick,
         }}
      >
         {children}
      </FooterContext.Provider>
   );
}
