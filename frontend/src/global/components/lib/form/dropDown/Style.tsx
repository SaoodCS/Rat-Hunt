import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow';
import styled, { css } from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';
import { LabelWrapper } from '../textOrNumber/Style';
import MyCSS from '../../../../css/MyCSS';

interface IStyledSelectAttr {
   isRequired: boolean;
   isDisabled: boolean;
}

interface IStyledSelect extends IStyledSelectAttr {
   hasError: boolean;
   isDarkTheme: boolean;
}

interface IDropDownArrow {
   darktheme: BoolHelper.IAsString;
   focusedinput: BoolHelper.IAsString;
}

export const DropDownInputContainer = styled.div`
   position: relative;
   display: flex;
   height: 32px;
   margin-bottom: 1.8em;
   width: 100%;
`;

export const DropDownArrow = styled(DownArrow)<IDropDownArrow>`
   position: absolute;
   align-self: center;
   right: 0;
   ${({ focusedinput, darktheme }) => {
      const isFocusedInput = BoolHelper.strToBool(focusedinput);
      const theme = BoolHelper.strToBool(darktheme) ? Color.darkThm : Color.lightThm;
      return css`
         color: ${Color.setRgbOpacity(theme.txt, isFocusedInput ? 1 : 0.6)};
      `;
   }};
   width: 0.75em;
   transform: ${({ focusedinput }) =>
      focusedinput === 'true' ? 'rotate(180deg)' : 'rotate(0deg)'};
   transition: transform 0.3s ease-in-out;
`;

export const DropDownLabelWrapper = styled(LabelWrapper)`
   display: flex;
   justify-content: space-between;
   height: fit-content;
   align-items: end;
   z-index: -999;
   width: fit-content;
   position: absolute;
`;

export const StyledSelect = styled.select.attrs<IStyledSelectAttr>(
   ({ isRequired, isDisabled }) => ({
      required: isRequired,
      disabled: isDisabled,
   }),
)<IStyledSelect & { isActive: boolean; valueExists: boolean }>`
   all: unset;
   ${MyCSS.Clickables.removeDefaultEffects};
   position: absolute;
   top: 0em;
   bottom: 0em;
   align-items: end;
   box-sizing: border-box;
   padding-bottom: ${({ isActive, valueExists }) => (!(isActive || valueExists) ? '0.8em' : '0')};
   font-size: ${({ isActive, valueExists }) => (isActive || valueExists ? '1em' : '0.8em')};
   border-radius: 0;
   width: 100%;
   font-weight: 100;
   z-index: 1;
   cursor: pointer;
   ${({ isDisabled, isActive, valueExists, isDarkTheme }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const focusedOrValueExists = isActive || valueExists;
      const opacity = isDisabled ? 0.6 : !focusedOrValueExists ? 0.4 : 1;
      const color = isDisabled ? theme.accent : theme.txt;
      return css`
         color: ${Color.setRgbOpacity(color, opacity)};
      `;
   }};
   ${({ hasError, isDisabled, isDarkTheme }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const borderColor = hasError ? theme.error : theme.txt;
      const colorPropColor = isDisabled ? theme.accent : theme.txt;
      const borderOpacity = hasError ? 1 : 0.3;
      const colorOpacity = isDisabled ? 0.6 : 1;
      return css`
         border-bottom: 2px solid ${Color.setRgbOpacity(borderColor, borderOpacity)};
         &:focus,
         &:active {
            outline: none;
            border-bottom: 2px solid ${Color.setRgbOpacity(borderColor, 1)};
            color: ${Color.setRgbOpacity(colorPropColor, colorOpacity)};
         }
      `;
   }};
`;

export const StyledOption = styled.option<{ isDarkTheme: boolean }>`
   ${({ isDarkTheme }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const colorPropColor = theme.txt;
      const backgroundColor = theme.dialog;
      return css`
         color: ${colorPropColor};
         background-color: ${backgroundColor};
      `;
   }};
`;

export const StyledSelectAlt = styled.select.attrs<IStyledSelectAttr>(
   ({ isRequired, isDisabled }) => ({
      required: isRequired,
      disabled: isDisabled,
   }),
)<IStyledSelect>`
   all: unset;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   width: 100%;
   padding-top: 0.25em;
   padding-bottom: 0.25em;
   padding-left: 0.5em;
   padding-right: 0.5em;
   border-radius: 0.25em;
   position: relative;
   ${({ isDarkTheme, hasError }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const boxShadowColor = theme.bg;
      const backgroundColor = theme.txt;
      const borderColor = hasError ? theme.error : theme.accent;
      return css`
         box-shadow:
            inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(boxShadowColor, 0.7)},
            inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(boxShadowColor, 0.25)};
         background-color: ${Color.setRgbOpacity(backgroundColor, 0.8)};
         border: 2px solid ${borderColor};
         &:focus,
         &:active {
            border: 2px solid ${theme.accent};
         }
      `;
   }}
`;

export const DropDownArrowAlt = styled(DownArrow)<IDropDownArrow>`
   position: absolute;
   right: 3em;
   z-index: 1;
   width: 0.9em;
   ${({ focusedinput, darktheme }) => {
      const isFocusedInput = BoolHelper.strToBool(focusedinput);
      const theme = BoolHelper.strToBool(darktheme) ? Color.darkThm : Color.lightThm;
      return css`
         color: ${theme.accentDarkerShade};
         transform: ${isFocusedInput ? 'rotate(180deg)' : 'rotate(0deg)'};
      `;
   }};
   transition: transform 0.3s ease-in-out;
`;
