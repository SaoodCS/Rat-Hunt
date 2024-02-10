import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 0;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      margin-top: 20px;
      left: 5vw;
      width: 90dvw;
   }
`;
