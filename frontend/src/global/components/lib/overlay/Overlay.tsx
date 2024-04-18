import styled from 'styled-components';

export const Overlay = styled.div<{
   color?: React.CSSProperties['backgroundColor'];
   zIndex?: React.CSSProperties['zIndex'];
   filter?: React.CSSProperties['filter'];
   backdropFilter?: React.CSSProperties['backdropFilter'];
}>`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: ${({ color }) => color};
   z-index: ${({ zIndex }) => zIndex};
   filter: ${({ filter }) => filter};
   backdrop-filter: ${({ backdropFilter }) => backdropFilter};
   overflow: hidden;
`;
