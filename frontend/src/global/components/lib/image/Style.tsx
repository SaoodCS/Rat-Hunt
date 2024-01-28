import styled from 'styled-components';

export const StyledImage = styled.img<{ width: string; height: string }>`
   width: ${({ width }) => width};
   height: ${({ height }) => height};
`;
