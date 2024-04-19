import type { CSSProperties } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export namespace CSS_Helper {
   export const concatStyles = (
      ...styles: FlattenSimpleInterpolation[]
   ): FlattenSimpleInterpolation => {
      return css`
         ${styles.reduce(
            (acc, cur) => css`
               ${acc}
               ${cur}
            `,
         )}
      `;
   };

   export function convertInlineToStyledComp(styles: CSSProperties): FlattenSimpleInterpolation {
      const cssString = Object.entries(styles).reduce((acc, [key, value]) => {
         const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
         return `${acc}${cssKey}: ${value};`;
      }, '');
      return css`
         ${cssString}
      `;
   }
}

export default CSS_Helper;
