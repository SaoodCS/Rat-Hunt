import styled from 'styled-components';

export const VerticalSeperator = styled.div<{ margTopEm?: number; margBottomEm?: number }>`
   margin-top: ${({ margTopEm }) => (margTopEm ? `${margTopEm}em` : '0.5em')};
   margin-bottom: ${({ margBottomEm }) => (margBottomEm ? `${margBottomEm}em` : '0.5em')};
`;
