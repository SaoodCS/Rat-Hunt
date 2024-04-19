import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

export const RatWrapper = styled.div`
   svg {
      fill: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 1)};
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
      ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 1)} 0%,
      ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 1)} 95%
   );
   filter: brightness(1);
`;
