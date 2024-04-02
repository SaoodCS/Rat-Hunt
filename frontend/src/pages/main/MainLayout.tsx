import { Outlet } from 'react-router-dom';
import { Body } from '../../global/components/app/layout/body/Body';
import {
   Header,
   HeaderRightElWrapper,
   StyledBackArr,
} from '../../global/components/app/layout/header/Header';
import { LogoText } from '../../global/components/app/logo/LogoText';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import GameContextProvider from '../../global/context/game/GameContextProvider';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../global/context/widget/header/hooks/useHeaderContext';
import BoolHelper from '../../../../shared/lib/helpers/bool/BoolHelper';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { headerTitle, showBackBtn, handleBackBtnClick, headerRightElement } = useHeaderContext();
   HeaderHooks.useOnMount.setHeaderTitle('Rat Hunt');
   return (
      <>
         <GameContextProvider>
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
         </GameContextProvider>
      </>
   );
}
