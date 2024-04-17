import styled from 'styled-components';
import Color from '../../../../css/colors';

export const RatWrapper = styled.div`
   svg {
      fill: ${Color.setRgbOpacity(Color.darkThm.accent, 1)};
   }
   z-index: 1;
   filter: brightness(0.45);
`;

export const GradientBgLogoContainer = styled.div<{ size: string }>`
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   width: ${({ size }) => size};
   height: ${({ size }) => size};
   box-sizing: border-box;
`;

export const GradientBg = styled.div`
   position: absolute;
   border-radius: 50%;
   height: 100%;
   width: 100%;
   background: radial-gradient(
      circle at 50% 50%,
      ${Color.setRgbOpacity(Color.darkThm.accent, 1)} 0%,
      ${Color.setRgbOpacity(Color.darkThm.bg, 1)} 95%
   );
   filter: brightness(1);
`;
