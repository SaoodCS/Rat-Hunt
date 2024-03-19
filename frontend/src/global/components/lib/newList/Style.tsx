import styled from 'styled-components';

export const ListItem = styled.li`
   & + & {
      margin-top: 0.5em;
   }
`;

export const OrderedList = styled.ol<{
   bulletType?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha';
   padding?: string;
   margin?: string;
   bulletColor?: string;
   bulletBold?: boolean;
   bulletAndTextSpacing?: string;
}>`
   list-style-type: ${({ bulletType }) => bulletType};
   padding: ${({ padding }) => padding};
   margin: ${({ margin }) => margin};
   & > ${ListItem}::marker {
      color: ${({ bulletColor }) => bulletColor};
      font-weight: ${({ bulletBold }) => (bulletBold ? 'bold' : 'normal')};
   }
   filter: brightness(1.3);
   line-height: 1.2;
   letter-spacing: 0.01em;

   & > ${ListItem} {
      padding-left: ${({ bulletAndTextSpacing }) => bulletAndTextSpacing};
   }
`;
