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
   toastZIndex: number;
   setToastZIndex: Dispatch<SetStateAction<number>>;
   toastTextAlign: 'left' | 'center' | 'right';
   setToastTextAlign: Dispatch<SetStateAction<'left' | 'center' | 'right'>>;
   toastType: 'info' | 'success' | 'error' | 'warning';
   setToastType: Dispatch<SetStateAction<'info' | 'success' | 'error' | 'warning'>>;
   toastDurationSecs: number;
   setToastDurationSecs: Dispatch<SetStateAction<number>>;
}

export const ToastContext = createContext<IToastContext>({
   isToastDisplayed: false,
   toggleToast: () => {},
   setToastMessage: () => {},
   setWidth: () => {},
   setVerticalPos: () => {},
   setHorizontalPos: () => {},
   toastZIndex: 99999,
   setToastZIndex: () => {},
   toastTextAlign: 'left',
   setToastTextAlign: () => {},
   toastType: 'info',
   setToastType: () => {},
   toastDurationSecs: 2,
   setToastDurationSecs: () => {},
});
