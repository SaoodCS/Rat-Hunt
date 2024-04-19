import styled, { css } from 'styled-components';
import CSS_Color from '../../../../../../global/css/utils/colors';

export const CellValue = styled.div`
   width: 80%;
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
   font-size: 0.65em;
`;

export const CellUID = styled.div`
   position: absolute;
   top: 0px;
   left: 0px;
   padding: 0.5em;
`;

export const BoardCell = styled.div<{ isActiveWord?: boolean; isUserRat?: boolean }>`
   width: calc(25%);
   height: calc(100% - 6px);
   margin-right: 3px;
   margin-left: 3px;
   border-radius: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   filter: contrast(1) brightness(1) drop-shadow(0px 0px 0px rgba(255, 255, 255, 0.05));
   ${({ isActiveWord, isUserRat }) => {
      const showActiveWord = isActiveWord && !isUserRat;
      const colorPropColor = CSS_Color.darkThm.txt;
      const colorPropOpacity = showActiveWord ? 1 : 0.5;
      const bgColorPropColor = showActiveWord ? CSS_Color.darkThm.accent : 'rgb(230, 218, 255)';
      const bgColorPropOpacity = showActiveWord ? 0.8 : 0.175;
      return css`
         color: ${CSS_Color.setRgbOpacity(colorPropColor, colorPropOpacity)};
         background-color: ${CSS_Color.setRgbOpacity(bgColorPropColor, bgColorPropOpacity)};
      `;
   }}
   box-shadow:
      inset 0.05em 0.05em 0em 0 ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.3)},
      inset -0.05em -0.05em 0.05em 0 ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.7)};
`;

export const BoardRow = styled.div`
   display: flex;
   height: calc(((1 / 3) * 100%));
   align-items: center;
   justify-content: center;
`;

export const BoardContainer = styled.div`
   height: 100%;
   width: 100%;
   max-width: 30em;
   box-sizing: border-box;
   margin: 0 auto;
   border-radius: 1em;
   padding: 1em;
`;
