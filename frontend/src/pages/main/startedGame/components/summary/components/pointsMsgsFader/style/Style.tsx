import styled from 'styled-components';

export const PointsItem = styled.div`
   height: 100%;
   width: 100%;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   animation: fade-in 1s linear;
   @keyframes fade-in {
      0% {
         opacity: 0;
      }
      100% {
         opacity: 1;
      }
   }
`;
