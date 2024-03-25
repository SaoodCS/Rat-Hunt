import styled, { css } from 'styled-components';
import Color from '../../../../css/colors';
import MyCSS from '../../../../css/MyCSS';

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

export const TextInput = styled.input.attrs<IInputAttr>(({ isRequired, isDisabled }) => ({
   required: isRequired,
   disabled: isDisabled,
}))<ITextInput>`
   all: unset;
   ${MyCSS.Clickables.removeDefaultEffects};
   font-size: 1em;
   width: 100%;
   font-weight: 100;
   z-index: 1;
   ${({ isDarkTheme, hasError, isDisabled }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const colorPropColor = isDisabled ? theme.accent : theme.txt;
      const colorPropOpacity = isDisabled ? 0.6 : 0.8;
      const activeColorPropOpacity = isDisabled ? 0.6 : 1;
      const borderColor = hasError ? theme.error : theme.txt;
      const borderOpacity = hasError ? 1 : 0.3;
      return css`
         color: ${Color.setRgbOpacity(colorPropColor, colorPropOpacity)};
         border-bottom: 2px solid ${Color.setRgbOpacity(borderColor, borderOpacity)};
         &:focus,
         &:active {
            border-bottom: 2px solid ${borderColor};
            color: ${Color.setRgbOpacity(colorPropColor, activeColorPropOpacity)};
         }
      `;
   }}
`;

// -- SPECIFIC ALT INPUT FOR THIS APP -- //

export const TextInputAlt = styled.input.attrs<IInputAttr>(({ isRequired, isDisabled }) => ({
   required: isRequired,
   disabled: isDisabled,
}))<IInputAttr & { hasError: boolean }>`
   all: unset;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   width: 100%;
   padding-top: 0.25em;
   padding-bottom: 0.25em;
   padding-left: 0.5em;
   padding-right: 0.5em;
   background-color: ${({ isDisabled }) =>
      Color.setRgbOpacity(Color.darkThm.txt, isDisabled ? 0.5 : 0.8)};
   border-radius: 0.25em;
   box-shadow:
      inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.7)},
      inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.25)};
   border: ${({ hasError }) =>
      hasError ? `2px solid red` : `2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)}`};
   &:focus,
   &:active {
      border: ${({ hasError }) =>
         hasError ? `2px solid ${Color.darkThm.error}` : `2px solid ${Color.darkThm.accent}`};
      &::placeholder {
         opacity: 0;
      }
   }
   &::placeholder {
      color: ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.9)};
   }
`;
