import { useContext, useEffect } from 'react';
import type { IFooterContext } from '../FooterContext';
import { FooterContext } from '../FooterContext';

export default class FooterHooks {
   static useFooterContext(): IFooterContext {
      const {
         handleFooterItemSecondClick,
         setHandleFooterItemSecondClick,
         resetFooterItemSecondClick,
      } = useContext(FooterContext);
      return {
         handleFooterItemSecondClick,
         setHandleFooterItemSecondClick,
         resetFooterItemSecondClick,
      };
   }

   static useOnUnMount = {
      resetFooterItemSecondClick: () => {
         const { resetFooterItemSecondClick } = FooterHooks.useFooterContext();
         useEffect(() => {
            return () => {
               resetFooterItemSecondClick();
            };
         }, []);
      },
   };

   static useOnMount = {
      setHandleFooterItemSecondClick: (handleFooterItemSecondClick: () => void) => {
         const { setHandleFooterItemSecondClick } = FooterHooks.useFooterContext();
         useEffect(() => {
            setHandleFooterItemSecondClick(handleFooterItemSecondClick);
         }, []);
      },
   };
}
