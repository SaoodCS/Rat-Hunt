import { css } from 'styled-components';
import { CSS_Media } from './media';

export namespace CSS_Clickables {
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
            @media (max-width: ${CSS_Media.PortableBp.asPx}) {
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
            @media (max-width: ${CSS_Media.PortableBp.asPx}) {
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
            @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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
            @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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
            @media (min-width: ${CSS_Media.PortableBp.asPx}) {
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
export default CSS_Clickables;
