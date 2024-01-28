import { useContext } from 'react';
import { ToastContext } from '../../../context/widget/toast/ToastContext';

export default function ToastExample(): JSX.Element {
   const { toggleToast, setToastMessage } = useContext(ToastContext);
   function handleShowToast(): void {
      toggleToast(true);
      setToastMessage('This is a test toast message');
   }

   return <button onClick={() => handleShowToast()}>Show Toast Example</button>;
}
