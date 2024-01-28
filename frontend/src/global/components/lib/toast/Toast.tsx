import { useEffect, useState } from 'react';
import useThemeContext from '../../../context/theme/hooks/useThemeContext';
import Fader from '../animation/fader/Fader';
import ConditionalRender from '../renderModifiers/conditionalRender/ConditionalRender';
import { StyledToast, ToastContainer } from './Style';

export type TVerticalPos = 'top' | 'bottom';
export type THorizontalPos = 'left' | 'center' | 'right';

interface IToast {
   message: string;
   isVisible: boolean;
   onClose: () => void;
   width?: string;
   verticalPos?: TVerticalPos;
   horizontalPos?: THorizontalPos;
   zIndex?: number;
}

export default function Toast(props: IToast): JSX.Element {
   const { message, isVisible, onClose, width, verticalPos, horizontalPos, zIndex } = props;
   const [renderToast, setRenderToast] = useState(isVisible);
   const { isDarkTheme } = useThemeContext();
   let timeout1: NodeJS.Timeout;
   let timeout2: NodeJS.Timeout;

   useEffect(() => {
      if (isVisible) {
         setRenderToast(true);
         timeout1 = setTimeout(() => {
            setRenderToast(false);
            timeout2 = setTimeout(() => {
               onClose();
            }, 300);
         }, 2000);
      }
      return () => {
         clearTimeout(timeout1);
         clearTimeout(timeout2);
      };
   }, [isVisible]);

   return (
      <>
         <ConditionalRender condition={isVisible}>
            <Fader fadeInCondition={renderToast}>
               <ToastContainer
                  verticalPos={verticalPos || 'bottom'}
                  horizontalPos={horizontalPos || 'left'}
                  zIndex={zIndex || undefined}
               >
                  <StyledToast isDarkTheme={isDarkTheme} width={width || 'auto'}>
                     {message}
                  </StyledToast>
               </ToastContainer>
            </Fader>
         </ConditionalRender>
      </>
   );
}
