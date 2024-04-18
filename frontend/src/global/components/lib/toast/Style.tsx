import styled, { css } from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';
import type { THorizontalPos, TVerticalPos } from './Toast';

export const ToastContainer = styled.div<{
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   zIndex?: number;
   duration: number;
   isDarkTheme: boolean;
}>`
   box-sizing: border-box;
   padding-left: 1em;
   padding-right: 1em;
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
   ${({ duration }) => MyCSS.Keyframes.fadeInAndOut(duration)};
`;

export const StyledToast = styled.div<{
   width: string;
   isDarkTheme: boolean;
   textAlign: 'left' | 'center' | 'right';
   type: 'info' | 'success' | 'error' | 'warning';
}>`
   width: ${({ width }) => width};
   text-align: ${({ textAlign }) => textAlign};
   box-sizing: border-box;
   ${({ type, isDarkTheme }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      let col: [string, string];
      if (type === 'info') col = [theme.bg, theme.txt];
      else if (type === 'success') col = [theme.bg, theme.success];
      else if (type === 'error') col = [theme.bg, theme.error];
      else col = [theme.bg, theme.warning];
      return css`
         color: ${col[1]};
         background-color: ${Color.setRgbOpacity(col[1], 0.25)};
         backdrop-filter: blur(10px);
      `;
   }}
   border-radius: 10px;
   padding: 1em;
   font-size: 0.9em;
`;

export const ToastBg = styled.div<{ isDarkTheme: boolean }>`
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg, 0.75)};
   backdrop-filter: blur(10px);
   box-sizing: border-box;
   max-width: 90%;
`;
