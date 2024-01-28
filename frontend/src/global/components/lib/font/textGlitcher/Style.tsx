import styled, { keyframes } from 'styled-components';
const glitchAnimation = keyframes`
  2%, 64% {
    transform: translate(2px, 0) skew(0deg);
  }
  4%, 60% {
    transform: translate(-2px, 0) skew(0deg);
  }
  62% {
    transform: translate(0, 0) skew(5deg);
  }
`;

const glitchTopAnimation = keyframes`
  2%, 64% {
    transform: translate(2px, -2px);
  }
  4%, 60% {
    transform: translate(-2px, 2px);
  }
  62% {
    transform: translate(13px, -1px) skew(-13deg);
  }
`;

const glitchBottomAnimation = keyframes`
  2%, 64% {
    transform: translate(-2px, 0);
  }
  4%, 60% {
    transform: translate(-2px, 0);
  }
  62% {
    transform: translate(-22px, 5px) skew(21deg);
  }
`;

// Define the styled component for the div element
export const GlitchDiv = styled.div`
   animation: ${glitchAnimation} 1s linear infinite;
   position: relative;
   z-index: 1;
   //letter-spacing: -7px;
   font-size: 8rem;
   font-weight: 700;
   &:before,
   &:after {
      content: attr(title);
      position: absolute;
      left: 0;
      width: 100%;
   }
   &:before {
      animation: ${glitchTopAnimation} 1s linear infinite;
      clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
   }
   &:after {
      animation: ${glitchBottomAnimation} 1.5s linear infinite;
      clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
      -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
   }
`;
