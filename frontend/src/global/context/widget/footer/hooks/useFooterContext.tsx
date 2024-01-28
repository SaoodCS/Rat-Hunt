import { useContext } from 'react';
import type { IFooterContext } from '../FooterContext';
import { FooterContext } from '../FooterContext';

export default function useFooterContext(): IFooterContext {
   const {
      setHandleFooterItemSecondClick,
      handleFooterItemSecondClick,
      resetFooterItemSecondClick,
   } = useContext(FooterContext);
   return {
      handleFooterItemSecondClick,
      setHandleFooterItemSecondClick,
      resetFooterItemSecondClick,
   };
}
