import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export namespace CSS_Media {
   export namespace PortableBp {
      export const asNum = 850;
      export const asPx = `${PortableBp.asNum}px`;
   }

   export namespace Query {
      export function desktop(styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation {
         return css`
            @media (min-width: ${PortableBp.asPx}) {
               ${styles}
            }
         `;
      }

      export function mobile(styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation {
         return css`
            @media (max-width: ${PortableBp.asPx}) {
               ${styles}
            }
         `;
      }

      export function tablet(styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation {
         return css`
            @media (max-width: ${PortableBp.asPx}) {
               ${styles}
            }
         `;
      }

      export function short(styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation {
         return css`
            @media (max-height: 700px) {
               ${styles}
            }
         `;
      }
   }
}
