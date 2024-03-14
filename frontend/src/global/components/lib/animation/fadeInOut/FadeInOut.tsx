import styled, { keyframes } from 'styled-components';

export const FadeInOut = styled.div<{
   width?: string;
   display?: string;
   alignItems?: string;
   fontSize?: string;
}>`
   width: ${({ width }) => width};
   display: ${({ display }) => display};
   align-items: ${({ alignItems }) => alignItems};
   font-size: ${({ fontSize }) => fontSize};
   animation: ${keyframes`
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
   `} 2s linear infinite;
`;
