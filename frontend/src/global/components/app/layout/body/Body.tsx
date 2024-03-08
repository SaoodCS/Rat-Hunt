import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 0;
   background: linear-gradient(
      to bottom,
      ${Color.setRgbOpacity(Color.darkThm.accent, 0)},
      ${Color.setRgbOpacity(Color.darkThm.accent, 0.1)}
   );
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      margin-top: 20px;
   }
`;
