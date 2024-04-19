import styled, { keyframes } from 'styled-components';
import CSS_Color from '../../../css/utils/colors';

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
   height: 100%;
   position: relative;
`;

export const BarTitle = styled.div`
   margin-bottom: 0.5em;
   margin-left: 0.5em;
`;

export const BarAndInfoWrapper = styled.div`
   margin-bottom: 0.8em;
`;

export const CompletedBar = styled.div<{
   completedPercentage: number;
   color?: string;
   isDarkTheme: boolean;
}>`
   position: absolute;
   height: 100%;
   background-image: ${({ completedPercentage, color }) =>
      `linear-gradient(90deg, ${'rgba(0,0,0,0)'} -50%, ${color} ${
         200 - completedPercentage + 200
      }%)`};
   filter: brightness(0.5);

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
   background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.inactive, 0.4)};
   border-top-right-radius: 10px;
   border-bottom-right-radius: 10px;
   width: ${({ barWidth }) => barWidth || '20em'};
   height: ${({ barHeight }) => barHeight || '2em'};
   &:hover {
      border: ${CSS_Color.darkThm.accent};
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
