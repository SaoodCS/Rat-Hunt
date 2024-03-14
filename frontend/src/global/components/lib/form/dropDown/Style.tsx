import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow';
import styled from 'styled-components';
import Color from '../../../../css/colors';
import { LabelWrapper } from '../input/Style';

interface IStyledSelectAttr {
   isRequired: boolean;
   isDisabled: boolean;
}

interface IStyledSelect extends IStyledSelectAttr {
   hasError: boolean;
   isDarkTheme: boolean;
}

export const DropDownInputContainer = styled.div`
   position: relative;
   display: flex;
   height: 32px;
   margin-bottom: 1.8em;
   width: 100%;
`;

export const DropDownArrow = styled(DownArrow)<{ darktheme: string; focusedinput: string }>`
   position: absolute;
   align-self: center;
   right: 0;
   color: ${({ focusedinput }) =>
      focusedinput === 'true' ? Color.darkThm.txt : Color.setRgbOpacity(Color.darkThm.txt, 0.6)};
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
   position: absolute;
   top: 0em;
   bottom: 0em;
   align-items: end;
   box-sizing: border-box;
   padding-bottom: ${({ isActive, valueExists }) => (!(isActive || valueExists) ? '0.8em' : '0')};
   font-size: ${({ isActive, valueExists }) => (isActive || valueExists ? '1em' : '0.8em')};
   border-radius: 0;
   border: none;
   width: 100%;
   font-weight: 100;
   z-index: 1;
   cursor: pointer;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   color: ${({ isDisabled, isActive, valueExists }) =>
      isDisabled
         ? Color.setRgbOpacity(Color.darkThm.accent, 0.6)
         : !(isActive || valueExists)
           ? Color.setRgbOpacity(Color.darkThm.txt, 0.4)
           : Color.darkThm.txt};
   border-bottom: ${({ hasError }) =>
      hasError ? `2px solid red` : `2px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.3)}`};
   &:focus,
   &:active {
      outline: none;
      border-bottom: ${({ hasError }) =>
         hasError ? `2px solid ${Color.darkThm.error}` : `2px solid ${Color.darkThm.txt}`};
      color: ${({ isDisabled }) =>
         isDisabled
            ? Color.setRgbOpacity(Color.darkThm.accent, 0.6)
            : Color.setRgbOpacity(Color.darkThm.txt, 1)};
   }
`;

export const StyledOption = styled.option<{ isDarkTheme: boolean }>`
   background-color: ${Color.setRgbOpacity(Color.darkThm.dialog, 1)};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
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
   background-color: ${Color.setRgbOpacity(Color.darkThm.txt, 0.8)};
   border-radius: 0.25em;
   box-shadow:
      inset 0.05em 0.05em 0em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.7)},
      inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.25)};
   border: ${({ hasError }) =>
      hasError ? `2px solid red` : `2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)}`};
   position: relative;
   &:focus,
   &:active {
      border: ${({ hasError }) =>
         hasError ? `2px solid ${Color.darkThm.error}` : `2px solid ${Color.darkThm.accent}`};
   }
`;

export const DropDownArrowAlt = styled(DownArrow)<{ darktheme: string; focusedinput: string }>`
   position: absolute;
   right: 3em;
   z-index: 1;
   color: ${({ focusedinput }) =>
      focusedinput === 'true'
         ? Color.darkThm.accentDarkerShade
         : Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 1)};
   width: 0.9em;
   transform: ${({ focusedinput }) =>
      focusedinput === 'true' ? 'rotate(180deg)' : 'rotate(0deg)'};
   transition: transform 0.3s ease-in-out;
`;
