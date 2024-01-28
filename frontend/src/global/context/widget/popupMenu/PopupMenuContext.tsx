import { createContext } from 'react';

interface IPopupMenuContext {
   togglePM: (show: boolean) => void;
   setPMWidthPx: React.Dispatch<React.SetStateAction<number>>;
   setPMHeightPx: React.Dispatch<React.SetStateAction<number>>;
   setPMContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
   setClickEvent: React.Dispatch<
      React.SetStateAction<
         React.MouseEvent<HTMLButtonElement | HTMLDivElement | SVGSVGElement, MouseEvent>
      >
   >;
   setCloseOnInnerClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PopupMenuContext = createContext<IPopupMenuContext>({
   togglePM: () => {},
   setPMWidthPx: () => {},
   setPMHeightPx: () => {},
   setPMContent: () => {},
   setClickEvent: () => {},
   setCloseOnInnerClick: () => {},
});
