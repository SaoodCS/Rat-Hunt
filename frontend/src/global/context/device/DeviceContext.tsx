import { createContext } from 'react';

export interface IDeviceContext {
   isInForeground: boolean;
}

export const DeviceContext = createContext<IDeviceContext>({
   isInForeground: true,
});
