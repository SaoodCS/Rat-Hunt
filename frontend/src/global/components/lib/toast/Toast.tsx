import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import { StyledToast, ToastBg, ToastContainer } from './Style';

export type TVerticalPos = 'top' | 'bottom';
export type THorizontalPos = 'left' | 'center' | 'right';

interface IToast {
   message: string;
   width: string;
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   zIndex: number;
   textAlign: 'left' | 'center' | 'right';
   type: 'info' | 'success' | 'error' | 'warning';
   duration: number;
}

export default function Toast(props: IToast): JSX.Element {
   const { message, width, verticalPos, horizontalPos, zIndex, textAlign, type, duration } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <ToastContainer
         verticalPos={verticalPos}
         horizontalPos={horizontalPos}
         zIndex={zIndex}
         duration={duration}
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
   );
}
