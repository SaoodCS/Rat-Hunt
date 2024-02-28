import styled from 'styled-components';
import Color from '../../../../../global/css/colors';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';

export const Cell = styled.div`
   width: calc(100% / 3);
   text-align: center;
`;

export const RowContainer = styled.div<{ isThisUser?: boolean; currentTurn?: boolean }>`
   display: flex;
   border-bottom: 1px solid ${Color.darkThm.accent};
   padding-top: 0.5em;
   padding-bottom: 0.5em;
   font-size: 0.85em;
   ${LogoText} {
      color: ${({ isThisUser, currentTurn }) => {
         if (currentTurn) {
            return Color.setRgbOpacity(Color.darkThm.txt, 0.8);
         }
         if (isThisUser) {
            return Color.darkThm.accentAlt;
         }
         return Color.darkThm.accent;
      }};
   }
`;

export const UserRowsWrapper = styled.div`
   position: absolute;
   top: 2.5em;
   bottom: 0px;
   width: 100%;
   overflow: scroll;
`;

export const HeaderRowContainer = styled.div`
   position: absolute;
   height: 2.5em;
   width: 100%;
   display: flex;
   align-items: center;
   border-bottom: 1px solid ${Color.darkThm.accent};
`;

export const DataTableWrapper = styled.div`
   position: absolute;
   top: 2em;
   bottom: 0;
   right: 1em;
   left: 1em;
`;
