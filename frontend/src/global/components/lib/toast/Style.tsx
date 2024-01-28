import styled from 'styled-components';
import Color from '../../../css/colors';
import type { THorizontalPos, TVerticalPos } from './Toast';

export const ToastContainer = styled.div<{
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   zIndex?: number;
}>`
   width: 100%;
   top: ${({ verticalPos }) => (verticalPos === 'top' ? '2em' : 'unset')};
   bottom: ${({ verticalPos }) => (verticalPos === 'bottom' ? '2em' : 'unset')};
   position: fixed;
   display: flex;
   justify-content: ${({ horizontalPos }) => {
      if (horizontalPos === 'center') return 'center';
      if (horizontalPos === 'left') return 'flex-start';
      if (horizontalPos === 'right') return 'flex-end';
      return 'center';
   }};
   z-index: ${({ zIndex }) => zIndex || 99999};
   align-items: center;
`;

export const StyledToast = styled.div<{
   width: string;
   isDarkTheme: boolean;
}>`
   width: ${({ width }) => width};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg)};
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.7)
         : Color.setRgbOpacity(Color.lightThm.txt, 0.7)};
   border-radius: 10px;
   padding: 1em;
   backdrop-filter: blur(5px);
   font-size: 0.9em;
`;
