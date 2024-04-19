import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import Color from '../../../../css/utils/colors';
import { CSS_ZIndex } from '../../../../css/utils/zIndex';
import { AnimatedOverlay } from '../../animation/overlay/AnimatedOverlay';
import { CustomSpinner, CustomSpinnerWrapper } from '../Style';

export default function Loader(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <>
         <AnimatedOverlay
            animateType={['fade']}
            duration={0.1}
            type="tween"
            color={Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.25)}
            zIndex={CSS_ZIndex.get('loader') - 1}
         />
         <CustomSpinnerWrapper>
            <CustomSpinner isDarkTheme={isDarkTheme} />
         </CustomSpinnerWrapper>
      </>
   );
}
