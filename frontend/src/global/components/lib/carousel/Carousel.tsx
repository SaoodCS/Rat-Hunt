import styled from 'styled-components';

export const CarouselContainer = styled.div`
   overflow: hidden;
   position: relative;
   display: flex;
   scroll-snap-type: x mandatory;
   scrollbar-width: none;
   -ms-overflow-style: none;
   overflow-x: scroll;

   &::-webkit-scrollbar {
      display: none;
   }
`;

export const CarouselSlide = styled.div<{ height: string }>`
   min-width: 100%;
   flex: 1;
   scroll-snap-align: start;
   display: flex;
   //justify-content: center;
   overflow: hidden;
   overflow-y: scroll;
   height: ${({ height }) => height};
   ::-webkit-scrollbar {
      display: none;
   }
`;
