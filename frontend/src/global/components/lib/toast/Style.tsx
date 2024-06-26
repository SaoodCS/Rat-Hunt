import styled, { css } from 'styled-components';
import CSS_Color from '../../../css/utils/colors';
import { CSS_ZIndex } from '../../../css/utils/zIndex';
import type { THorizontalPos, TVerticalPos } from './Toast';

export const ToastContainer = styled.div<{
   verticalPos: TVerticalPos;
   horizontalPos: THorizontalPos;
   isDarkTheme: boolean;
}>`
   z-index: ${CSS_ZIndex.get('toast')};
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
   align-items: center;
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
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      let col: [string, string];
      if (type === 'info') col = [theme.bg, theme.txt];
      else if (type === 'success') col = [theme.bg, theme.success];
      else if (type === 'error') col = [theme.bg, theme.error];
      else col = [theme.bg, theme.warning];
      return css`
         color: ${col[1]};
         background-color: ${CSS_Color.setRgbOpacity(col[1], 0.25)};
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
      CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.bg : CSS_Color.lightThm.bg, 0.75)};
   backdrop-filter: blur(10px);
   box-sizing: border-box;
   max-width: 90%;
`;
