import { useState } from 'react';

export type SetValue<T> = (value: T) => void;
type UseLocalStorage<T> = [T, SetValue<T>];

export default function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorage<T> {
   const [storedValue, setStoredValue] = useState<T>(() => {
      try {
         const item = window.localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch (error) {
         console.error('Error retrieving data from local storage:', error);
         return initialValue;
      }
   });

   const setValue: SetValue<T> = (value) => {
      try {
         setStoredValue(value);
         window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
         console.error('Error storing data in local storage:', error);
      }
   };

   return [storedValue, setValue];
}
