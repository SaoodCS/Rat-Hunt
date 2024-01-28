import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { HeaderContext } from './HeaderContext';
import useFuncState from '../../../hooks/useFuncState';

interface IHeaderContextProvider {
   children: ReactNode;
}

export default function HeaderContextProvider(props: IHeaderContextProvider): JSX.Element {
   const { children } = props;
   const [headerTitle, setHeaderTitle] = useState<string>('');
   const [handleBackBtnClick, setHandleBackBtnClick] = useFuncState(() => null);
   const [showBackBtn, setShowBackBtn] = useState<boolean>(false);
   const [headerRightElement, setHeaderRightElement] = useState<JSX.Element | null>(null);

   function hideAndResetBackBtn(): void {
      setShowBackBtn(false);
      setHandleBackBtnClick(() => null);
   }

   useEffect(() => {
      const backBtnClickVal = handleBackBtnClick?.toString();
      if (backBtnClickVal && !backBtnClickVal.includes('null')) setShowBackBtn(true);
   }, [handleBackBtnClick]);

   return (
      <HeaderContext.Provider
         value={{
            headerTitle,
            setHeaderTitle,
            showBackBtn,
            setShowBackBtn,
            handleBackBtnClick,
            setHandleBackBtnClick,
            hideAndResetBackBtn,
            headerRightElement,
            setHeaderRightElement,
         }}
      >
         {children}
      </HeaderContext.Provider>
   );
}
