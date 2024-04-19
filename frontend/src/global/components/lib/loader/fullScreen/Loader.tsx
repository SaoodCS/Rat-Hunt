import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import CSS_Color from '../../../../css/utils/colors';
import { CSS_ZIndex } from '../../../../css/utils/zIndex';
import ExitAnimatePresence from '../../animation/exitAnimatePresence/ExitAnimatePresence';
import { AnimatedOverlay } from '../../animation/overlay/AnimatedOverlay';
import { SimpleAnimator } from '../../animation/simpleAnimator/SimpleAnimator';
import { CustomSpinner, CustomSpinnerWrapper } from '../Style';

interface ILoaderProps {
   isDisplayed: boolean;
}

export default function Loader(props: ILoaderProps): JSX.Element {
   const { isDisplayed } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ExitAnimatePresence exitWhen={!isDisplayed}>
         <AnimatedOverlay
            key="loader-overlay"
            animateType={['fade']}
            duration={0.3}
            type="tween"
            color={CSS_Color.setRgbOpacity(
               isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
               0.25,
            )}
            zIndex={CSS_ZIndex.get('loader') - 1}
         />

         <SimpleAnimator key="loading-spinner" animateType={['fade']} duration={0.3} type="tween">
            <CustomSpinnerWrapper centerContents>
               <CustomSpinner isDarkTheme={isDarkTheme} />
            </CustomSpinnerWrapper>
         </SimpleAnimator>
      </ExitAnimatePresence>
   );
}
