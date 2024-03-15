import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../../global/css/colors';

export const Cell = styled.div<{ noOfTableRows?: number }>`
   width: ${({ noOfTableRows }) => `calc(100% / ${noOfTableRows || 3})`};
   text-align: center;
   padding-left: 0.5em;
   padding-right: 0.5em;
   box-sizing: border-box;
   word-wrap: break-word;
   text-overflow: ellipsis;
   hyphens: auto;
`;

export const RowContainer = styled.div<{
   isThisUser?: boolean;
   currentTurn?: boolean;
}>`
   display: flex;
   border-bottom: 1px solid ${Color.darkThm.accent};
   border-left: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.75)};
   border-right: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.75)};
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
   ${MyCSS.Scrollbar.hide};
   //mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
`;

export const HeaderRowContainer = styled.div<{ height?: string }>`
   position: absolute;
   height: ${({ height }) => height || '2.5em'};
   width: 100%;
   display: flex;
   align-items: center;
   border: 1px solid ${Color.darkThm.accent};
   background-color: ${Color.darkThm.dialog};
   border-top-right-radius: 1em;
   border-top-left-radius: 1em;
   box-sizing: border-box;
   margin-top: 0.5em;
`;

export const DataTableWrapper = styled.div`
   position: absolute;
   margin-bottom: 1em;
   top: 4em;
   bottom: 0;
   right: 1em;
   left: 1em;
`;

// ------ NEW BELOW ------

export const TableCell = styled.div``;

export const TableRow = styled.div<{
   thisUser?: boolean;
   currentTurn?: boolean;
   disconnected?: boolean;
   spectating?: boolean;
}>`
   border-bottom: 1px solid ${Color.darkThm.accentDarkerShade};
   display: flex;
   text-align: center;
   color: ${({ thisUser, currentTurn, disconnected, spectating }) => {
      if (thisUser) return Color.darkThm.error;
      if (disconnected || spectating) return 'grey';
      if (currentTurn) return 'yellow';
      return Color.darkThm.success;
   }};
   transition: color 0.2s;
`;

export const TableBody = styled.div`
   position: absolute;
   top: 2em;
   bottom: 0px;
   left: 0px;
   right: 0px;
   overflow-y: scroll;
   ${MyCSS.Scrollbar.gradientStyle};
   & > * {
      padding: 0.5em;
   }
`;

export const TableHead = styled.div`
   border-bottom: 2px solid ${Color.darkThm.accentDarkerShade};
   border-top: 2px solid ${Color.darkThm.accentDarkerShade};
   height: 2em;
   display: flex;
   align-items: center;
   text-align: center;
   padding-left: 0.5em;
   padding-right: 0.5em;
   box-sizing: border-box;
   color: ${Color.setRgbOpacity(Color.darkThm.dialogBright, 1)};
   filter: brightness(1.25);
`;

export const TableContainer = styled.div<{
   noOfColumns: number;
   localStyles?: FlattenSimpleInterpolation;
}>`
   height: 100%;
   width: 100%;
   box-sizing: border-box;
   position: relative;
   font-size: 0.8em;
   ${({ localStyles }) => localStyles};
   ${TableCell} {
      width: ${({ noOfColumns }) => (1 / noOfColumns) * 100}%;
   }
`;
