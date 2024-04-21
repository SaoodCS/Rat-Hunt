import styled, { css } from 'styled-components';
import CSS_Inputs from '../../../../css/utils/inputs';
import { TextInput } from '../textOrNumber/Style';
import CSS_Clickables from '../../../../css/utils/clickables';

interface IDatePickerLabel {
   hasValue: boolean;
   isDarkTheme: boolean;
   isDisabled: boolean;
   hasError: boolean;
   hasFocus: boolean;
}

export const DateInput = styled(TextInput)`
   position: absolute;
   opacity: 0;
   cursor: pointer;
`;

export const DatePickerLabel = styled.label<IDatePickerLabel>`
   position: absolute;
   top: 0px;
   bottom: 0px;
   left: 0px;
   right: 0px;
   box-sizing: border-box;
   display: flex;
   align-items: center;
   padding: ${CSS_Inputs.padding};
   border-radius: ${CSS_Inputs.borderRadius};
   transition: ${CSS_Inputs.transition};
   ${({ hasValue, isDarkTheme, isDisabled, hasError, hasFocus }) => {
      return css`
         color: ${isDisabled
            ? CSS_Inputs.disabledCol(isDarkTheme)
            : !hasValue
              ? CSS_Inputs.placeholderCol(isDarkTheme)
              : CSS_Inputs.valueCol(isDarkTheme)};
         background-color: ${CSS_Inputs.bgCol(isDarkTheme)};
         border: ${hasError
            ? CSS_Inputs.errorBorder(isDarkTheme)
            : hasFocus
              ? CSS_Inputs.focusedBorder(isDarkTheme)
              : CSS_Inputs.border(isDarkTheme)};
      `;
   }};
`;

export const ClearIconWrapper = styled.div<{ isDarkTheme: boolean; hasValue: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(2)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(3, 'revert')};
   cursor: pointer;
   position: absolute;
   right: 0;
   top: 0;
   bottom: 0;
   z-index: ${({ hasValue }) => (hasValue ? 1 : 0)};
   margin-top: ${CSS_Inputs.rightIconBoxMarginTopBottom};
   margin-bottom: ${CSS_Inputs.rightIconBoxMarginTopBottom};
   width: ${CSS_Inputs.rightIconBoxWidth};
   color: ${({ isDarkTheme }) => CSS_Inputs.rightIconColor(isDarkTheme)};
   border-left: ${({ isDarkTheme }) => CSS_Inputs.rightIconBoxBorder(isDarkTheme)};
   & > *:first-child {
      width: 100%;
      height: 100%;
   }
`;
