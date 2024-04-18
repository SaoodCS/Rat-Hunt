import { useEffect, useRef } from 'react';

export default function useOnOutsideClick(onOutsideClick: () => void): {
   outsideClickRef: React.RefObject<HTMLDivElement>;
} {
   const outsideClickRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClick = (e: MouseEvent): void => {
         if (outsideClickRef.current && !outsideClickRef.current.contains(e.target as Node)) {
            onOutsideClick();
         }
      };
      document.addEventListener('mousedown', handleClick);
      return () => {
         document.removeEventListener('mousedown', handleClick);
      };
   }, [onOutsideClick]);

   return { outsideClickRef };
}
