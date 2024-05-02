import { useLayoutEffect } from 'react';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import CSS_Color from '../../../css/utils/colors';
import GradientBgLogo from '../../app/logo/gradientBgLogo/GradientBgLogo';
import ExitAnimatePresence from '../animation/exitAnimatePresence/ExitAnimatePresence';
import { SimpleAnimator } from '../animation/simpleAnimator/SimpleAnimator';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { SplashScreenFooter, SplashScreenWrapper } from './Style';

interface ISplashScreen {
   component?: JSX.Element;
   durationSecs: number;
   isDisplayed: boolean;
   onClose: () => void;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { component, durationSecs, isDisplayed, onClose } = props;
   const { isDarkTheme } = useThemeContext();

   useLayoutEffect(() => {
      if (!isDisplayed) return;
      const timer = setTimeout(() => {
         onClose();
      }, NumberHelper.secsToMs(durationSecs));
      return () => clearTimeout(timer);
   }, [isDisplayed]);

   return (
      <ExitAnimatePresence exitWhen={!isDisplayed}>
         <SimpleAnimator key="splash-screen" animateType={['fade']} duration={durationSecs / 5}>
            <SplashScreenWrapper color={isDarkTheme ? CSS_Color.darkThm.bg : CSS_Color.lightThm.bg}>
               <ConditionalRender condition={component === undefined}>
                  <FlexColumnWrapper
                     justifyContent="center"
                     alignItems="center"
                     height="100dvh"
                     width="100dvw"
                  >
                     <GradientBgLogo sizeEm={18} />
                  </FlexColumnWrapper>
                  <SplashScreenFooter>{'Rat Hunt'} v2.1.0</SplashScreenFooter>
               </ConditionalRender>
               <ConditionalRender condition={component !== undefined}>
                  {component}
               </ConditionalRender>
            </SplashScreenWrapper>
         </SimpleAnimator>
      </ExitAnimatePresence>
   );
}
