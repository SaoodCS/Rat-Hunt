import styled, { css } from 'styled-components';
import Color from '../../../css/utils/colors';

export const LogoText = styled.div<{ color?: string; size?: string; wrapAndHyphenate?: boolean }>`
   font-size: ${({ size }) => size || '8em'};
   color: ${({ color }) => color || Color.darkThm.accent};
   font-family: 'Backfired';
   @font-face {
      font-family: 'Backfired';
      src: url('/fonts/Backfired.ttf') format('truetype');
   }
   ${({ wrapAndHyphenate }) => {
      if (!wrapAndHyphenate) return css``;
      return css`
         word-wrap: break-word;
         hyphens: auto;
         text-overflow: ellipsis;
      `;
   }}
`;
