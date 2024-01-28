import styled from 'styled-components';
import Color from '../../../../css/colors';

export const CardLoadingPlaceholder = styled.div<{ isDarkTheme: boolean }>`
   position: relative;
   width: 100%;
   height: 100%;
   border-radius: 8px;
   overflow: hidden;
   &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
         to right,
         ${(props) =>
               props.isDarkTheme
                  ? Color.setRgbOpacity(Color.lightThm.bg, 0.05)
                  : Color.setRgbOpacity(Color.darkThm.bg, 0.05)}
            0%,
         ${(props) =>
               props.isDarkTheme
                  ? Color.setRgbOpacity(Color.lightThm.bg, 0.1)
                  : Color.setRgbOpacity(Color.darkThm.bg, 0.1)}
            20%,
         ${(props) =>
               props.isDarkTheme
                  ? Color.setRgbOpacity(Color.lightThm.bg, 0.2)
                  : Color.setRgbOpacity(Color.darkThm.bg, 0.2)}
            40%
      );
      animation: loading 1.5s infinite;
   }

   @keyframes loading {
      0% {
         transform: translateX(-150%);
      }
      100% {
         transform: translateX(150%);
      }
   }
`;
