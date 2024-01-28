import { useEffect, useRef, useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { TransparentOverlay } from '../overlay/transparentOverlay/TransparentOverlay';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { PopupMenuWrapper } from './Style';

interface IPopupMenu {
   openerPosition: { x: number; y: number };
   isOpen: boolean;
   widthPx: number;
   heightPx: number;
   content: JSX.Element;
   onClose: () => void;
   closeOnInnerClick?: boolean;
}

export default function PopupMenu(props: IPopupMenu): JSX.Element {
   const { openerPosition, content, isOpen, widthPx, heightPx, onClose, closeOnInnerClick } = props;
   const [renderMenu, setRenderMenu] = useState(false);
   const popupMenuWrapperRef = useRef<HTMLDivElement>(null);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isOpen) {
         timeoutId = setTimeout(() => {
            setRenderMenu(false);
         }, 250);
      } else {
         setRenderMenu(true);
      }
      return () => {
         clearTimeout(timeoutId);
      };
   }, [isOpen]);

   useEffect(() => {
      function handleClick(event: MouseEvent): void {
         if (popupMenuWrapperRef.current) {
            const isOutsideClick = !popupMenuWrapperRef.current.contains(event.target as Node);
            const isInnerClick = !isOutsideClick;
            if (isOutsideClick) {
               onClose();
            }
            if (isInnerClick && closeOnInnerClick) {
               onClose();
               (event.target as HTMLElement).click();
            }
         }
      }
      document.addEventListener('mousedown', handleClick);
      return () => {
         document.removeEventListener('mousedown', handleClick);
      };
   }, [renderMenu]);

   function setLeftPos(openerPositionX: number): { num: number; worded: 'right' | 'left' } {
      const windowWidth = window.innerWidth;
      if (openerPositionX > windowWidth / 2) {
         return {
            num: openerPositionX - widthPx,
            worded: 'right',
         };
      }
      return {
         num: openerPositionX,
         worded: 'left',
      };
   }

   function setTopPos(openerPositionY: number): { num: number; worded: 'top' | 'bottom' } {
      const windowHeight = window.innerHeight;
      if (openerPositionY > windowHeight / 2) {
         return { num: openerPositionY - heightPx, worded: 'bottom' };
      }
      return { num: openerPositionY, worded: 'top' };
   }

   return (
      <ConditionalRender condition={renderMenu}>
         <TransparentOverlay zIndex={99} />
         <PopupMenuWrapper
            ref={popupMenuWrapperRef}
            topPx={setTopPos(openerPosition.y).num}
            leftPx={setLeftPos(openerPosition.x).num}
            isOpen={isOpen}
            clickPos={`${setTopPos(openerPosition.y).worded} ${
               setLeftPos(openerPosition.x).worded
            }`}
            widthPx={widthPx}
            heightPx={heightPx}
            isDarkTheme={isDarkTheme}
         >
            {content}
         </PopupMenuWrapper>
      </ConditionalRender>
   );
}
