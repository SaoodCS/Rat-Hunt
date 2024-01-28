import styled from 'styled-components';

export const TextColourizer = styled.span<{
   color?: string;
   fontSize?: string;
   bold?: boolean;
   padding?: string;
   textAlign?: string;
   thickening?: { color: string; amount: number };
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
`;
