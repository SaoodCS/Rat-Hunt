import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type { THorizontalPos, TVerticalPos } from '../../../components/lib/toast/Toast';

interface IToastContext {
   isToastDisplayed: boolean;
   toggleToast: (show: boolean) => void;
   setToastMessage: Dispatch<SetStateAction<string>>;
   setWidth: Dispatch<SetStateAction<string>>;
   setVerticalPos: Dispatch<SetStateAction<TVerticalPos>>;
   setHorizontalPos: Dispatch<SetStateAction<THorizontalPos>>;
   toastZIndex: number | undefined;
   setToastZIndex: Dispatch<SetStateAction<number | undefined>>;
}

export const ToastContext = createContext<IToastContext>({
   isToastDisplayed: false,
   toggleToast: () => {},
   setToastMessage: () => {},
   setWidth: () => {},
   setVerticalPos: () => {},
   setHorizontalPos: () => {},
   toastZIndex: undefined,
   setToastZIndex: () => {},
});
