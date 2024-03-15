import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../../global/css/colors';

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
   background-color: ${Color.setRgbOpacity(Color.darkThm.bg, 1)};
   filter: brightness(1.3);
`;

export const TableContainer = styled.div<{
   noOfColumns: number;
   localStyles?: FlattenSimpleInterpolation;
   fontSize?: string;
   innerBorders?: boolean;
}>`
   height: 100%;
   width: 100%;
   box-sizing: border-box;
   position: relative;
   font-size: ${({ fontSize }) => fontSize || '0.8em'};
   ${({ localStyles }) => localStyles};
   ${TableCell} {
      width: ${({ noOfColumns }) => (1 / noOfColumns) * 100}%;
      // for every table cell except the last one:
      &:not(:last-child) {
         border-right: ${({ innerBorders }) =>
            innerBorders ? `1px solid ${Color.darkThm.accentDarkerShade}` : 'none'};
      }
   }
`;
