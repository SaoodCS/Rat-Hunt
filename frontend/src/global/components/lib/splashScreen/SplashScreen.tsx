import { useEffect, useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { LogoText } from '../../app/logo/LogoText';
import RatExterminationLogo from '../../app/logo/RatExterminationLogo';
import Fader from '../animation/fader/Fader';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
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
               <FlexColumnWrapper
                  justifyContent="center"
                  alignItems="center"
                  height="100dvh"
                  width="100dvw"
               >
                  <LogoText size={'4.5em'} style={{ marginBottom: '0.25em' }}>
                     RAT HUNT
                  </LogoText>
                  <RatExterminationLogo size="16em" />
               </FlexColumnWrapper>
               <SplashScreenFooter>{'Rat Hunt'} v0.1.0</SplashScreenFooter>
            </OpaqueOverlay>
         </Fader>
      </ConditionalRender>
   );
}
