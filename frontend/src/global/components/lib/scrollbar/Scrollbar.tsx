import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChildrenContainer, RelativePositioner, ScrollbarContainer, ScrollbarThumb } from './Style';

interface IScrollBarIOSProps {
   children: ReactNode;
   scrollbarWidth?: number;
}

export default function Scrollbar(props: IScrollBarIOSProps): JSX.Element {
   const { children, scrollbarWidth } = props;
   const [divHeight, setDivHeight] = useState<number>(0);
   const [scrollHeight, setScrollHeight] = useState<number>(0);
   const [scrollPosition, setScrollPosition] = useState<number>(0);
   const [showScrollbar, setShowScrollbar] = useState<boolean>(false);
   const [thumbHeight, setThumbHeight] = useState<number>(
      divHeight > scrollHeight ? divHeight : (divHeight / scrollHeight) * divHeight,
   );
   const scrollRef = useRef<HTMLDivElement>(null);

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
      const handleResize = (): void => {
         if (!scrollRef.current) return;
         const { clientHeight, scrollHeight } = scrollRef.current;
         setDivHeight(clientHeight);
         setScrollHeight(scrollHeight);
      };
      const handleScroll = (): void => {
         if (!scrollRef.current) return;
         const { scrollTop, scrollHeight } = scrollRef.current;
         setScrollPosition(scrollTop);
         setScrollHeight(scrollHeight);
      };
      handleResize();
      handleScroll();
      if (scrollRef.current) {
         scrollRef.current.addEventListener('scroll', handleScroll);
         scrollRef.current.addEventListener('resize', handleResize);
         window.addEventListener('resize', handleResize);
      }
      return (): void => {
         if (scrollRef.current) {
            scrollRef.current.removeEventListener('scroll', handleScroll);
            scrollRef.current.removeEventListener('resize', handleResize);
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
         scrollRef.current!.scrollTop = startScrollPosition + scrollDiff;
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
            ref={scrollRef}
            scrollbarWidth={scrollbarWidth || 10}
            showScrollbar={showScrollbar}
         >
            {children}
         </ChildrenContainer>
         <ScrollbarContainer scrollbarWidth={scrollbarWidth || 10} showScrollbar={showScrollbar} />
         <ScrollbarThumb
            divHeight={divHeight}
            scrollHeight={scrollHeight}
            scrollPosition={scrollPosition}
            thumbHeight={thumbHeight}
            scrollbarWidth={scrollbarWidth || 10}
            showScrollbar={showScrollbar}
            onMouseDown={onThumbPress}
            onTouchStart={onThumbPress}
         />
      </RelativePositioner>
   );
}
