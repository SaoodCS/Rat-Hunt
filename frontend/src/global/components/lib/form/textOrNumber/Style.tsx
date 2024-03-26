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
      const borderColor = hasError ? theme.error : theme.accent;
      const borderOpacity = hasError ? 1 : 0.5;
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
