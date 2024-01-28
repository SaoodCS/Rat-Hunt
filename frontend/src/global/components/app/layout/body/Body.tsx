import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 10%;
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      left: 15%;
      width: 85dvw;
      bottom: 0;
   }
`;
