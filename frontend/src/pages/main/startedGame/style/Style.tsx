import styled, { css } from 'styled-components';
import Color from '../../../../global/css/colors';
import MyCSS from '../../../../global/css/MyCSS';

export const GamePageWrapper = styled.div`
   height: 100%;
   background: linear-gradient(
      to bottom,
      ${Color.setRgbOpacity(Color.darkThm.accent, 0)},
      ${Color.setRgbOpacity(Color.darkThm.accent, 0.1)},
      ${Color.setRgbOpacity(Color.darkThm.accent, 0.1)}
   );
`;

export const GameHeaderWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   border-top: 2px solid ${Color.darkThm.accent};
   position: absolute;
   width: 100%;
   top: 0;
   bottom: 80%;
   filter: brightness(1.25);
`;

export const GameplayWrapper = styled.div`
   position: absolute;
   width: 100%;
   top: 20%;
   bottom: 50%;
   border-top: 2px solid ${Color.darkThm.accent};
   border-top-right-radius: 1em;
   border-top-left-radius: 1em;
   filter: brightness(1.25);
`;

export const TopicBoardWrapper = styled.div`
   border-top-right-radius: 1em;
   border-top-left-radius: 1em;
   border-bottom: 1px solid ${Color.darkThm.accent};
   border-top: 2px solid ${Color.darkThm.accent};
   position: absolute;
   width: 100%;
   bottom: 0;
   top: 50%;
   filter: brightness(1.25);
`;
