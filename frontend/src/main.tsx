import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import InstallAppModal from './global/components/app/installAppModal/InstallAppModal';
import GlobalConfig from './global/config/GlobalConfig';
import DeviceContextProvider from './global/context/device/DeviceContextProvider';
import ThemeContextProvider from './global/context/theme/ThemeContextProvider';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

function Root(): JSX.Element {
   return (
      <StrictMode>
         <QueryClientProvider client={GlobalConfig.queryClient}>
            <ThemeContextProvider>
               <DeviceContextProvider>
                  <InstallAppModal />
                  <App />
                  <ReactQueryDevtools initialIsOpen={false} />
               </DeviceContextProvider>
            </ThemeContextProvider>
         </QueryClientProvider>
      </StrictMode>
   );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
