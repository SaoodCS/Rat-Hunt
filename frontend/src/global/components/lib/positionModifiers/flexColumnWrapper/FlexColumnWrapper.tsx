import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';

export const FlexColumnWrapper = styled.div<{
   justifyContent?: string;
   alignItems?: string;
   padding?: string;
   height?: string;
   width?: string;
   position?: string;
   right?: string;
   filter?: string;
   boxSizing?: string;
   margin?: string;
   top?: string;
   bottom?: string;
   left?: string;
   background?: string;
   zIndex?: number;
   borderRadius?: string;
   backdropFilter?: string;
   localStyles?: FlattenSimpleInterpolation;
}>`
   display: flex;
   flex-direction: column;
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
   height: ${({ height }) => height};
   align-items: ${({ alignItems }) => (alignItems ? alignItems : '')};
   position: ${({ position }) => (position ? position : 'static')};
   width: ${({ width }) => (width ? width : 'auto')};
   right: ${({ right }) => right};
   filter: ${({ filter }) => filter};
   box-sizing: ${({ boxSizing }) => boxSizing};
   margin: ${({ margin }) => margin};
   top: ${({ top }) => top};
   bottom: ${({ bottom }) => bottom};
   left: ${({ left }) => left};
   background: ${({ background }) => background};
   z-index: ${({ zIndex }) => zIndex};
   border-radius: ${({ borderRadius }) => borderRadius};
   backdrop-filter: ${({ backdropFilter }) => backdropFilter};
   ${({ localStyles }) => localStyles};
`;
