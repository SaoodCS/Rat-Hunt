import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';

export const FlexCenterer = styled.div<{
   height?: string;
   width?: string;
   position?: string;
   left?: string;
   right?: string;
   padding?: string;
   localStyles?: FlattenSimpleInterpolation;
   color?: string;
}>`
   display: flex;
   justify-content: center;
   align-items: center;
   height: ${({ height }) => height || 'auto'};
   width: ${({ width }) => width || 'auto'};
   position: ${({ position }) => position || 'static'};
   left: ${({ left }) => left || 'auto'};
   right: ${({ right }) => right || 'auto'};
   padding: ${({ padding }) => padding};
   color: ${({ color }) => color};
   ${({ localStyles }) => localStyles};
`;
