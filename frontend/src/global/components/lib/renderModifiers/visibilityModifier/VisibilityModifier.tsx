import styled from 'styled-components';

export const VisibilityModifier = styled.div<{ isVisible: boolean }>`
   all: unset;
   visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
   opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
   transition: opacity 0.4s ease-in-out;
`;
