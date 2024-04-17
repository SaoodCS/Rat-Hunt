import type { ReactNode } from 'react';
import ApiErrorContextProvider from './apiError/apiErrorContextProvider';
import BottomPanelContextProvider from './bottomPanel/BottomPanelContextProvider';
import HeaderContextProvider from './header/HeaderContextProvider';
import { LoaderContextProvider } from './loader/LoaderContextProvider';
import ModalContextProvider from './modal/ModalContextProvider';
import PopupMenuContextProvider from './popupMenu/PopupMenuContextProvider';
import SplashScreenContextProvider from './splashScreen/SplashScreenContextProvider';
import ToastContextProvider from './toast/ToastContextProvider';

interface IWidgetContextProvidersProps {
   children: ReactNode;
}

export default function WidgetContextProviders(props: IWidgetContextProvidersProps): JSX.Element {
   const { children } = props;
   return (
      <LoaderContextProvider>
         <SplashScreenContextProvider>
            <ApiErrorContextProvider>
               <ToastContextProvider>
                  <ModalContextProvider>
                     <BottomPanelContextProvider>
                        <PopupMenuContextProvider>
                           <HeaderContextProvider>{children}</HeaderContextProvider>
                        </PopupMenuContextProvider>
                     </BottomPanelContextProvider>
                  </ModalContextProvider>
               </ToastContextProvider>
            </ApiErrorContextProvider>
         </SplashScreenContextProvider>
      </LoaderContextProvider>
   );
}
