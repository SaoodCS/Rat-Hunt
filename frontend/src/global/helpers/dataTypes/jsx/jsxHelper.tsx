/* eslint-disable @typescript-eslint/naming-convention */
import { Fragment } from 'react';

export default class JSXHelper {
   static hasScrolledToBottom(elementId: string): boolean {
      const element = document.getElementById(`${elementId}`);
      if (element) {
         const { scrollTop, scrollHeight, clientHeight } = element;
         const reachedBottomOfDiv = scrollTop + clientHeight >= scrollHeight;
         return reachedBottomOfDiv;
      }
      console.error(`Internal Error: No element with Id: ${elementId} found.`);
      return false;
   }

   static repeatJSX(element: JSX.Element, times: number): JSX.Element[] {
      return Array.from({ length: times }, (_, index) => (
         <Fragment key={index}>{element}</Fragment>
      ));
   }

   static getClickPos(
      event: React.MouseEvent<HTMLButtonElement | HTMLDivElement | SVGSVGElement, MouseEvent>,
   ): {
      x: number;
      y: number;
   } {
      const clickX = event.pageX;
      const clickY = event.pageY;
      return { x: clickX, y: clickY };
   }

   static scrollToTop(elementId: string): void {
      const element = document.getElementById(`${elementId}`);
      if (element) {
         element.scrollTop = 0;
      }
   }

   static scrollToLeft(elementId: string): void {
      const element = document.getElementById(`${elementId}`);
      if (element) {
         element.scrollLeft = 0;
      }
   }
}
