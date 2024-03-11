import { createGlobalStyle, css } from 'styled-components';
import Color from './colors';

const darkThemeDefaults = css`
   background-color: ${Color.darkThm.bg};
   color: ${Color.darkThm.txt};
   text-shadow: ${Color.darkThm.txtShadow};
`;

const lightThemeDefaults = css`
   background-color: ${Color.lightThm.bg};
   color: ${Color.lightThm.txt};
   text-shadow: ${Color.lightThm.txtShadow};
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
   
  ::-webkit-scrollbar {
    width: 0.4em;
    background-color: rgb(255, 255, 255);
  }
  ::-webkit-scrollbar-thumb {
    background-color: grey;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
    ${({ darkTheme }) => (darkTheme ? darkThemeDefaults : lightThemeDefaults)}
  }
`;
