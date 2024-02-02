/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export default function useFuncState<T extends (...args: any[]) => any>(
   initialState: T | (() => T),
): [T | (() => T), (newState: T) => void] {
   const [state, setState] = useState(() => initialState);

   function setFuncState(newState: T): void {
      setState(() => newState);
   }

   return [state, setFuncState];
}
