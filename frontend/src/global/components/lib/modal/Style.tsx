import { Close } from '@styled-icons/evil/Close';
import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export const ModalHeader = styled.span<{ isDarkTheme: boolean }>`
   text-shadow: ${({ isDarkTheme }) =>
      isDarkTheme ? Color.darkThm.txtShadowHeaders : Color.lightThm.txtShadowHeaders};
`;

export const ModalBody = styled.div`
   padding: 1em;
   max-height: 25em;
   overflow-x: hidden;
   overflow-y: auto;
   ${MyCSS.Scrollbar.gradientStyle};
   font-size: 0.85em;
`;

export const ModalHeaderContainer = styled.div<{ isDarkTheme: boolean }>`
   padding: 1em;
   display: flex;
   justify-content: space-between;
   align-items: center;
   border-bottom: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   border-radius: 5px;
   font-size: 1em;
   font-weight: 500;
`;

export const ModalContainer = styled.div<{ isDarkTheme: boolean }>`
   width: 17em;
   border-radius: 10px;
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.dialog, 0.8)
         : Color.setRgbOpacity(Color.lightThm.dialog, 0.8)};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   border: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   backdrop-filter: blur(10px);
`;

export const ModalCloseButton = styled(Close)`
   height: 1.25em;
   cursor: pointer;
   font-weight: 1000;
   border-radius: 50%;
   &:active {
      background-color: ${Color.lightThm.border};
      background-position: center;
      transition: background 0.05s;
   }
`;

export const ModalFooterWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: right;
   padding-top: 0.5em;
`;
