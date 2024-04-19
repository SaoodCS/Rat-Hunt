import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type GameHelper from '../../../../../../../../../../shared/app/GameHelper/GameHelper';
import CSS_Color from '../../../../../../../../global/css/utils/colors';

const flash = keyframes`
   0% {
      background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.warning, 1)};
   }
   50% {
      background-color: ${'rgba(0,0,0,0)'};
   }
   100% {
      background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.warning, 1)};
   }

`;

export const TableCell = styled.div``;

export const TableRow = styled.div<{
   thisUser?: boolean;
   currentTurn?: boolean;
   disconnected?: boolean;
   spectating?: boolean;
   gamePhase?: ReturnType<typeof GameHelper.Get.gamePhase>;
}>`
   border-bottom: 1px solid ${CSS_Color.darkThm.accentDarkerShade};
   display: flex;
   text-align: center;
   color: ${({ thisUser, currentTurn, disconnected, spectating }) => {
      if (thisUser) return CSS_Color.darkThm.error;
      if (disconnected || spectating) return 'grey';
      if (currentTurn) return CSS_Color.darkThm.success;
      return CSS_Color.darkThm.success;
   }};
   ${TableCell}:nth-child(2) {
      animation: ${({ currentTurn, gamePhase }) => {
         if (currentTurn && gamePhase === 'clue')
            return css`
               ${flash} 2s infinite
            `;
         return 'none';
      }};
   }
   ${TableCell}:nth-child(3) {
      animation: ${({ currentTurn, gamePhase }) => {
         if (currentTurn && gamePhase === 'votedFor')
            return css`
               ${flash} 2s infinite
            `;
         return 'none';
      }};
   }

   transition: color animation 0.2s;
`;

export const TableBody = styled.div`
   position: absolute;
   top: 2em;
   bottom: 0px;
   left: 0px;
   right: 0px;
   ${TableRow} {
      padding: 0.75em;
   }
`;

export const TableHead = styled.div`
   border-bottom: 2px solid ${CSS_Color.darkThm.accentDarkerShade};
   border-top: 2px solid ${CSS_Color.darkThm.accentDarkerShade};
   height: 2em;
   display: flex;
   align-items: center;
   text-align: center;
   padding-left: 0.5em;
   padding-right: 0.5em;
   box-sizing: border-box;
   color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.dialogBright, 1)};
   background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 1)};
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
            innerBorders ? `1px solid ${CSS_Color.darkThm.accentDarkerShade}` : 'none'};
      }
   }
`;
