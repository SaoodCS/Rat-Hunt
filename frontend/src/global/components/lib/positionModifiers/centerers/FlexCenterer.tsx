import styled from 'styled-components';

export const FlexCenterer = styled.div<{ height?: string; width?: string; position?: string }>`
   display: flex;
   justify-content: center;
   align-items: center;
   height: ${({ height }) => height || 'auto'};
   width: ${({ width }) => width || 'auto'};
   position: ${({ position }) => position || 'static'};
`;
