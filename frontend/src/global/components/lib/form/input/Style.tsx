import styled from 'styled-components';
import Color from '../../../../css/colors';

interface IInputAttr {
   isRequired: boolean;
   isDisabled: boolean;
}

interface ITextInput extends IInputAttr {
   hasError: boolean;
   isDarkTheme: boolean;
}

interface IInputLabel extends IInputAttr {
   focusedInput: boolean;
   inputHasValue: boolean;
   isDarkTheme: boolean;
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
   color: ${({ focusedInput, isDarkTheme }) =>
      focusedInput
         ? isDarkTheme
            ? Color.darkThm.accent
            : Color.lightThm.accent
         : Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.6)};
   transform: ${({ focusedInput, inputHasValue }) =>
      focusedInput || inputHasValue ? 'translateY(-0.5em)' : 'translateY(0.5em)'};
   font-size: ${({ focusedInput, inputHasValue }) =>
      focusedInput || inputHasValue ? '0.8em' : '0.8em'};
   pointer-events: none;
   transition: all 0.2s ease-in-out;
   &:after {
      content: ${({ isRequired }) => (isRequired ? "'*'" : "''")};
      color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.error : Color.lightThm.error)};
      padding: 2px;
   }
`;

export const TextInput = styled.input.attrs<IInputAttr>(({ isRequired, isDisabled }) => ({
   required: isRequired,
   disabled: isDisabled,
}))<ITextInput>`
   all: unset;
   font-size: 1em;
   width: 100%;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   color: ${({ isDisabled, isDarkTheme }) =>
      isDisabled && Color.setRgbOpacity(isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt, 0.6)};
   border-bottom: ${({ hasError, isDarkTheme }) =>
      hasError
         ? `2px solid red`
         : `1px solid ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border}`};
   &:focus,
   &:active {
      border-bottom: ${({ hasError, isDarkTheme }) =>
         hasError
            ? `2px solid ${isDarkTheme ? Color.darkThm.error : Color.lightThm.error}`
            : `1px solid ${Color.lightThm.accent}`};
   }
   font-weight: 100;
   z-index: 1;
`;

export const ErrorLabel = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   margin-top: 0.2em;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.error : Color.lightThm.error)};
`;
