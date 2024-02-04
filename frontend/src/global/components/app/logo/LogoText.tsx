import styled from 'styled-components';
import Color from '../../../css/colors';

export const LogoText = styled.div<{ color?: string; size?: string }>`
   font-size: ${({ size }) => size || '8em'};
   color: ${({ color }) => color || Color.darkThm.accent};
   font-family: 'Backfired';
   @font-face {
      font-family: 'Backfired';
      src: url('/fonts/Backfired.ttf') format('truetype');
   }
`;
