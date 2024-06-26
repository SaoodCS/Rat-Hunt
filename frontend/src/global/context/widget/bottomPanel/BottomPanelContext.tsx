import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

interface IBottomPanelContext {
   setBottomPanelContent: Dispatch<SetStateAction<JSX.Element>>;
   setBottomPanelHeading: Dispatch<SetStateAction<string | undefined>>;
   setBottomPanelHeightDvh: Dispatch<SetStateAction<number | undefined>>;
   bottomPanelContent: JSX.Element;
   isBottomPanelOpen: boolean;
   toggleBottomPanel: (show: boolean) => void;
}

export const BottomPanelContext = createContext<IBottomPanelContext>({
   setBottomPanelContent: () => {},
   bottomPanelContent: <></>,
   setBottomPanelHeading: () => {},
   setBottomPanelHeightDvh: () => {},
   isBottomPanelOpen: false,
   toggleBottomPanel: () => {},
});
