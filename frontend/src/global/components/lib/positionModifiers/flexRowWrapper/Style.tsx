import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const FlexRowWrapper = styled.div<{
   justifyContent?: string;
   padding?: string;
   width?: string;
   height?: string;
   alignItems?: string;
   position?: string;
   bgColor?: string;
   margin?: string;
   color?: string;
   borderRadius?: string;
   left?: string;
   right?: string;
   top?: string;
   bottom?: string;
   localStyles?: FlattenSimpleInterpolation;
   filter?: string;
   fontSize?: string;
   flex?: number;
   boxSizing?: 'border-box' | 'content-box';
   animations?: { types: MyCSS.Animations.Types; durationSecs: number };
}>`
   display: flex;
   flex-direction: row;
   align-items: ${({ alignItems }) => (alignItems ? alignItems : 'center')};
   justify-content: ${({ justifyContent }): string =>
      justifyContent ? justifyContent : 'flex-start'};
   padding: ${({ padding }): string => (padding ? padding : '0')};
   width: ${({ width }): string => (width ? width : 'auto')};
   height: ${({ height }): string => (height ? height : 'auto')};
   position: ${({ position }): string => (position ? position : 'static')};
   background-color: ${({ bgColor }) => bgColor};
   margin: ${({ margin }): string => (margin ? margin : '0')};
   color: ${({ color }) => color};
   border-radius: ${({ borderRadius }) => borderRadius};
   left: ${({ left }) => left};
   right: ${({ right }) => right};
   top: ${({ top }) => top};
   bottom: ${({ bottom }) => bottom};
   filter: ${({ filter }) => filter};
   ${({ localStyles }) => localStyles};
   font-size: ${({ fontSize }) => fontSize};
   flex: ${({ flex }) => flex};
   box-sizing: ${({ boxSizing }) => boxSizing};
   ${({ animations }) =>
      animations ? MyCSS.Animations.multi(animations.types, animations.durationSecs) : null};
`;
