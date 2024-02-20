import styled from 'styled-components';
import Color from '../../global/css/colors';

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

export const BoardCell = styled.div`
   border: 1px solid ${Color.darkThm.accent};
   width: 25%;
   height: 100%;
   box-sizing: border-box;
   border-radius: 1em;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   background-color: ${Color.setRgbOpacity(Color.darkThm.accent, 0.1)};
`;

export const BoardRow = styled.div`
   display: flex;
   height: 25%;
`;

export const BoardContainer = styled.div`

   border: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)};
   height: 100%;
   width: 100%;
   border-radius: 1em;
   background-color: ${Color.darkThm.bg};
  
`;
