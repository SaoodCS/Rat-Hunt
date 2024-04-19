import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import Color from '../../../../../../global/css/utils/colors';

export const ItemValue = styled.div<{ color?: string; ratUser?: boolean }>`
   box-sizing: border-box;
   padding-left: 1em;
   padding-right: 1em;
   color: ${({ color, ratUser }) =>
      color && !ratUser ? Color.darkThm.success : Color.darkThm.error};
   width: ${({ ratUser }) => (ratUser ? '100%' : '80%')};
   filter: ${({ ratUser }) => (ratUser ? 'brightness(0.8)' : 'brightness(0.8)')};
`;

export const ItemLabel = styled.div<{ color?: string }>`
   width: 20%;
   box-sizing: border-box;
   padding-left: 1em;
   filter: brightness(0.8);
   color: ${({ color }) => color || Color.darkThm.accent};
`;

export const GameDetailsItemWrapper = styled.div`
   border-bottom: 1px solid ${Color.darkThm.accentDarkerShade};
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
   box-sizing: border-box;
`;

export const GameDetailsContainer = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   width: 100%;
   max-height: 100%;
   display: flex;
   box-sizing: border-box;
   margin-top: 0.25em;
   flex-direction: column;
   justify-content: space-evenly;
   font-size: 0.8em;
   ${({ localStyles }) => localStyles}
`;
