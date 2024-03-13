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

export const StyledSelect = styled.select.attrs<IStyledSelectAttr>(
   ({ isRequired, isDisabled }) => ({
      required: isRequired,
      disabled: isDisabled,
   }),
)<IStyledSelect>`
   all: unset;
   border-radius: 0;
   border: none;
   font-size: 1em;
   width: 100%;
   cursor: pointer;
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
   color: ${({ isDisabled }) => isDisabled && Color.setRgbOpacity(Color.lightThm.txt, 0.6)};

   border-bottom: ${({ hasError }) =>
      hasError ? `2px solid red` : `2px solid ${Color.darkThm.accentDarkerShade}`};
   &:focus,
   &:active {
      outline: none;
      border-bottom: ${({ hasError }) =>
         hasError ? `2px solid ${Color.darkThm.error}` : `1px solid ${Color.darkThm.accent}`};
   }
   font-weight: 100;
   z-index: 1;
`;

export const DropDownArrow = styled(DownArrow)<{ darktheme: string; focusedinput: string }>`
   position: absolute;
   right: 0;
   bottom: -0.5em;
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
   position: relative;
`;

export const StyledOption = styled.option<{ isDarkTheme: boolean }>`
   background-color: ${Color.setRgbOpacity(Color.darkThm.dialog, 1)};
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt)};
`;
