import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

export const Switcher = styled.div<{ isOn: boolean; isDarkTheme: boolean; size: string }>`
   display: inline-block;
   background-color: ${({ isOn, isDarkTheme }) =>
      isOn
         ? isDarkTheme
            ? CSS_Color.darkThm.accent
            : CSS_Color.lightThm.accent
         : isDarkTheme
           ? CSS_Color.darkThm.inactive
           : CSS_Color.darkThm.inactive};
   border-radius: ${({ size }) => size};
   width: ${({ size }) => `calc(${size} * 1.867)`};
   height: ${({ size }) => size};
   transition: background-color 0.3s ease;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   position: relative;

   &::after {
      content: '';
      position: relative;
      display: block;
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? CSS_Color.darkThm.bg : CSS_Color.lightThm.bg};
      border-radius: 50%;
      width: ${({ size }) => `calc(${size} * 0.867)`};
      height: ${({ size }) => `calc(${size} * 0.867)`};
      top: ${({ size }) => `calc(${size} * 0.067)`};
      left: ${({ isOn, size }) =>
         isOn ? `calc(100% - (${size} * 0.933))` : `calc(${size} * 0.076)`};
      transition: left 0.3s ease;
   }

   &::before {
      ${({ isOn }) =>
         isOn &&
         `
        content: 'ON';
        `}
      ${({ isOn }) => !isOn && ` content: 'OFF';`}
      position: absolute;
      display: block;
      top: 50%;
      left: ${({ isOn }) => (isOn ? '26%' : '74%')};
      transform: translate(-50%, -50%);
      color: ${({ isDarkTheme }) =>
         CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.bg : CSS_Color.lightThm.bg, 0.8)};
      font-size: ${({ size }) => `calc(${size} * 0.333)`};
      transition: content 0.3s ease;
      font-weight: 600;
   }
`;
