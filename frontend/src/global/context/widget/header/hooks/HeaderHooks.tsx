import { useContext, useEffect } from 'react';
import type { IHeaderContext } from '../HeaderContext';
import { HeaderContext } from '../HeaderContext';

export default class HeaderHooks {
   static useHeaderContext(): IHeaderContext {
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
         showBackBtn,
         setShowBackBtn,
         handleBackBtnClick,
         setHandleBackBtnClick,
         hideAndResetBackBtn,
         headerRightElement,
         setHeaderRightElement,
      };
   }

   static useOnMount = {
      setHeaderTitle: (title: string) => {
         const { setHeaderTitle } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderTitle(title);
         }, []);
      },
      hideAndResetBackBtn: () => {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            hideAndResetBackBtn();
         }, []);
      },
      resetHeaderRightEl: () => {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderRightElement(null);
         }, []);
      },
   };

   static useOnUnMount = {
      hideAndResetBackBtn: () => {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               hideAndResetBackBtn();
            };
         }, []);
      },
      resetHeaderRightEl: () => {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               setHeaderRightElement(null);
            };
         }, []);
      },
   };
}
