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
   const [toastZIndex, setToastZIndex] = useState<number | undefined>(undefined);

   function handleOnClose(): void {
      setToastMessage('');
      setIsToastDisplayed(false);
      setToastZIndex(undefined);
   }

   function toggleToast(show: boolean): void {
      if (show) setIsToastDisplayed(true);
      else setIsToastDisplayed(true);
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
               toastZIndex,
               setToastZIndex,
            }}
         >
            {children}
         </ToastContext.Provider>
         <Toast
            message={toastMessage}
            isVisible={isToastDisplayed}
            onClose={handleOnClose}
            width={width}
            horizontalPos={horizontalPos}
            verticalPos={verticalPos}
            zIndex={toastZIndex}
         />
      </>
   );
}
