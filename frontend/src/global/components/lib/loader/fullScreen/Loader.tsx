import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import Color from '../../../../css/colors';
import { AnimatedOverlay } from '../../animation/overlay/AnimatedOverlay';
import { FullScreenWrapper } from '../../positionModifiers/fullScreenWrapper/FullScreenWrapper';
import ConditionalRender from '../../renderModifiers/conditionalRender/ConditionalRender';
import { CustomSpinner } from '../Style';

interface ILoader {
   isDisplayed: boolean;
   zIndex?: number;
}

export default function Loader(props: ILoader): JSX.Element {
   const { isDisplayed, zIndex } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ConditionalRender condition={isDisplayed}>
         <AnimatedOverlay
            animateType={['fade']}
            duration={0.1}
            type="tween"
            color={Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.25)}
            zIndex={zIndex}
         />
         <FullScreenWrapper centerContents>
            <CustomSpinner isDarkTheme={isDarkTheme} />
         </FullScreenWrapper>
      </ConditionalRender>
   );
}
