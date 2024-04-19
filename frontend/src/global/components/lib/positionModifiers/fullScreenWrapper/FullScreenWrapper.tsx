import styled, { css } from 'styled-components';

export const FullScreenWrapper = styled.div<{ centerContents?: boolean; zIndex?: number }>`
   position: fixed;
   top: 0;
   bottom: 0;
   left: 0;
   right: 0;
   z-index: ${({ zIndex }) => zIndex};
   ${({ centerContents }) => {
      if (!centerContents) return;
      return css`
         display: flex;
         align-items: center;
         justify-content: center;
      `;
   }}
`;
