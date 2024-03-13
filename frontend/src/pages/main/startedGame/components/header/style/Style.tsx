import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../../../global/css/MyCSS';
import Color from '../../../../../../global/css/colors';

export const BtnContainer = styled.div`
   border: 1px solid ${Color.darkThm.accent};
   border-radius: 1em;
   margin-bottom: 0.5em;
   margin-top: 0.5em;
`;

export const ScoreboardContainer = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   width: 100%;
   overflow: scroll;
   ${MyCSS.Scrollbar.hide};
   ${({ localStyles }) => localStyles};
`;

export const ItemValue = styled.div<{ color?: string; ratUser?: boolean }>`
   box-sizing: border-box;
   padding-left: 1em;
   padding-right: 1em;
   color: ${({ color, ratUser }) =>
      color && !ratUser ? Color.darkThm.success : Color.darkThm.error};
   width: ${({ ratUser }) => (ratUser ? '100%' : '80%')};
   /* text-align: ${({ ratUser }) => (ratUser ? 'center' : 'start')}; */
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

export const RoomIDScoreboardItem = styled.div`
   ${MyCSS.Clickables.removeDefaultEffects};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.5)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.5, 'revert')};
   border-bottom: 1px solid ${Color.darkThm.accent};
   width: 50%;
   box-sizing: border-box;
   margin-left: 0.5em;
   margin-right: 0.5em;
   text-align: center;
   border-radius: 0.75em;
   padding-bottom: 0.25em;
   color: ${Color.darkThm.warning};
   filter: brightness(0.8);
   max-width: 20em;
`;

export const RoomIDScoreboardWrapper = styled.div`
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
   box-sizing: border-box;
   
   //margin-bottom: 0.25em;
`;

export const GameDetailsContainer = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   width: 100%;
   max-height: 100%;
   display: flex;
   box-sizing: border-box;
   margin-top: 0.25em;
   //margin-bottom: 0.25em;
   flex-direction: column;
   justify-content: space-evenly;
   font-size: 0.8em;
   ${({ localStyles }) => localStyles}
`;
