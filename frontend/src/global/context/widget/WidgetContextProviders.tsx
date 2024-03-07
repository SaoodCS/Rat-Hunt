import type { ReactNode } from 'react';
import ApiErrorContextProvider from './apiError/apiErrorContextProvider';
import { BannerContextProvider } from './banner/BannerContextProvider';
import BottomPanelContextProvider from './bottomPanel/BottomPanelContextProvider';
import HeaderContextProvider from './header/HeaderContextProvider';
import { LoaderContextProvider } from './loader/LoaderContextProvider';
import ModalContextProvider from './modal/ModalContextProvider';
import PopupMenuContextProvider from './popupMenu/PopupMenuContextProvider';
import ToastContextProvider from './toast/ToastContextProvider';

interface IWidgetContextProvidersProps {
   children: ReactNode;
}

export default function WidgetContextProviders(props: IWidgetContextProvidersProps): JSX.Element {
   const { children } = props;
   return (
      <LoaderContextProvider>
         <ApiErrorContextProvider>
            <BannerContextProvider>
               <ToastContextProvider>
                  <ModalContextProvider>
                     <BottomPanelContextProvider>
                        <PopupMenuContextProvider>
                           <HeaderContextProvider>{children}</HeaderContextProvider>
                        </PopupMenuContextProvider>
                     </BottomPanelContextProvider>
                  </ModalContextProvider>
               </ToastContextProvider>
            </BannerContextProvider>
         </ApiErrorContextProvider>
      </LoaderContextProvider>
   );
}
