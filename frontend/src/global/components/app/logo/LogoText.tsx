import styled from 'styled-components';

export const LogoText = styled.div<{ color?: string; size?: string }>`
   font-size: ${({ size }) => size || '8em'};
   color: ${({ color }) => color || '#6C32D1'};
   font-family: 'Stencil Std', fantasy;
   letter-spacing: 3px;
`;
