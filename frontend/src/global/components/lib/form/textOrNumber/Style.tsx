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

export const TextInput = styled.input.attrs<IInputAttr>(({ isRequired, isDisabled }) => ({
   required: isRequired,
   disabled: isDisabled,
}))<ITextInput>`
   all: unset;
   height: 100%;
   font-family: inherit;
   width: 100%;
   border: 1px solid red;
   box-sizing: border-box;
   padding-left: 0.6em;
   border-radius: 0.25em;
   transition: all 0.1s ease-in-out;
   ${MyCSS.Clickables.removeDefaultEffects};
   &::placeholder {
      color: ${Color.setRgbOpacity(Color.darkThm.txt, 0.5)};
   }
   ${({ isDarkTheme, hasError, isDisabled }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const colorPropColor = isDisabled ? theme.accent : theme.txt;
      const colorPropOpacity = isDisabled ? 0.6 : 1;
      const activeColorPropOpacity = isDisabled ? 0.6 : 1;
      const borderColor = hasError ? theme.error : theme.txt;
      const borderOpacity = hasError ? 1 : 0.3;
      return css`
         color: ${Color.setRgbOpacity(colorPropColor, colorPropOpacity)};
         background-color: ${Color.setRgbOpacity(theme.bg, 0.1)};
         border: 2px solid ${Color.setRgbOpacity(borderColor, borderOpacity)};
         &:focus,
         &:active {
            border: 2px solid ${borderColor};
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
