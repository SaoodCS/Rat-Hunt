import styled from 'styled-components';

export const TransparentOverlay = styled.div<{ zIndex?: number }>`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   z-index: ${({ zIndex }) => zIndex || 0};
   background-color: transparent;
   overflow: hidden;
`;
