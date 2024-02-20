import styled from 'styled-components';

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
`;
