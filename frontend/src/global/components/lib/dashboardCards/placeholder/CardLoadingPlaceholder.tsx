import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

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
                  ? CSS_Color.setRgbOpacity(CSS_Color.lightThm.bg, 0.05)
                  : CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.05)}
            0%,
         ${(props) =>
               props.isDarkTheme
                  ? CSS_Color.setRgbOpacity(CSS_Color.lightThm.bg, 0.1)
                  : CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.1)}
            20%,
         ${(props) =>
               props.isDarkTheme
                  ? CSS_Color.setRgbOpacity(CSS_Color.lightThm.bg, 0.2)
                  : CSS_Color.setRgbOpacity(CSS_Color.darkThm.bg, 0.2)}
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
