import styled from 'styled-components';
import Color from '../../../../global/css/colors';
import { Wrapper } from '../../../../global/components/lib/positionModifiers/wrapper/Style';

const headerHeightAsPercentage = 12;
const gameplayHeightAsPercentage = 43;

export const GamePageWrapper = styled(Wrapper)`
   height: 100%;
`;

export const GameHeaderWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   border-top: 2px solid ${Color.darkThm.accent};
   position: absolute;
   width: 100%;
   top: 0;
   bottom: calc(100% - ${headerHeightAsPercentage}%);
   filter: brightness(1.25);
`;

export const GameStateWrapper = styled.div`
   position: absolute;
   width: 100%;
   top: ${headerHeightAsPercentage}%;
   height: ${gameplayHeightAsPercentage}%;
   border-top: 2px solid ${Color.darkThm.accent};
   border-top-right-radius: 1em;
   border-top-left-radius: 1em;
   filter: brightness(1.25);
`;

export const TopicBoardWrapper = styled.div`
   border-top-right-radius: 1em;
   border-top-left-radius: 1em;
   border-top: 2px solid ${Color.darkThm.accent};
   position: absolute;
   width: 100%;
   bottom: 0;
   top: calc(${headerHeightAsPercentage}% + ${gameplayHeightAsPercentage}%);
   filter: brightness(1.25);
`;
