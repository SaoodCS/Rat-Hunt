import { useEffect, useRef } from 'react';

interface IuseScrollFader {
   faderElRef: React.RefObject<HTMLDivElement>;
   handleScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

export default function useScrollFader<T extends unknown[] = unknown[]>(
   dependencies?: T,
   offset?: number,
): IuseScrollFader {
   const faderElRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const faderElement = entries[0].target as HTMLDivElement;
         const maskImage =
            faderElement.scrollHeight <= faderElement.clientHeight + (offset || 1)
               ? 'none'
               : 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
         faderElement.style.maskImage = maskImage;
      });
      if (faderElRef.current) {
         resizeObserver.observe(faderElRef.current);
      }
      return () => {
         resizeObserver.disconnect();
      };
   }, [...(dependencies || []), faderElRef.current]);

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      const faderElement = e.target as HTMLDivElement;
      const scrollTop = faderElement.scrollTop;
      if (scrollTop + faderElement.clientHeight >= faderElement.scrollHeight - (offset || 1)) {
         faderElement.style.maskImage = 'none';
      } else {
         faderElement.style.maskImage =
            'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
      }
   }

   return { faderElRef, handleScroll };
}
