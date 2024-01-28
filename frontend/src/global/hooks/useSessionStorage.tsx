import { useState } from 'react';

export type SetValue<T> = (value: T) => void;
type UseSessionStorage<T> = [T, SetValue<T>];

export default function useSessionStorage<T>(key: string, initialValue: T): UseSessionStorage<T> {
   const [storedValue, setStoredValue] = useState<T>(() => {
      try {
         const item = window.sessionStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch (error) {
         console.error('Error retrieving data from session storage:', error);
         return initialValue;
      }
   });

   const setValue: SetValue<T> = (value) => {
      try {
         setStoredValue(value);
         window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
         console.error('Error storing data in session storage:', error);
      }
   };

   return [storedValue, setValue];
}
