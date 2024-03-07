import styled from 'styled-components';
import MyCSS from '../../../../../../global/css/MyCSS';
import Color from '../../../../../../global/css/colors';

export const BtnContainer = styled.div`
   border: 1px solid ${Color.darkThm.accent};
   border-radius: 1em;
   margin-bottom: 0.5em;
   margin-top: 0.5em;
`;

export const GameDetailsContainer = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: space-evenly;
   padding-left: 1em;
`;

export const ScoreboardContainer = styled.div`
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   width: 100%;
   overflow: scroll;
   ${MyCSS.Scrollbar.hide};
`;
