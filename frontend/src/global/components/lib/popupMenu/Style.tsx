import type { Keyframes } from 'styled-components';
import styled, { keyframes } from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export type TButtonPos = 'top left' | 'top right' | 'bottom left' | 'bottom right';

const relativeExpander = (clickPos: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(0);
      transform-origin: ${clickPos};
      opacity: 0;
   }
   100% {
      transform: scale(1);
      transform-origin: ${clickPos};
      opacity: 1;
   }
`;

const relativeContractor = (clickPos: TButtonPos): Keyframes => keyframes`
   0% {
      transform: scale(1);
      transform-origin: ${clickPos};
      opacity: 1;
   }
   100% {
      transform: scale(0);
      transform-origin: ${clickPos};
      opacity: 0;
   }
`;

export const PopupMenuWrapper = styled.div<{
   topPx: number;
   leftPx: number;
   isOpen: boolean;
   clickPos: TButtonPos;
   widthPx: number;
   heightPx: number;
   isDarkTheme: boolean;
}>`
   position: fixed;
   top: ${({ topPx }) => topPx}px;
   left: ${({ leftPx }) => leftPx}px;
   height: ${({ heightPx }) => heightPx}px;
   width: ${({ widthPx }) => widthPx}px;
   z-index: 100;
   border-radius: 10px;
   backdrop-filter: blur(100px);
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.dialog, 1)
         : Color.setRgbOpacity(Color.darkThm.dialog, 0.08)};
   box-shadow: ${({ isDarkTheme }) =>
      !isDarkTheme && `0px 0px 10px ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`};

   animation: ${({ isOpen, clickPos }) =>
         isOpen ? relativeExpander(clickPos) : relativeContractor(clickPos)}
      0.25s ease-in-out;
   animation-fill-mode: forwards;
`;

export const PMItemsListWrapper = styled.div<{ isDarkTheme: boolean }>`
   & > *:not(:last-child) {
      border-bottom: 1px solid
         ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   }
   & > *:first-child {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
   }
   & > *:last-child {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
   }
`;

export const PMItemContainer = styled.div<{
   isDarkTheme: boolean;
   warningItem?: boolean;
   dangerItem?: boolean;
   isHeadingItem?: boolean;
}>`
   ${MyCSS.Clickables.removeDefaultEffects};
   padding: 8px;
   display: flex;
   justify-content: ${({ isHeadingItem }) => (isHeadingItem ? 'center' : 'space-between')};
   align-items: center;
   background-color: ${({ isDarkTheme, isHeadingItem }) =>
      isHeadingItem &&
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.09)};
   color: ${({ isDarkTheme, warningItem, dangerItem }) =>
      isDarkTheme
         ? warningItem
            ? Color.darkThm.warning
            : dangerItem
              ? Color.darkThm.error
              : Color.darkThm.txt
         : warningItem
           ? Color.lightThm.warning
           : dangerItem
             ? Color.lightThm.error
             : Color.lightThm.txt};

   & > *:nth-child(2) {
      height: 15px;
   }
   ${({ isHeadingItem, isDarkTheme }) => {
      if (isHeadingItem) return;
      const bgColor = Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         0.1,
      );
      const mobile = MyCSS.Clickables.portable.changeColorOnClick(
         bgColor,
         'background-color',
         'revert',
      );
      const desktop = MyCSS.Clickables.desktop.changeColorOnHover(bgColor, 'background-color');
      return MyCSS.Helper.concatStyles(mobile, desktop);
   }};
`;

export const PMItemTitle = styled.div`
   font-size: 13px;
`;
