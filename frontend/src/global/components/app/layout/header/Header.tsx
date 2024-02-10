import { ArrowIosBack } from '@styled-icons/evaicons-solid/ArrowIosBack';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const Header = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   top: 0;
   height: 10%;
   width: 100dvw;
   border-bottom: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
   display: flex;
   justify-content: space-evenly;
   align-items: center;
   font-size: 1.1em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      left: 5dvw;
      width: 90dvw;
      border-bottom: none;
      justify-content: center;
      padding-top: 20px;
      font-size: 3em;
   }
   z-index: 1;
`;

export const StyledBackArr = styled(ArrowIosBack)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   height: 1.5em;
   position: fixed;
   left: 0;
   padding-left: 1em;
   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.txt : Color.lightThm.txt,
         0.3,
      );
      const dekstop = MyCSS.Clickables.desktop.changeColorOnHover(color, 'color');
      const mobile = MyCSS.Clickables.portable.changeColorOnClick(color, 'color', 'persist');
      return MyCSS.Helper.concatStyles(dekstop, mobile);
   }};
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      left: 15%;
      padding-left: 0;
      height: 1.25em;
   }
`;

export const HeaderRightElWrapper = styled.div<{ isDarkTheme: boolean }>`
   right: 0px;
   position: fixed;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent)};
   & > * {
      height: 1.5em;
   }

   & > *:last-child {
      margin-right: 1em;
   }
   & > *:not(:last-child) {
      margin-right: 0.5em;
   }

   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 0.25em;
      & > * {
         height: 0.7em;
      }

      & > *:last-child {
         margin-right: 0.5em;
      }
      & > *:not(:last-child) {
         margin-right: 0.1em;
      }
   }
`;
