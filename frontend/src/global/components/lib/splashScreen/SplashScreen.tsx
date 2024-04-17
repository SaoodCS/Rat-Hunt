import { useEffect, useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Fader from '../animation/fader/Fader';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { SplashScreenFooter } from './Style';
import GradientBgLogo from '../../app/logo/gradientBgLogo/GradientBgLogo';

interface ISplashScreen {
   isDisplayed: boolean;
   component?: JSX.Element;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { isDisplayed, component } = props;
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
               <ConditionalRender condition={component === undefined}>
                  <FlexColumnWrapper
                     justifyContent="center"
                     alignItems="center"
                     height="100dvh"
                     width="100dvw"
                  >
                     <GradientBgLogo sizeEm={18} />
                  </FlexColumnWrapper>
                  <SplashScreenFooter>{'Rat Hunt'} v0.1.0</SplashScreenFooter>
               </ConditionalRender>
               <ConditionalRender condition={component !== undefined}>
                  {component}
               </ConditionalRender>
            </OpaqueOverlay>
         </Fader>
      </ConditionalRender>
   );
}
