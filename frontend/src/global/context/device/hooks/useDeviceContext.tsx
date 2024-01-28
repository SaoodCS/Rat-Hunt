import { useContext } from 'react';
import type { IDeviceContext } from '../DeviceContext';
import { DeviceContext } from '../DeviceContext';

export default function useDeviceContext(): IDeviceContext {
   const { isInForeground } = useContext(DeviceContext);
   return { isInForeground };
}
