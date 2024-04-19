import styled from 'styled-components';
import { CSS_Media } from '../../../../css/utils/media';

export const Body = styled.div<{ isDarkTheme: boolean }>`
   position: fixed;
   width: 100dvw;
   top: 10%;
   bottom: 0;
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      margin-top: 20px;
   }
`;
