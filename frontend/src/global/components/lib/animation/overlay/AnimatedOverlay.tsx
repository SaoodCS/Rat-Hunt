import styled from 'styled-components';
import { SimpleAnimator } from '../simpleAnimator/SimpleAnimator';

export const AnimatedOverlay = styled(SimpleAnimator)<{
   zIndex?: number;
   color: string;
   filter?: string;
}>`
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   backdrop-filter: blur(5px);
   z-index: ${({ zIndex }) => zIndex};
   filter: ${({ filter }) => filter};
   background-color: ${({ color }) => color};
`;
