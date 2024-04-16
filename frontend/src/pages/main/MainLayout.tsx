import { Outlet, useLocation } from 'react-router-dom';
import BoolHelper from '../../../../shared/lib/helpers/bool/BoolHelper';
import { Body } from '../../global/components/app/layout/body/Body';
import {
   Header,
   HeaderRightElWrapper,
   HeaderSubtitleWrapper,
   StyledBackArr,
} from '../../global/components/app/layout/header/Header';
import { TextColourizer } from '../../global/components/lib/font/textColorizer/TextColourizer';
import ConditionalRender from '../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import GameContextProvider from '../../global/context/game/GameContextProvider';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import HeaderHooks from '../../global/context/widget/header/hooks/HeaderHooks';
import useHeaderContext from '../../global/context/widget/header/hooks/useHeaderContext';
import Color from '../../global/css/colors';
import GuideAndLeaveRoom from './components/GuideAndLeaveRoom';
import RoomIdBtn from './startedGame/components/roomIdBtn/RoomIdBtn';
import RouteTransitioner from '../../global/components/lib/animation/routeTransitioner/RouteTransitioner';

export default function MainLayout(): JSX.Element {
   const { isDarkTheme, isPortableDevice } = useThemeContext();
   const {
      headerTitle,
      showBackBtn,
      handleBackBtnClick,
      headerRightElement,
      headerSubtitleElement,
   } = useHeaderContext();
   const location = useLocation();
   HeaderHooks.useOnMount.setHeaderTitle('Rat Hunt');
   HeaderHooks.useOnDepChange.setHeaderRightEl(
      <GuideAndLeaveRoom currentPath={location.pathname} />,
      [location.pathname],
   );
   HeaderHooks.useOnDepChange.setHeaderSubtitleEl(
      location.pathname.includes('started') ? <RoomIdBtn /> : null,
      [location.pathname],
   );

   return (
      <RouteTransitioner>
         <GameContextProvider>
            <Header isDarkTheme={isDarkTheme}>
               <ConditionalRender condition={showBackBtn}>
                  <StyledBackArr
                     onClick={handleBackBtnClick}
                     darktheme={BoolHelper.boolToStr(isDarkTheme)}
                  />
               </ConditionalRender>
               <TextColourizer
                  color={Color.darkThm.accent}
                  fontSize={isPortableDevice ? '1.8em' : '4rem'}
               >
                  {headerTitle}
               </TextColourizer>
               <HeaderSubtitleWrapper>{headerSubtitleElement}</HeaderSubtitleWrapper>
               <HeaderRightElWrapper isDarkTheme={isDarkTheme}>
                  {headerRightElement}
               </HeaderRightElWrapper>
            </Header>
            <Body isDarkTheme={isDarkTheme}>
               <Outlet />
            </Body>
         </GameContextProvider>
      </RouteTransitioner>
   );
}
