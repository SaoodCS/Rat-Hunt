import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import {
   Header,
   HeaderRightElWrapper,
   StyledBackArr,
} from '../../global/components/app/layout/header/Header';
import { LogoText } from '../../global/components/app/logo/LogoText';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../global/context/widget/header/hooks/useHeaderContext';
import BoolHelper from '../../global/helpers/dataTypes/bool/BoolHelper';
import GameContextProvider from './context/GameContextProvider';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick, headerRightElement } = useHeaderContext();
   HeaderHooks.useOnMount.setHeaderTitle('Rat Hunt');

   return (
      <>
         <GameContextProvider>
            <Header isDarkTheme={isDarkTheme} style={{ border: '1px solid red' }}>
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
            <Body isDarkTheme={isDarkTheme} style={{ border: '1px solid red' }}>
               <Outlet />
            </Body>
         </GameContextProvider>
      </>
   );
}
