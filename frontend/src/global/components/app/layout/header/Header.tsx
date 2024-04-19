import { ArrowIosBack } from '@styled-icons/evaicons-solid/ArrowIosBack';
import styled, { css } from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import { CSS_Media } from '../../../../css/utils/media';
import CSS_Clickables from '../../../../css/utils/clickables';

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
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      height: calc(10% + 20px);
      font-size: 3em;
      align-items: center;
      justify-content: center;
      border-bottom: none;
   }
`;

export const HeaderSubtitleWrapper = styled.div`
   position: absolute;
   bottom: 5px;
   ${CSS_Media.Query.mobile(css`
      font-size: 0.8rem;
   `)};
   ${CSS_Media.Query.desktop(css`
      font-size: 1rem;
   `)};
`;

export const StyledBackArr = styled(ArrowIosBack)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   height: 1.5em;
   position: fixed;
   left: 0;
   padding-left: 1em;
   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.txt : Color.lightThm.txt,
         0.3,
      );
      const dekstop = CSS_Clickables.desktop.changeColorOnHover(color, 'color');
      const mobile = CSS_Clickables.portable.changeColorOnClick(color, 'color', 'persist');
      return CSS_Helper.concatStyles(dekstop, mobile);
   }};
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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

   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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
