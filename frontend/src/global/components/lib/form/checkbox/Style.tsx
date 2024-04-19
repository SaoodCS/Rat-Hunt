import styled from 'styled-components';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';
import { FlexRowWrapper } from '../../positionModifiers/flexRowWrapper/Style';

export interface ICheckInputAttr {
   isRequired: boolean;
   isDisabled: boolean;
}

const checkboxSizePx = 15;

export const CheckboxAndLabelWrapper = styled(FlexRowWrapper)`
   width: 100%;
   align-items: center;
   justify-content: start;
   position: relative;
   height: fit-content;

   & > *:first-child {
      position: absolute;
      left: 0;
      width: 25px;
   }
   & > *:last-child {
      right: 0;
      margin-left: 25px;
   }
`;

export const CheckboxContainer = styled.div``;

export const StyledCheckbox = styled.input.attrs<ICheckInputAttr>(({ isRequired, isDisabled }) => ({
   required: isRequired,
   disabled: isDisabled,
   type: 'checkbox',
}))<{ isDarkTheme: boolean; hasError: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   padding: 0;
   margin: 0;
   appearance: none;
   -webkit-appearance: none;
   -moz-appearance: none;
   -ms-appearance: none;
   -o-appearance: none;
   background-color: #fff;
   border-radius: 2px;
   border: ${({ isDarkTheme, hasError }) =>
      hasError && `1px solid ${isDarkTheme ? CSS_Color.darkThm.error : CSS_Color.lightThm.error}`};
   width: ${checkboxSizePx}px;
   height: ${checkboxSizePx}px;
   cursor: pointer;
   position: relative;
   transition: background-color 0.2s;
   &:checked {
      background-color: ${({ isDarkTheme }) =>
         isDarkTheme ? CSS_Color.darkThm.accent : CSS_Color.lightThm.accent};
      &::after {
         content: '';
         position: absolute;
         bottom: 2px;
         left: 4.5px;
         width: 3px;
         height: 10px;
         border: solid
            ${({ isDarkTheme }) => (isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt)};
         border-width: 0 2.5px 2.5px 0;
         transform: rotate(45deg);
      }
   }
`;

export const CheckboxLabel = styled.label`
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;
