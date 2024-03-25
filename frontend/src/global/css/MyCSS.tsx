import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import Color from './colors';
import type { CSSProperties } from 'react';

export namespace MyCSS {
   export class PortableBp {
      static asNum = 850;
      static asPx = `${PortableBp.asNum}px`;
   }

   export class Media {
      static desktop = (styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation => css`
         @media (min-width: ${PortableBp.asPx}) {
            ${styles}
         }
      `;

      static mobile = (styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation => css`
         @media (max-width: ${PortableBp.asPx}) {
            ${styles}
         }
      `;

      static tablet = (styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation => css`
         @media (max-width: ${PortableBp.asPx}) {
            ${styles}
         }
      `;

      static short = (styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation => css`
         @media (max-height: 700px) {
            ${styles}
         }
      `;
   }

   export namespace Clickables {
      export const removeDefaultEffects = css`
         background: none;
         border: none;
         user-select: none;
         text-decoration: none;
         -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
         -webkit-touch-callout: none;
      `;

      export const portable = {
         changeColorOnClick: (
            changeToColor: string,
            property: 'background-color' | 'color' | 'border',
            postClick: 'revert' | 'persist',
         ) => {
            const selector = postClick === 'persist' ? '&:hover' : '&:active';
            const propVal = property === 'border' ? `1px solid ${changeToColor}` : changeToColor;
            return css`
               @media (max-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: ${property} 0.2s;
                  ${selector} {
                     ${`${property}: ${propVal};`}
                  }
               }
            `;
         },
         changeBrightnessOnClick: (amount: number, postClick: 'revert' | 'persist') => {
            const selector = postClick === 'persist' ? '&:hover' : '&:active';
            return css`
               @media (max-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: filter 0.2s;
                  ${selector} {
                     filter: brightness(${amount});
                  }
               }
            `;
         },
      };

      export const desktop = {
         changeColorOnClick: (
            changeToColor: string,
            property: 'background-color' | 'color' | 'border',
            postClick: 'revert' | 'persist',
         ) => {
            const selector = postClick === 'revert' ? '&:active' : '&:active, &:focus'; // the else part doesn't work
            const propVal = property === 'border' ? `1px solid ${changeToColor}` : changeToColor;
            return css`
               @media (min-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: ${property} 0.2s;
                  ${selector} {
                     ${`${property}: ${propVal};`}
                  }
               }
            `;
         },
         changeColorOnHover: (
            changeToColor: string,
            property: 'background-color' | 'color' | 'border',
         ) => {
            const selector = '&:hover';
            const propVal = property === 'border' ? `1px solid ${changeToColor}` : changeToColor;
            return css`
               @media (min-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: ${property} 0.2s;
                  ${selector} {
                     ${`${property}: ${propVal};`}
                  }
               }
            `;
         },
         changeBrightnessOnHover: (amount: number) => {
            const selector = '&:hover';
            return css`
               @media (min-width: ${MyCSS.PortableBp.asPx}) {
                  cursor: pointer;
                  transition: filter 0.2s;
                  ${selector} {
                     filter: brightness(${amount});
                  }
               }
            `;
         },
      };
   }

   export class LayoutStyle {
      static paddingBorderBox = (paddingAmount: string): FlattenSimpleInterpolation => css`
         box-sizing: border-box;
         padding: ${paddingAmount};
      `;
   }

   export class Scrollbar {
      static hide = css`
         scrollbar-width: none;
         ::-webkit-scrollbar {
            display: none;
         }
      `;

      static show = css`
         scrollbar-width: thin;
         ::-webkit-scrollbar {
            display: block;
         }
      `;

      static gradientStyle = css`
         ::-webkit-scrollbar {
            width: 0.25em;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 10em;
            border: none;
         }
         ::-webkit-scrollbar-thumb {
            background-image: -webkit-gradient(
               linear,
               left bottom,
               left top,
               color-stop(0.44, ${Color.setRgbOpacity(Color.darkThm.accent, 0.7)}),
               color-stop(0.72, ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)}),
               color-stop(0.86, ${Color.setRgbOpacity(Color.darkThm.accent, 0.3)}),
               color-stop(1, ${Color.setRgbOpacity(Color.darkThm.accent, 0.1)})
            );
            border-radius: 8px;
         }
         ::-webkit-scrollbar-thumb:hover {
            background-color: #ffffff;
         }
      `;
   }

   export class Helper {
      static concatStyles = (
         ...styles: FlattenSimpleInterpolation[]
      ): FlattenSimpleInterpolation => css`
         ${styles.reduce(
            (acc, cur) => css`
               ${acc}
               ${cur}
            `,
         )}
      `;

      static convertInlineToStyledComp(styles: CSSProperties): FlattenSimpleInterpolation {
         const cssString = Object.entries(styles).reduce((acc, [key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${acc}${cssKey}: ${value};`;
         }, '');
         return css`
            ${cssString}
         `;
      }
   }
}

export default MyCSS;
