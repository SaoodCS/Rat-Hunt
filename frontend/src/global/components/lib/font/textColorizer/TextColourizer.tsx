import styled, { css } from 'styled-components';

export const TextColourizer = styled.span<{
   color?: string;
   fontSize?: string;
   bold?: boolean;
   padding?: string;
   textAlign?: string;
   thickening?: { color: string; amount: number };
   brightness?: number;
   gradient?: { deg: string; startColor: string; endColor: string };
}>`
   font-size: ${({ fontSize }) => (fontSize ? fontSize : '1em')};
   color: ${({ color }) => color};
   font-weight: ${({ bold }) => (bold ? '600' : '400')};
   padding: ${({ padding }) => padding};
   text-align: ${({ textAlign }) => textAlign};
   text-shadow: ${({ thickening }) =>
      thickening
         ? `${thickening.amount}px ${thickening.amount}px ${thickening.amount}px ${thickening.color}`
         : 'none'};
   filter: ${({ brightness }) => `brightness(${brightness || 1})`};
   ${({ gradient }) => {
      if (gradient) {
         return css`
            background: linear-gradient(
               ${gradient.deg},
               ${gradient.startColor},
               ${gradient.endColor}
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
         `;
      }
   }}
`;
