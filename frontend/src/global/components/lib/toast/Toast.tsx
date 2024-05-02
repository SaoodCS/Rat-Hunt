import { useEffect } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { StyledToast, ToastBg, ToastContainer } from './Style';
import NumberHelper from '../../../../../../shared/lib/helpers/number/NumberHelper';
import ExitAnimatePresence from '../animation/exitAnimatePresence/ExitAnimatePresence';
import { SimpleAnimator } from '../animation/simpleAnimator/SimpleAnimator';

export type TVerticalPos = 'top' | 'bottom';
export type THorizontalPos = 'left' | 'center' | 'right';

interface IToast {
   message: string;
   width: string;
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   textAlign: 'left' | 'center' | 'right';
   type: 'info' | 'success' | 'error' | 'warning';
   duration: number;
   isDisplayed: boolean;
   onClose: () => void;
}

export default function Toast(props: IToast): JSX.Element {
   const {
      message,
      width,
      verticalPos,
      horizontalPos,
      textAlign,
      type,
      duration,
      isDisplayed,
      onClose,
   } = props;
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      if (!isDisplayed) return;
      const timeout = setTimeout(() => {
         onClose();
      }, NumberHelper.secsToMs(duration));
      return () => clearTimeout(timeout);
   }, [isDisplayed]);

   return (
      <ExitAnimatePresence exitWhen={!isDisplayed}>
         <SimpleAnimator key="toast" animateType={['fade']} duration={duration / 5}>
            <ToastContainer
               verticalPos={verticalPos}
               horizontalPos={horizontalPos}
               isDarkTheme={isDarkTheme}
            >
               <ToastBg isDarkTheme={isDarkTheme}>
                  <StyledToast
                     isDarkTheme={isDarkTheme}
                     width={width || 'auto'}
                     textAlign={textAlign}
                     type={type}
                  >
                     {message}
                  </StyledToast>
               </ToastBg>
            </ToastContainer>
         </SimpleAnimator>
      </ExitAnimatePresence>
   );
}
