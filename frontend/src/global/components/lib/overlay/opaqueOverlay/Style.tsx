import styled from 'styled-components';
import Color from '../../../../css/colors';

export const OpaqueOverlay = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg)};
   z-index: 1;
   backdrop-filter: blur(5px);
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
`;
