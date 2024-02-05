import { doc, onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/config/config';
import { DeviceContext } from './DeviceContext';

interface IDeviceContextProvider {
   children: ReactNode;
}

export default function DeviceContextProvider(props: IDeviceContextProvider): JSX.Element {
   const { children } = props;
   const [isInForeground, setIsInForeground] = useState(true);
   const [topics, setTopics] = useState([]);

   useEffect(() => {
      const handleVisibilityChange = (): void => {
         setIsInForeground(!document.hidden);
      };
      window.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
         window.removeEventListener('visibilitychange', handleVisibilityChange);
      };
   }, []);

   return (
      <DeviceContext.Provider
         value={{
            isInForeground,
            topics,
         }}
      >
         {children}
      </DeviceContext.Provider>
   );
}
