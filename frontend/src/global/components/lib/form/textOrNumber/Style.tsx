import styled, { css } from 'styled-components';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Inputs from '../../../../css/utils/inputs';

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
   width: 100%;
   font-family: inherit;
   box-sizing: border-box;
   ${CSS_Clickables.removeDefaultEffects};
   transition: ${CSS_Inputs.transition};
   padding: ${CSS_Inputs.padding};
   border-radius: ${CSS_Inputs.borderRadius};
   &::placeholder {
      color: ${({ isDarkTheme }) => CSS_Inputs.placeholderCol(isDarkTheme)};
   }
   ${({ isDarkTheme, hasError, isDisabled }) => {
      return css`
         color: ${isDisabled
            ? CSS_Inputs.disabledCol(isDarkTheme)
            : CSS_Inputs.valueCol(isDarkTheme)};
         background-color: ${CSS_Inputs.bgCol(isDarkTheme)};
         border: ${hasError ? CSS_Inputs.errorBorder(isDarkTheme) : CSS_Inputs.border(isDarkTheme)};
         &:focus,
         &:active {
            border: ${CSS_Inputs.focusedBorder(isDarkTheme)};
            color: ${isDisabled
               ? CSS_Inputs.disabledCol(isDarkTheme)
               : CSS_Inputs.valueCol(isDarkTheme)};
         }
      `;
   }}
`;
