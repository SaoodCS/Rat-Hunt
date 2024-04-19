import { createGlobalStyle, css } from 'styled-components';
import CSS_Color from '../utils/colors';

const darkThemeDefaults = css`
   background-color: ${CSS_Color.darkThm.bg};
   color: ${CSS_Color.darkThm.txt};
   text-shadow: ${CSS_Color.darkThm.txtShadow};
`;

const lightThemeDefaults = css`
   background-color: ${CSS_Color.lightThm.bg};
   color: ${CSS_Color.lightThm.txt};
   text-shadow: ${CSS_Color.lightThm.txtShadow};
`;

export const GlobalTheme = createGlobalStyle<{ darkTheme: boolean }>`
  body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-weight: 500;
  box-sizing: border-box;
  word-wrap: break-word;
  hyphens: auto;
  text-overflow: ellipsis;
  font-family: 'Backfired';
   @font-face {
      font-family: 'Backfired';
      src: url('/fonts/Backfired.ttf') format('truetype');
   }
    ${({ darkTheme }) => (darkTheme ? darkThemeDefaults : lightThemeDefaults)}
  }
`;
