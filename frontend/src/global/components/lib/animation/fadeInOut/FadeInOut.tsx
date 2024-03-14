import styled, { keyframes } from 'styled-components';

export const FadeInOut = styled.div`
   animation: ${keyframes`
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
   `} 2s linear infinite;
`;
