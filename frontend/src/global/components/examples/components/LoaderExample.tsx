import { useContext, useEffect } from 'react';
import { LoaderContext } from '../../../context/widget/loader/LoaderContext';

export default function LoaderExample(): JSX.Element {
   const { setShowLoader, showLoader } = useContext(LoaderContext);

   function handleShowLoader(): void {
      setShowLoader(true);
   }

   useEffect(() => {
      if (showLoader) {
         setTimeout(() => {
            setShowLoader(false);
         }, 1000);
      }
   }, [showLoader]);

   return <button onClick={() => handleShowLoader()}>Show Loader</button>;
}
