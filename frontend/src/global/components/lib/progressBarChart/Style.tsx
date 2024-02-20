import styled, { keyframes } from 'styled-components';
import Color from '../../../css/colors';

const slideIn = keyframes`
   from {
      opacity: 0;
      transform: translateX(-100%);
   }
   to {
      opacity: 1;
      transform: translateX(0);
   }
`;

export const BarAndPercentageWrapper = styled.div`
   display: flex;
   align-items: center;
`;

export const BarTitle = styled.div`
   font-size: 0.9em;
   margin-bottom: 0.5em;
   margin-left: 0.5em;
`;

export const BarAndInfoWrapper = styled.div`
   margin-bottom: 0.5em;
`;

export const CompletedBar = styled.div<{
   completedPercentage: number;
   color?: string;
   isDarkTheme: boolean;
}>`
   position: absolute;
   height: 100%;
   background-image: ${({ completedPercentage }) =>
      `linear-gradient(90deg, ${'rgba(0,0,0,0)'} -50%, ${Color.darkThm.accent} ${
         100 - completedPercentage + 100
      }%)`};

   border-top-right-radius: 10px;
   border-bottom-right-radius: 10px;
   width: ${({ completedPercentage }) => completedPercentage}%;
   animation: ${slideIn} 0.5s ease-in-out;
`;

export const BarBackground = styled.div<{
   barWidth?: string;
   barHeight?: string;
   isDarkTheme: boolean;
}>`
   position: relative;
   display: flex;
   background-color: ${Color.setRgbOpacity(Color.darkThm.inactive, 0.7)};
   border-top-right-radius: 10px;
   border-bottom-right-radius: 10px;
   width: ${({ barWidth }) => barWidth || '20em'};
   height: ${({ barHeight }) => barHeight || '2em'};
   &:hover {
      border: ${Color.darkThm.accent};
      border-left: none;
      box-sizing: border-box;
   }
`;

export const TempContainer = styled.div`
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
`;
