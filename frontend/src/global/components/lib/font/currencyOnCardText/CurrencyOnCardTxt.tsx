import styled from 'styled-components';
import Color from '../../../../css/colors';

export const CurrencyOnCardTxt = styled.span<{ isDarkTheme: boolean; color?: string }>`
   display: inline-block;
   transform: scale(1.05, 0.95);
   -webkit-transform: scale(1.05, 0.95);
   letter-spacing: 0.02em;
   color: ${({ isDarkTheme, color }) =>
      color ? color : isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt};
   text-shadow: ${({ isDarkTheme, color }) =>
      `0.5px 0.5px 0.5px ${
         color
            ? color
            : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 1)
      }`};
   font-size: 1.75em;
   &:after {
      content: 'GBP';
      font-size: 0.5em;
      margin-left: 0.2em;
      text-shadow: none;
      letter-spacing: 0;
      font-weight: 100;
   }
`;
