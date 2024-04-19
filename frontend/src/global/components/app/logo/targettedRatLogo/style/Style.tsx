import styled from 'styled-components';
import CSS_Color from '../../../../../css/utils/colors';

export const RatWrapper = styled.div`
   svg {
      fill: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.error, 1)};
   }
`;

export const TargetWrapper = styled.div`
   position: absolute;
   filter: brightness(1);
   svg {
      border-radius: 50%;
      fill: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.5)};
   }
`;

export const TargettedRatLogoContainer = styled.div<{ size: string }>`
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   width: ${({ size }) => size};
   height: ${({ size }) => size};
   box-sizing: border-box;
`;

export const InnerTarget = styled.div`
   position: absolute;
   border-radius: 50%;
   height: 79%;
   width: 79%;
   background: radial-gradient(
      circle at 50% 50%,
      ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.5)},
      ${CSS_Color.darkThm.bg}
   );
`;
