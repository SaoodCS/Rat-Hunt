import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChildrenContainer, RelativePositioner, ScrollbarContainer, ScrollbarThumb } from './Style';

const FADING_GRADIENT = 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';

interface IScrollBarIOSProps {
   children: ReactNode;
   scrollbarWidth?: number;
   withFader?: boolean;
   offset?: number;
   dependencies?: unknown[]; // Any dynamic data from an api call should be passed through into the dependency array as e.g. [data]
   hideScrollbar?: boolean;
}

export default function Scrollbar(props: IScrollBarIOSProps): JSX.Element {
   const {
      children,
      scrollbarWidth = 8,
      withFader = false,
      offset = 1,
      dependencies,
      hideScrollbar = false,
   } = props;
   const [divHeight, setDivHeight] = useState<number>(0);
   const [scrollHeight, setScrollHeight] = useState<number>(0);
   const [scrollPosition, setScrollPosition] = useState<number>(0);
   const [showScrollbar, setShowScrollbar] = useState<boolean>(!hideScrollbar);
   const [thumbHeight, setThumbHeight] = useState<number>(0);
   const scrollRef = useRef<HTMLDivElement>(null);
   const wrapperRef = useRef<HTMLDivElement>(null);
   const [parentHeight, setParentHeight] = useState<number | undefined>(undefined);

   useEffect(() => {
      setShowScrollbar(!hideScrollbar);
   }, [hideScrollbar]);

   useEffect(() => {
      const el = wrapperRef.current;
      const parent = el?.parentElement;
      if (parent) setParentHeight(parent.clientHeight);
   }, [...(dependencies || []), parentHeight]);

   useEffect(() => {
      setThumbHeight(divHeight > scrollHeight ? divHeight : (divHeight / scrollHeight) * divHeight);
   }, [divHeight, scrollHeight]);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const element = entries[0].target as HTMLDivElement;
         const isScrollable = element.scrollHeight > element.clientHeight + offset;
         setDivHeight(element.clientHeight);
         setScrollHeight(element.scrollHeight);
         setShowScrollbar(isScrollable && !hideScrollbar);
         if (!withFader) return;
         const maskImage = !isScrollable ? 'none' : FADING_GRADIENT;
         element.style.maskImage = maskImage;
      });
      if (scrollRef.current) {
         resizeObserver.observe(scrollRef.current);
      }
      return (): void => {
         resizeObserver.disconnect();
      };
   }, [...(dependencies || []), scrollRef.current]);

   function onThumbPress(
      e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
   ): void {
      const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const startScrollPosition = scrollPosition;
      const handleMove = (e: MouseEvent | TouchEvent): void => {
         const diff = ('touches' in e ? e.touches[0].clientY : e.clientY) - startY;
         const scrollDiff = (diff / divHeight) * scrollHeight;
         if (!scrollRef.current) return;
         scrollRef.current.scrollTop = startScrollPosition + scrollDiff;
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

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      e.preventDefault();
      const target = e.target as HTMLDivElement;
      setScrollPosition(target.scrollTop);
      if (!withFader) return;
      const { scrollTop, clientHeight } = target;
      const reachedBottom = scrollTop + clientHeight >= target.scrollHeight - offset;
      target.style.maskImage = reachedBottom ? 'none' : FADING_GRADIENT;
   }

   return (
      <RelativePositioner style={{ height: parentHeight }} ref={wrapperRef}>
         <ChildrenContainer
            ref={scrollRef}
            onScroll={handleScroll}
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
