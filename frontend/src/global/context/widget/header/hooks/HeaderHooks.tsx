import { useContext, useEffect } from 'react';
import type { IHeaderContext } from '../HeaderContext';
import { HeaderContext } from '../HeaderContext';

export namespace HeaderHooks {
   export function useHeaderContext(): IHeaderContext {
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
         headerSubtitleElement,
         setHeaderSubtitleElement,
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
         headerSubtitleElement,
         setHeaderSubtitleElement,
      };
   }

   export namespace useOnMount {
      export function setHeaderTitle(title: string): void {
         const { setHeaderTitle } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderTitle(title);
         }, []);
      }
      export function hideAndResetBackBtn(): void {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            hideAndResetBackBtn();
         }, []);
      }
      export function resetHeaderRightEl(): void {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderRightElement(null);
         }, []);
      }
   }

   export namespace useOnUnMount {
      export function hideAndResetBackBtn(): void {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               hideAndResetBackBtn();
            };
         }, []);
      }
      export function resetHeaderRightEl(): void {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               setHeaderRightElement(null);
            };
         }, []);
      }

      export function resetHeaderSubtitleEl(): void {
         const { setHeaderSubtitleElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            return () => {
               setHeaderSubtitleElement(null);
            };
         }, []);
      }
   }

   export namespace useOnDepChange {
      export function setHeaderTitle(title: string, deps: React.DependencyList): void {
         const { setHeaderTitle } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderTitle(title);
         }, [...deps]);
      }
      export function hideAndResetBackBtn(deps: React.DependencyList): void {
         const { hideAndResetBackBtn } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            hideAndResetBackBtn();
         }, [...deps]);
      }
      export function resetHeaderRightEl(deps: React.DependencyList): void {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderRightElement(null);
         }, [...deps]);
      }
      export function setHeaderRightEl(el: JSX.Element, deps: React.DependencyList): void {
         const { setHeaderRightElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderRightElement(el);
         }, [...deps]);
      }

      export function setHeaderSubtitleEl(
         el: JSX.Element | null,
         deps: React.DependencyList,
      ): void {
         const { setHeaderSubtitleElement } = HeaderHooks.useHeaderContext();
         useEffect(() => {
            setHeaderSubtitleElement(el);
         }, [...deps]);
      }
   }
}

export default HeaderHooks;
