import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

class MenuWrapperStyles {
   static largeScrn = css`
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
   `;

   static smallScrn = (isDarkTheme: boolean): FlattenSimpleInterpolation => css`
      margin: 1em;
      background-color: ${isDarkTheme
         ? Color.setRgbOpacity(Color.darkThm.txt, 0.07)
         : `rgba(0, 0, 0, 0.1)`};
      border-radius: 1em;
      width: 100%;
      border: ${isDarkTheme
         ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
         : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
      & > *:not(:last-child) {
         border-bottom: ${isDarkTheme
            ? `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.1)}`
            : `1px solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.1)}`};
      }
   `;
}

export const MenuListWrapper = styled.div<{ isDarkTheme: boolean }>`
   ::-webkit-scrollbar {
      display: none;
   }
   height: fit-content;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      ${({ isDarkTheme }) => MenuWrapperStyles.smallScrn(isDarkTheme)};
   }

   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      ${MenuWrapperStyles.largeScrn};
   }
`;

// ---- //

class ItemContainerStyles {
   static largeScrn = (isDarkTheme: boolean): FlattenSimpleInterpolation => css`
      border: ${isDarkTheme
         ? `1px solid ${Color.darkThm.border}`
         : `1px solid ${Color.lightThm.border}`};
      height: 12.5em;
      width: 12.5em;
      margin: 1.5em;
      border-radius: 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      ${MyCSS.Clickables.desktop.changeColorOnHover(
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1),
         'background-color',
      )};
   `;

   static smallSrn = (spaceRow: boolean): FlattenSimpleInterpolation => css`
      height: 3em;
      display: flex;
      align-items: center;
      padding-left: 1em;
      justify-content: ${spaceRow && 'space-between'};
      padding-right: ${spaceRow && '1em'};
   `;
}

export const ItemContainer = styled.div<{
   spaceRow?: boolean;
   dangerItem?: boolean;
   warningItem?: boolean;
   isDarkTheme: boolean;
}>`
   all: unset;
   ${MyCSS.Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ dangerItem, warningItem, isDarkTheme }) =>
      dangerItem
         ? isDarkTheme
            ? Color.darkThm.error
            : Color.lightThm.error
         : warningItem
           ? isDarkTheme
              ? Color.darkThm.warning
              : Color.lightThm.warning
           : undefined};
   &:hover:active {
      background-color: ${({ isDarkTheme }) =>
         Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.1)};
   }
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      ${({ spaceRow }) => ItemContainerStyles.smallSrn(!!spaceRow)};
   }
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      ${({ isDarkTheme }) => ItemContainerStyles.largeScrn(isDarkTheme)};
   }
`;

export const IconAndNameWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      flex-direction: row;
      & > *:first-child {
         height: 1.5em;
         padding-right: 0.5em;
      }
   }
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      flex-direction: column;
      padding-bottom: 0.5em;
      & > *:first-child {
         height: 6.5em;
         padding-bottom: 0.5em;
      }
   }
`;

export const ItemContentWrapper = styled.div`
   display: flex;
   flex-direction: column;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      align-items: start;
   }
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      align-items: center;
   }
`;

export const ItemDetails = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.5)};
`;

export const ItemSubElement = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      height: 100%;
   }
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      padding-top: 0.4em;
   }
`;
