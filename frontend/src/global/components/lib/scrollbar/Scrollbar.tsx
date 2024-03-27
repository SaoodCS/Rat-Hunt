import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChildrenContainer, RelativePositioner, ScrollbarContainer, ScrollbarThumb } from './Style';
import useScrollFader from '../../../hooks/useScrollFader';

interface IScrollBarIOSProps {
   children: ReactNode;
   scrollbarWidth?: number;
   withFader?: boolean;
}

export default function Scrollbar(props: IScrollBarIOSProps): JSX.Element {
   const { children, scrollbarWidth = 10, withFader = false } = props;
   const [divHeight, setDivHeight] = useState<number>(0);
   const [scrollHeight, setScrollHeight] = useState<number>(0);
   const [scrollPosition, setScrollPosition] = useState<number>(0);
   const [showScrollbar, setShowScrollbar] = useState<boolean>(false);
   const [thumbHeight, setThumbHeight] = useState<number>(
      divHeight > scrollHeight ? divHeight : (divHeight / scrollHeight) * divHeight,
   );
   const scrollRef = useRef<HTMLDivElement>(null);
   const { faderElRef, handleScroll } = useScrollFader([], 1);

   useEffect(() => {
      console.log(`scroll height: ${scrollHeight}`);
      console.log(`div height: ${divHeight}`);
      console.log(`scroll position: ${scrollPosition}`);
   }, [divHeight, scrollHeight, scrollPosition]);

   useEffect(() => {
      setThumbHeight(divHeight > scrollHeight ? divHeight : (divHeight / scrollHeight) * divHeight);
   }, [divHeight, scrollHeight]);

   useEffect(() => {
      setShowScrollbar(divHeight < scrollHeight);
   }, [scrollHeight, divHeight]);

   useEffect(() => {
      const elRef = withFader ? faderElRef : scrollRef;
      const handleResize = (): void => {
         if (!elRef.current) return;
         const { clientHeight, scrollHeight } = elRef.current;
         setDivHeight(clientHeight);
         setScrollHeight(scrollHeight);
      };
      const handleScroll = (): void => {
         if (!elRef.current) return;
         const { scrollTop, scrollHeight } = elRef.current;
         setScrollPosition(scrollTop);
         setScrollHeight(scrollHeight);
      };
      handleResize();
      handleScroll();
      if (elRef.current) {
         elRef.current.addEventListener('scroll', handleScroll);
         elRef.current.addEventListener('resize', handleResize);
         window.addEventListener('resize', handleResize);
      }
      return (): void => {
         if (elRef.current) {
            elRef.current.removeEventListener('scroll', handleScroll);
            elRef.current.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', handleResize);
         }
      };
   }, []);

   function onThumbPress(
      e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
   ): void {
      e.preventDefault();
      const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const startScrollPosition = scrollPosition;
      const handleMove = (e: MouseEvent | TouchEvent): void => {
         const diff = ('touches' in e ? e.touches[0].clientY : e.clientY) - startY;
         const scrollDiff = (diff / divHeight) * scrollHeight;
         const elRef = withFader ? faderElRef : scrollRef;
         if (!elRef.current) return;
         elRef.current.scrollTop = startScrollPosition + scrollDiff;
      };
      const moveEventType = 'touches' in e ? 'touchmove' : 'mousemove';
      const upEventType = 'touches' in e ? 'touchend' : 'mouseup';
      const handleUp = (): void => {
         window.removeEventListener(moveEventType, handleMove);
         window.removeEventListener(upEventType, handleUp);
      };
      window.addEventListener(moveEventType, handleMove);
      window.addEventListener(upEventType, handleUp);
   }

   return (
      <RelativePositioner>
         <ChildrenContainer
            ref={withFader ? faderElRef : scrollRef}
            onScroll={withFader ? handleScroll : undefined}
            scrollbarWidth={scrollbarWidth}
            showScrollbar={showScrollbar}
         >
            {children}
         </ChildrenContainer>
         <ScrollbarContainer scrollbarWidth={scrollbarWidth} showScrollbar={showScrollbar} />
         <ScrollbarThumb
            divHeight={divHeight}
            scrollHeight={scrollHeight}
            scrollPosition={scrollPosition}
            thumbHeight={thumbHeight}
            scrollbarWidth={scrollbarWidth}
            showScrollbar={showScrollbar}
            onMouseDown={onThumbPress}
            onTouchStart={onThumbPress}
         />
      </RelativePositioner>
   );
}
