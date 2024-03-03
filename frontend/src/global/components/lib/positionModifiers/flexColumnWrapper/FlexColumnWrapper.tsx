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
`;
