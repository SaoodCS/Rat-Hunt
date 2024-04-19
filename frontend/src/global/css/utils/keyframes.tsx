import { css, type FlattenSimpleInterpolation } from 'styled-components';

export namespace CSS_Keyframes {
   export const fadeInAndOut = (durationSecs: number): FlattenSimpleInterpolation => css`
      animation: fadeInAndOut ${durationSecs}s linear;
      @keyframes fadeInThenOut {
         0% {
            opacity: 0;
         }
         10% {
            opacity: 1;
         }
         90% {
            opacity: 1;
         }
         100% {
            opacity: 0;
         }
      }
   `;
}
