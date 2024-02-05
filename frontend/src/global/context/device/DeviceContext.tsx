import { createContext } from 'react';

interface ITopics {
   key: string;
   value: string[];
}

export interface IDeviceContext {
   isInForeground: boolean;
   topics: ITopics[];
}

export const DeviceContext = createContext<IDeviceContext>({
   isInForeground: true,
   topics: [],
});
