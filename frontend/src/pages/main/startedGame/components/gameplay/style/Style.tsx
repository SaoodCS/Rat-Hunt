import styled from 'styled-components';
import Color from '../../../../../../global/css/colors';

export const GameStateTableWrapper = styled.div`
   position: absolute;
   left: 0px;
   right: 0px;
   box-sizing: border-box;
   top: 3em;
   bottom: 0;
`;

export const FormContainer = styled.div`
   box-sizing: border-box;
   filter: brightness(0.8);
   height: 100%;
   width: 100%;
   color: ${Color.darkThm.accentDarkerShade};
   z-index: 1;
`;

export const CurrentTurnAndFormWrapper = styled.div`
   border-bottom: 1px solid ${Color.darkThm.accentDarkerShade};
   width: 100%;
   box-sizing: border-box;
   height: 3em;
   display: flex;
   flex-direction: column;
   justify-content: center;
   z-index: -1;
`;
