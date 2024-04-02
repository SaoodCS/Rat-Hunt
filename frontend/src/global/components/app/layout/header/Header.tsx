import { ArrowIosBack } from '@styled-icons/evaicons-solid/ArrowIosBack';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';

export const Header = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   top: 0;
   height: 10%;
   width: 100dvw;
   border-bottom: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.4)};
   border-bottom-left-radius: 10px;
   border-bottom-right-radius: 10px;
   display: flex;
   justify-content: space-evenly;
   align-items: center;
   font-size: 1.1em;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      height: calc(10% + 20px);
      font-size: 3em;
      align-items: center;
      justify-content: center;
      border-bottom: none;
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
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning)};
   & > * {
      height: 1.5em;
   }

   & > *:last-child {
      margin-right: 1em;
   }
   & > *:not(:last-child) {
      margin-right: 0.25em;
   }

   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      padding-left: 0.25em;
      & > * {
         height: 1.4em;
         padding: 0.2em;
         border-radius: 50%;
         background-color: ${Color.darkThm.accentDarkerShade};
         -webkit-tap-highlight-color: transparent;
         cursor: pointer;
         :hover {
            filter: brightness(0.8);
         }
         transition: filter 0.2s;
         box-sizing: border-box;
      }

      & > *:last-child {
         margin-right: 0.5em;
      }
      & > *:not(:last-child) {
         margin-right: 0.25em;
      }
   }
`;
