import styled from 'styled-components';

export const Wrapper = styled.div<{
   padding?: string;
   overflow?: string;
   flex?: number;
   height?: string;
   width?: string;
}>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   overflow: ${({ overflow }) => overflow};
   flex: ${({ flex }) => flex};
   height: ${({ height }) => height};
   width: ${({ width }) => width};
`;
