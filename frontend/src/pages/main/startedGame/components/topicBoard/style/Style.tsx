import styled from 'styled-components';
import Color from '../../../../../../global/css/colors';

export const CellValue = styled.div`
   width: 80%;
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
`;

export const CellUID = styled.div`
   position: absolute;
   top: 0px;
   left: 0px;
   padding: 0.5em;
`;

export const BoardCell = styled.div<{ isActiveWord?: boolean; isUserRat?: boolean }>`
   width: calc(25%);
   height: calc(100% - 2px);
   margin-right: 1px;
   margin-left: 1px;
   border-radius: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   background-color: ${Color.setRgbOpacity(Color.darkThm.bg, 1)};
   border-left: 1px solid ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.7)};
   border-top: 1px solid ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.7)};
   box-shadow: ${({ isActiveWord, isUserRat }) => {
      if (isActiveWord && !isUserRat) {
         return `inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.7)},
         inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 1)}`;
      }
      return `inset 0.05em 0.05em 0em 0em ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.7)},
         inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 1)}`;
   }};
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
