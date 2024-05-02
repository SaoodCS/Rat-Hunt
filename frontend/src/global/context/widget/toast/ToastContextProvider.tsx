import type { ReactNode } from 'react';
import { useState } from 'react';
import type { THorizontalPos, TVerticalPos } from '../../../components/lib/toast/Toast';
import Toast from '../../../components/lib/toast/Toast';
import { ToastContext } from './ToastContext';

interface IToastContextProvider {
   children: ReactNode;
}

export default function ToastContextProvider(props: IToastContextProvider): JSX.Element {
   const { children } = props;
   const [isToastDisplayed, setIsToastDisplayed] = useState(false);
   const [toastMessage, setToastMessage] = useState('');
   const [width, setWidth] = useState('auto');
   const [verticalPos, setVerticalPos] = useState<TVerticalPos>('bottom');
   const [horizontalPos, setHorizontalPos] = useState<THorizontalPos>('left');
   const [toastTextAlign, setToastTextAlign] = useState<'left' | 'center' | 'right'>('left');
   const [toastType, setToastType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
   const [toastDurationSecs, setToastDurationSecs] = useState(2);

   function handleOnClose(): void {
      setIsToastDisplayed(false);
      setToastMessage('');
      setToastTextAlign('left');
      setToastType('info');
      setWidth('auto');
      setVerticalPos('bottom');
      setHorizontalPos('left');
      setToastDurationSecs(1.5);
   }

   function toggleToast(show: boolean): void {
      if (show) setIsToastDisplayed(true);
      else handleOnClose();
   }

   return (
      <>
         <ToastContext.Provider
            value={{
               isToastDisplayed,
               toggleToast,
               setToastMessage,
               setWidth,
               setVerticalPos,
               setHorizontalPos,
               toastTextAlign,
               toastType,
               setToastTextAlign,
               setToastType,
               toastDurationSecs,
               setToastDurationSecs,
            }}
         >
            {children}
         </ToastContext.Provider>
         <Toast
            message={toastMessage}
            width={width}
            horizontalPos={horizontalPos}
            verticalPos={verticalPos}
            textAlign={toastTextAlign}
            type={toastType}
            duration={toastDurationSecs}
            isDisplayed={isToastDisplayed}
            onClose={handleOnClose}
         />
      </>
   );
}
