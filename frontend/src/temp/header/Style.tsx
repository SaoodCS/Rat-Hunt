import styled from "styled-components";
import Color from "../../global/css/colors";

export const ScoreboardBtnContainer = styled.div`
   position: absolute;
   top: 0;
   right: 0;
   border: 1px solid ${Color.darkThm.accent};
   height: fit-content;
   margin-top: 1em;
   margin-right: 1em;
   border-radius: 1em;
`;

export const GameDetailsContainer = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: space-evenly;
   padding-left: 1em;
`;