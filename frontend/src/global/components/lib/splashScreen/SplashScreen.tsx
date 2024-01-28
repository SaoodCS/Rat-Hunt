import { useEffect, useState } from 'react';
import logo from '../../../../../resources/icons/logo-192x192.png';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Fader from '../animation/fader/Fader';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';
import { CenterWrapper } from '../positionModifiers/centerers/CenterWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { SplashScreenFooter } from './Style';

interface ISplashScreen {
   isDisplayed: boolean;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { isDisplayed } = props;
   const [renderSplashScreen, setRenderSplashScreen] = useState(isDisplayed);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined;
      if (!isDisplayed) {
         timeoutId = setTimeout(() => {
            setRenderSplashScreen(false);
         }, 1750);
      } else {
         setRenderSplashScreen(true);
      }
      return () => {
         clearTimeout(timeoutId);
      };
   }, [isDisplayed]);

   return (
      <ConditionalRender condition={renderSplashScreen}>
         <Fader fadeInCondition={isDisplayed}>
            <OpaqueOverlay isDarkTheme={isDarkTheme}>
               <CenterWrapper centerOfScreen>
                  <img src={logo} alt="Logo" width="200px" height="200px" />
               </CenterWrapper>
               <SplashScreenFooter>{'Rat Hunt'} v0.1.0</SplashScreenFooter>
            </OpaqueOverlay>
         </Fader>
      </ConditionalRender>
   );
}
