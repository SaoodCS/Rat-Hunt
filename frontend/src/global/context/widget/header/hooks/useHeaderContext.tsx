import { useContext } from 'react';
import type { IHeaderContext } from '../HeaderContext';
import { HeaderContext } from '../HeaderContext';

export default function useHeaderContext(): IHeaderContext {
   const {
      headerTitle,
      setHeaderTitle,
      showBackBtn,
      setShowBackBtn,
      handleBackBtnClick,
      setHandleBackBtnClick,
      hideAndResetBackBtn,
      headerRightElement,
      setHeaderRightElement,
   } = useContext(HeaderContext);
   return {
      headerTitle,
      setHeaderTitle,
      handleBackBtnClick,
      setHandleBackBtnClick,
      showBackBtn,
      setShowBackBtn,
      hideAndResetBackBtn,
      headerRightElement,
      setHeaderRightElement,
   };
}
