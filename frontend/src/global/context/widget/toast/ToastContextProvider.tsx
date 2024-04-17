import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { THorizontalPos, TVerticalPos } from '../../../components/lib/toast/Toast';
import Toast from '../../../components/lib/toast/Toast';
import { ToastContext } from './ToastContext';
import ConditionalRender from '../../../components/lib/renderModifiers/conditionalRender/ConditionalRender';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';

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
   const [toastZIndex, setToastZIndex] = useState<number>(99999);
   const [toastTextAlign, setToastTextAlign] = useState<'left' | 'center' | 'right'>('left');
   const [toastType, setToastType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
   const [toastDurationSecs, setToastDurationSecs] = useState(2);

   useEffect(() => {
      if (!isToastDisplayed) return;
      const timeout = setTimeout(() => {
         handleOnClose();
      }, NumberHelper.secsToMs(toastDurationSecs));
      return () => clearTimeout(timeout);
   }, [isToastDisplayed]);

   function handleOnClose(): void {
      setIsToastDisplayed(false);
      setToastMessage('');
      setToastZIndex(99999);
      setToastTextAlign('left');
      setToastType('info');
      setWidth('auto');
      setVerticalPos('bottom');
      setHorizontalPos('left');
      setToastDurationSecs(2);
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
               toastZIndex,
               setToastZIndex,
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
         <ConditionalRender condition={isToastDisplayed}>
            <Toast
               message={toastMessage}
               width={width}
               horizontalPos={horizontalPos}
               verticalPos={verticalPos}
               zIndex={toastZIndex}
               textAlign={toastTextAlign}
               type={toastType}
               duration={toastDurationSecs}
            />
         </ConditionalRender>
      </>
   );
}
