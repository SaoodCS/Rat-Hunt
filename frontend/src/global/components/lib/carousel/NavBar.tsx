import styled from 'styled-components';
import Color from '../../../css/utils/colors';
import { CSS_Helper } from '../../../css/utils/helper';
import CSS_Clickables from '../../../css/utils/clickables';

export const CarouselAndNavBarWrapper = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
   & > :nth-child(2) {
      flex: 1;
   }
`;

export const NavBarContainer = styled.div<{ isDarkTheme: boolean }>`
   width: 100%;
   height: 2.5em;
   z-index: 100;
   display: flex;
   justify-content: space-around;
   align-items: center;
   box-sizing: border-box;
   border-bottom: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
`;

export const NavBarHeading = styled.button<{ isActive: boolean; isDarkTheme: boolean }>`
   all: unset;
   ${CSS_Clickables.removeDefaultEffects};
   border-bottom: ${({ isActive, isDarkTheme }) =>
      isActive
         ? isDarkTheme
            ? `1.75px solid ${Color.darkThm.accent}`
            : `1.75px solid ${Color.lightThm.accent}`
         : 'none'};
   transition: all 0.2s ease-in-out;
   box-sizing: border-box;

   cursor: pointer;
   color: ${({ isActive, isDarkTheme }) => {
      const color = isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt;
      return isActive ? color : Color.setRgbOpacity(color, 0.6);
   }};

   ${({ isDarkTheme }) => {
      const changeToColor = Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         1,
      );
      const desktop = CSS_Clickables.desktop.changeColorOnHover(changeToColor, 'color');
      const mobile = CSS_Clickables.portable.changeColorOnClick(changeToColor, 'color', 'revert');
      return CSS_Helper.concatStyles(desktop, mobile);
   }}
`;
