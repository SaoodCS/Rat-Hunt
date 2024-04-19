import { css } from 'styled-components';
import CSS_Color from './colors';

export namespace CSS_Scrollbar {
   export const hide = css`
      scrollbar-width: none;
      ::-webkit-scrollbar {
         display: none;
      }
   `;

   export const show = css`
      scrollbar-width: thin;
      ::-webkit-scrollbar {
         display: block;
      }
   `;

   export const gradientStyle = css`
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
            color-stop(0.44, ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.7)}),
            color-stop(0.72, ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.5)}),
            color-stop(0.86, ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.3)}),
            color-stop(1, ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.1)})
         );
         border-radius: 8px;
      }
      ::-webkit-scrollbar-thumb:hover {
         background-color: #ffffff;
      }
   `;
}
