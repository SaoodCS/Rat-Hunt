import styled from 'styled-components';
import Color from '../../../../../../global/css/colors';
import MyCSS from '../../../../../../global/css/MyCSS';

export const Cell = styled.div<{ noOfTableRows?: number }>`
   width: ${({ noOfTableRows }) => `calc(100% / ${noOfTableRows || 3})`};
   text-align: center;
`;

export const RowContainer = styled.div<{ isThisUser?: boolean; currentTurn?: boolean }>`
   display: flex;
   border-bottom: 1px solid ${Color.darkThm.accent};
   padding-top: 0.5em;
   padding-bottom: 0.5em;
   font-size: 0.85em;
   background-color: ${({ isThisUser, currentTurn }) => {
      if (currentTurn) {
         return Color.setRgbOpacity(Color.darkThm.accentAlt, 0.1);
      }
      if (isThisUser) {
         return Color.setRgbOpacity(Color.darkThm.accent, 0.1);
      }
      return 'transparent';
   }};
`;

export const UserRowsWrapper = styled.div<{ headerRowHeight?: string }>`
   position: absolute;
   top: ${({ headerRowHeight }) => headerRowHeight || '2.5em'};
   bottom: 0px;
   width: 100%;
   overflow-y: scroll;
   ${MyCSS.Scrollbar.gradientStyle};
`;

export const HeaderRowContainer = styled.div<{ height?: string }>`
   position: absolute;
   height: ${({ height }) => height || '2.5em'};
   width: 100%;
   display: flex;
   align-items: center;
   border-bottom: 1px solid ${Color.darkThm.accent};
`;

export const DataTableWrapper = styled.div`
   position: absolute;
   top: 4em;
   bottom: 0;
   right: 1em;
   left: 1em;
`;
