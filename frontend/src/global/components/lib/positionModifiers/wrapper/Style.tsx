import styled from 'styled-components';

export const Wrapper = styled.div<{ padding?: string; overflow?: string; flex?: number }>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   overflow: ${({ overflow }) => overflow};
   flex: ${({ flex }) => flex};
`;
