import { onDisconnect, push, ref, set } from 'firebase/database';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import Footer from '../../global/components/app/layout/footer/Footer';
import {
   Header,
   HeaderRightElWrapper,
   StyledBackArr,
} from '../../global/components/app/layout/header/Header';
import Sidebar from '../../global/components/app/layout/sidebar/Sidebar';
import { LogoText } from '../../global/components/app/logo/LogoText';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../global/context/widget/header/hooks/useHeaderContext';
import { realtime } from '../../global/firebase/config/config';
import BoolHelper from '../../global/helpers/dataTypes/bool/BoolHelper';
import useLocalStorage from '../../global/hooks/useLocalStorage';
import PlayContextProvider from './play/context/PlayContextProvider';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick, headerRightElement } = useHeaderContext();
   HeaderHooks.useOnMount.setHeaderTitle('Rat Hunt');
   return (
      <>
         <PlayContextProvider>
            <Header isDarkTheme={isDarkTheme}>
               <ConditionalRender condition={showBackBtn}>
                  <StyledBackArr
                     onClick={handleBackBtnClick}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  />
               </ConditionalRender>
               <LogoText size={'2em'}>{headerTitle}</LogoText>
               <HeaderRightElWrapper isDarkTheme={isDarkTheme}>
                  {headerRightElement}
               </HeaderRightElWrapper>
            </Header>
            <Body isDarkTheme={isDarkTheme}>
               <Outlet />
            </Body>
            <ConditionalRender condition={!isPortableDevice}>
               <Sidebar />
            </ConditionalRender>
            <ConditionalRender condition={isPortableDevice}>
               <Footer />
            </ConditionalRender>
         </PlayContextProvider>
      </>
   );
}
