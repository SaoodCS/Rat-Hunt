import styled from 'styled-components';
import Color from '../../global/css/colors';

export const CellValue = styled.div``;

export const CellUID = styled.div`
   position: absolute;
   top: 0px;
   left: 0px;
   padding: 0.75em;
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
`;

export const BoardRow = styled.div`
   display: flex;
   height: 25%;
`;

export const BoardContainer = styled.div`
   //border: 3px solid ${Color.darkThm.accent};
   height: 100%;
   width: 100%;
   border-radius: 1em;
`;
