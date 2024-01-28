import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const DimOverlay = styled.div<{ isDisplayed: boolean }>`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 1;
   backdrop-filter: blur(5px);
   opacity: ${({ isDisplayed }) => (isDisplayed ? 1 : 0)};
   transition: opacity 0.2s ease-in-out;
   animation: ${fadeIn} 0.2s linear;
`;
