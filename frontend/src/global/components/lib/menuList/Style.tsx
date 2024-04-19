import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';
import CSS_Clickables from '../../../css/utils/clickables';
import CSS_Color from '../../../css/utils/colors';
import { CSS_Media } from '../../../css/utils/media';

class MenuWrapperStyles {
   static largeScrn = css`
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
   `;

   static smallScrn = (isDarkTheme: boolean): FlattenSimpleInterpolation => css`
      margin: 1em;
      background-color: ${isDarkTheme
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.07)
         : `rgba(0, 0, 0, 0.1)`};
      border-radius: 1em;
      width: 100%;
      border: ${isDarkTheme
         ? `1px solid ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.1)}`
         : `1px solid ${CSS_Color.setRgbOpacity(CSS_Color.lightThm.txt, 0.1)}`};
      & > *:not(:last-child) {
         border-bottom: ${isDarkTheme
            ? `1px solid ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.1)}`
            : `1px solid ${CSS_Color.setRgbOpacity(CSS_Color.lightThm.txt, 0.1)}`};
      }
   `;
}

export const MenuListWrapper = styled.div<{ isDarkTheme: boolean }>`
   ::-webkit-scrollbar {
      display: none;
   }
   height: fit-content;
   @media (max-width: ${CSS_Media.PortableBp.asPx}) {
      ${({ isDarkTheme }) => MenuWrapperStyles.smallScrn(isDarkTheme)};
   }

   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      ${MenuWrapperStyles.largeScrn};
   }
`;

// ---- //

class ItemContainerStyles {
   static largeScrn = (isDarkTheme: boolean): FlattenSimpleInterpolation => css`
      border: ${isDarkTheme
         ? `1px solid ${CSS_Color.darkThm.border}`
         : `1px solid ${CSS_Color.lightThm.border}`};
      height: 12.5em;
      width: 12.5em;
      margin: 1.5em;
      border-radius: 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      ${CSS_Clickables.desktop.changeColorOnHover(
         CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt, 0.1),
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
   ${CSS_Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ dangerItem, warningItem, isDarkTheme }) =>
      dangerItem
         ? isDarkTheme
            ? CSS_Color.darkThm.error
            : CSS_Color.lightThm.error
         : warningItem
           ? isDarkTheme
              ? CSS_Color.darkThm.warning
              : CSS_Color.lightThm.warning
           : undefined};
   &:hover:active {
      background-color: ${({ isDarkTheme }) =>
         CSS_Color.setRgbOpacity(
            isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
            0.1,
         )};
   }
   @media (max-width: ${CSS_Media.PortableBp.asPx}) {
      ${({ spaceRow }) => ItemContainerStyles.smallSrn(!!spaceRow)};
   }
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      ${({ isDarkTheme }) => ItemContainerStyles.largeScrn(isDarkTheme)};
   }
`;

export const IconAndNameWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   @media (max-width: ${CSS_Media.PortableBp.asPx}) {
      flex-direction: row;
      & > *:first-child {
         height: 1.5em;
         padding-right: 0.5em;
      }
   }
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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
   @media (max-width: ${CSS_Media.PortableBp.asPx}) {
      align-items: start;
   }
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      align-items: center;
   }
`;

export const ItemDetails = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   color: ${({ isDarkTheme }) =>
      CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt, 0.5)};
`;

export const ItemSubElement = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   @media (max-width: ${CSS_Media.PortableBp.asPx}) {
      height: 100%;
   }
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      padding-top: 0.4em;
   }
`;
