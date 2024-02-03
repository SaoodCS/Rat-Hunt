import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export const StyledLink = styled(Link)`
   all: unset;
   ${MyCSS.Clickables.removeDefaultEffects};
`;

export const FooterItem = styled.div<{ isActive: boolean; isDarkTheme: boolean }>`
   display: flex;
   flex-direction: column;
   text-transform: capitalize;
   padding-left: 1em;
   padding-right: 1em;
   padding-top: 0.75em;
   font-size: 0.8em;
   color: ${({ isDarkTheme, isActive }) =>
      isActive && isDarkTheme
         ? Color.darkThm.accent
         : !isActive && isDarkTheme
           ? Color.setRgbOpacity(Color.darkThm.txt, 0.6)
           : isActive && !isDarkTheme
             ? Color.lightThm.accent
             : Color.setRgbOpacity(Color.lightThm.txt, 0.6)};
   & > :first-child {
      height: 2em;
      padding-bottom: 0.25em;
   }
   @keyframes bounce {
      0% {
         transform: scale(1);
      }
      50% {
         transform: scale(0.9);
      }
      100% {
         transform: scale(1);
      }
   }
   animation: ${({ isActive }) => isActive && 'bounce 0.2s'};
`;

export const FooterContainer = styled.div<{ isDarkTheme: boolean }>`
   border-top: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   position: fixed;
   width: 100dvw;
   height: 10%;
   display: flex;
   justify-content: space-evenly;
   bottom: 0px;
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
   background-color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.bg : Color.lightThm.bg)};
`;
