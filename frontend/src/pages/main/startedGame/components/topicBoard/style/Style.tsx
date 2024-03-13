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
   //border: 1px solid ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 1)};
   width: calc(25% - 4px);
   margin-left: 2px;
   margin-right: 2px;
   height: calc(100% - 4px);
   box-sizing: border-box;
   border-radius: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   background-color: ${Color.setRgbOpacity(Color.darkThm.bg, 1)};
   filter: brightness(1.2);
   // create an inner bevelling effect

   box-shadow: ${({ isActiveWord, isUserRat }) => {
      if (isActiveWord && !isUserRat) {
         return `inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(Color.darkThm.success, 1)},
         inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 1)}`;
      }
      return `inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)},
         inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 1)}`;
   }};
`;

export const BoardRow = styled.div`
   display: flex;
   height: 25%;
`;

export const BoardContainer = styled.div`
   height: 100%;
   width: 100%;
   border-radius: 1em;
`;
