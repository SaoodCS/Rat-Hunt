import { useEffect, useRef } from 'react';
import type { SetValue } from '../../../../hooks/useSessionStorage';
import useSessionStorage from '../../../../hooks/useSessionStorage';

interface IUseCarouselReturned {
   containerRef: React.RefObject<HTMLDivElement>;
   currentSlide: number;
   setCurrentSlide: SetValue<number>;
   scrollToSlide: (slideNumber: number) => void;
   numberOfSlides: number | undefined;
}

export default function useCarousel(
   initialSlide: number,
   scrollSaverId?: string,
): IUseCarouselReturned {
   const containerRef = useRef<HTMLDivElement>(null);
   const [currentSlide, setCurrentSlide] = useSessionStorage(
      `${scrollSaverId || 'carousel'}`,
      initialSlide,
   );

   useEffect(() => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: (currentSlide - 1) * containerRef.current.offsetWidth,
            behavior: 'auto',
         });
      }
      const handleScroll = (): void => {
         if (containerRef.current) {
            const currentSlide = Math.round(
               containerRef.current.scrollLeft / containerRef.current.offsetWidth,
            );
            setCurrentSlide(currentSlide + 1);
         }
      };
      containerRef.current?.addEventListener('scroll', handleScroll);
      return () => {
         containerRef.current?.removeEventListener('scroll', handleScroll);
      };
   }, [containerRef]);

   const scrollToSlide = (slideNumber: number): void => {
      if (containerRef.current) {
         containerRef.current.scrollTo({
            left: (slideNumber - 1) * containerRef.current.offsetWidth,
            behavior: 'smooth',
         });
      }
   };

   return {
      containerRef,
      currentSlide,
      setCurrentSlide,
      scrollToSlide,
      numberOfSlides: containerRef.current?.children.length,
   };
}
