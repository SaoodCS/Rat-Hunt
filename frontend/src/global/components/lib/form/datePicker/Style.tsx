import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';
import styled, { css } from 'styled-components';
import Color from '../../../../css/colors';

interface IInputAttr {
   isRequired: boolean;
   isDisabled: boolean;
}

export const DatePickerWrapper = styled.div<{
   isDarkTheme: boolean;
   isActive: boolean;
   hasError: boolean;
}>`
   border-bottom: ${({ isDarkTheme, isActive, hasError }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const borderColor = hasError ? theme.error : theme.txt;
      const borderOpacity = hasError || isActive ? 1 : 0.3;
      return `2px solid ${Color.setRgbOpacity(borderColor, borderOpacity)}`;
   }};
   width: 100%;

   .react-datepicker__input-container input {
      background-color: transparent;
      font-family: inherit;
      color: unset;
      border: none;
      font-size: 1em;
      width: 100%;
      margin: 0;
      padding: 0;
   }

   .react-datepicker-popper {
      background-color: transparent;
   }

   .react-datepicker-wrapper {
      width: 100%;
   }

   .react-datepicker__input-container input:focus {
      outline: none;
      box-shadow: none;
   }

   .react-datepicker__input-container svg {
      width: 1em;
      height: 1em;
      fill: ${({ isDarkTheme, isActive }) => {
         const activeCol = isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent;
         const notActiveCol = Color.setRgbOpacity(
            isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
            0.6,
         );
         return isActive ? activeCol : notActiveCol;
      }};
      position: absolute;
      right: 0;
      bottom: -0.1em;
   }

   // make entire calendar darkThm:
   .react-datepicker {
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? Color.darkThm.dialog : Color.lightThm.dialog};
      color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
      border: 1px solid
         ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   }

   // make all calendar text darkThm:
   .react-datepicker__current-month,
   .react-datepicker-time__header,
   .react-datepicker__day-name,
   .react-datepicker__day,
   .react-datepicker__time-name {
      color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
   }

   // make entire calendar header darkThm:
   .react-datepicker__header {
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? Color.darkThm.dialog : Color.lightThm.dialog};
      border-bottom: 1px solid
         ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.border : Color.lightThm.border)};
   }

   // make entire time section darkThm:
   .react-datepicker__time-container {
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? Color.darkThm.dialog : Color.lightThm.dialog};
   }

   // make entire time section header darkThm:
   .react-datepicker__time-container .react-datepicker__time {
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? Color.darkThm.dialog : Color.lightThm.dialog};
   }
`;

interface IInputLabel extends IInputAttr {
   focusedInput: boolean;
   inputHasValue: boolean;
   isDarkTheme: boolean;
   hideLabel?: boolean;
}

export const InputContainer = styled.div`
   width: 100%;
   height: 4em;
`;

export const LabelWrapper = styled.label`
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

export const InputLabel = styled.div<IInputLabel>`
   font-size: 0.75em;
   ${({ focusedInput, isDarkTheme, isRequired }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const mainColor = theme.txt;
      const mainColorOpacity = focusedInput ? 1 : 0.4;
      const asteriskColor = theme.error;
      return css`
         color: ${Color.setRgbOpacity(mainColor, mainColorOpacity)};
         &:after {
            content: ${isRequired ? "'*'" : "''"};
            color: ${asteriskColor};
            padding: 2px;
         }
      `;
   }}
   transform: ${({ focusedInput, inputHasValue }) =>
      focusedInput || inputHasValue ? 'translateY(-0.5em)' : 'translateY(0.5em)'};
   font-size: ${({ focusedInput, inputHasValue }) =>
      focusedInput || inputHasValue ? '0.8em' : '0.8em'};
   pointer-events: none;
   transition: all 0.2s ease-in-out;
   opacity: ${({ hideLabel }) => (hideLabel ? 0 : 1)};
`;
