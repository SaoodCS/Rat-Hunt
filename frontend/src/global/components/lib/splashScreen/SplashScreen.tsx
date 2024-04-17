import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { FlexColumnWrapper } from '../positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { SplashScreenFooter, SplashScreenWrapper } from './Style';
import GradientBgLogo from '../../app/logo/gradientBgLogo/GradientBgLogo';

interface ISplashScreen {
   component?: JSX.Element;
   durationSecs?: number;
}

export default function SplashScreen(props: ISplashScreen): JSX.Element {
   const { component, durationSecs = 2 } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <SplashScreenWrapper isDarkTheme={isDarkTheme} durationSecs={durationSecs}>
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
         <ConditionalRender condition={component !== undefined}>{component}</ConditionalRender>
      </SplashScreenWrapper>
   );
}
