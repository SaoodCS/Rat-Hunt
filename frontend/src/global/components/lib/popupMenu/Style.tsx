import type { Keyframes } from 'styled-components';
import styled, { keyframes } from 'styled-components';
import CSS_Clickables from '../../../css/utils/clickables';
import CSS_Color from '../../../css/utils/colors';
import { CSS_Helper } from '../../../css/utils/helper';
import { CSS_ZIndex } from '../../../css/utils/zIndex';

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
   z-index: ${CSS_ZIndex.get('popupMenu')};
   position: fixed;
   top: ${({ topPx }) => topPx}px;
   left: ${({ leftPx }) => leftPx}px;
   height: ${({ heightPx }) => heightPx}px;
   width: ${({ widthPx }) => widthPx}px;
   border-radius: 10px;
   backdrop-filter: blur(100px);
   color: ${({ isDarkTheme }) => (isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt)};
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.dialog, 1)
         : CSS_Color.setRgbOpacity(CSS_Color.darkThm.dialog, 0.08)};
   box-shadow: ${({ isDarkTheme }) =>
      !isDarkTheme && `0px 0px 10px ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.1)}`};

   animation: ${({ isOpen, clickPos }) =>
         isOpen ? relativeExpander(clickPos) : relativeContractor(clickPos)}
      0.25s ease-in-out;
   animation-fill-mode: forwards;
`;

export const PMItemsListWrapper = styled.div<{ isDarkTheme: boolean }>`
   & > *:not(:last-child) {
      border-bottom: 1px solid
         ${({ isDarkTheme }) =>
            isDarkTheme ? CSS_Color.darkThm.border : CSS_Color.lightThm.border};
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
   ${CSS_Clickables.removeDefaultEffects};
   padding: 8px;
   display: flex;
   justify-content: ${({ isHeadingItem }) => (isHeadingItem ? 'center' : 'space-between')};
   align-items: center;
   background-color: ${({ isDarkTheme, isHeadingItem }) =>
      isHeadingItem &&
      CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt, 0.09)};
   color: ${({ isDarkTheme, warningItem, dangerItem }) =>
      isDarkTheme
         ? warningItem
            ? CSS_Color.darkThm.warning
            : dangerItem
              ? CSS_Color.darkThm.error
              : CSS_Color.darkThm.txt
         : warningItem
           ? CSS_Color.lightThm.warning
           : dangerItem
             ? CSS_Color.lightThm.error
             : CSS_Color.lightThm.txt};

   & > *:nth-child(2) {
      height: 15px;
   }
   ${({ isHeadingItem, isDarkTheme }) => {
      if (isHeadingItem) return;
      const bgColor = CSS_Color.setRgbOpacity(
         isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
         0.1,
      );
      const mobile = CSS_Clickables.portable.changeColorOnClick(
         bgColor,
         'background-color',
         'revert',
      );
      const desktop = CSS_Clickables.desktop.changeColorOnHover(bgColor, 'background-color');
      return CSS_Helper.concatStyles(mobile, desktop);
   }};
`;

export const PMItemTitle = styled.div`
   font-size: 13px;
`;
