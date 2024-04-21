import type { CSSProperties } from 'react';
import { getTrackBackground } from 'react-range';
import styled, { css } from 'styled-components';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Inputs from '../../../../css/utils/inputs';

export const NumberLineInputWrapper = styled.div`
   position: relative;
   display: flex;
   height: 100%;
`;

export const StyledLineWrapper = styled.div<{
   propsStyles: CSSProperties;
   isDragged: boolean;
   isDarkTheme: boolean;
   hasError: boolean;
}>`
   ${({ propsStyles }) => CSS_Helper.convertInlineToStyledComp(propsStyles)};
   ${({ isDarkTheme, hasError }) => {
      return css`
         border: ${hasError ? CSS_Inputs.errorBorder(isDarkTheme) : CSS_Inputs.border(isDarkTheme)};
         background-color: ${CSS_Inputs.bgCol(isDarkTheme)};
      `;
   }};

   box-sizing: border-box;
   border-radius: ${CSS_Inputs.borderRadius};
   height: 100%;
   width: 100%;
   display: flex;
   align-items: center;
   & > *:first-child {
      flex: 0 0 auto;
      margin-left: 0.7em;
   }
   & > *:nth-child(2) {
      flex: 1 1 auto;
      margin-left: 1.5em;
      margin-right: 5em;
   }
`;

export const Label = styled.div<{ isDragged: boolean; value: number | ''; isDarkTheme: boolean }>`
   position: relative;
   ${({ isDarkTheme, isDragged, value }) => {
      const inputHasValue = value !== '';
      return css`
         color: ${inputHasValue
            ? CSS_Inputs.valueCol(isDarkTheme)
            : CSS_Inputs.placeholderCol(isDarkTheme)};
      `;
   }}
`;

export const StyledLine = styled.div<{
   inputHasValue: boolean;
   isDarkTheme: boolean;
   value: number | '';
   min: number;
   max: number;
}>`
   height: 5px;
   border-radius: 5px;
   box-sizing: border-box;
   ${({ isDarkTheme, inputHasValue, value, min, max }) => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const activeColor = theme.txt;
      const inactiveColor = CSS_Color.setRgbOpacity(theme.txt, 0.5);
      return css`
         background: ${getTrackBackground({
            values: [inputHasValue ? (value as number) : 0],
            colors: [activeColor, inactiveColor],
            min: min,
            max: max,
         })};
      `;
   }}
`;

export const StyledDot = styled.div<{
   propsStyles: CSSProperties;
   isDragged: boolean;
   value: number | '';
   isDarkTheme: boolean;
}>`
   ${({ propsStyles }) => CSS_Helper.convertInlineToStyledComp(propsStyles)};
   ${({ isDarkTheme, isDragged }) => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      return css`
         background-color: ${CSS_Color.setRgbOpacity(theme.txt, isDragged ? 1 : 0.5)};
      `;
   }}
   backdrop-filter: blur(100px);
   height: 15px;
   width: 15px;
   border-radius: 50%;
   outline: 1px solid;
   &:focus {
      outline: 1px solid;
   }
`;

export const ValueAndRefreshBtnWrapper = styled.div<{ isDarkTheme: boolean }>`
   position: absolute;
   ${({ isDarkTheme }) => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      return css`
         border-left: 1px solid ${CSS_Color.setRgbOpacity(theme.accent, 0.75)};
      `;
   }}
   right: 0px;
   width: 4em;
   display: flex;
   top: ${CSS_Inputs.rightIconBoxMarginTopBottom};
   bottom: ${CSS_Inputs.rightIconBoxMarginTopBottom};
`;

export const ValueAndRefreshBtnContainer = styled.div`
   height: 100%;
   width: 100%;
   position: relative;
   display: flex;
   align-items: center;
`;

export const ValueItemContainer = styled.div`
   position: absolute;
   width: 100%;
   text-align: center;
`;

export const ValueItem = styled.div<{ inputHasValue: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   opacity: ${({ inputHasValue }) => !inputHasValue && '0'};
   padding-top: 0.2em;
   padding-right: ${({ inputHasValue }) => (inputHasValue ? '1.65em' : '0em')};
   transition: ${CSS_Inputs.transition};
`;

export const RefreshBtnContainer = styled.div`
   position: absolute;
   width: 100%;
   text-align: center;
`;

export const RefreshBtnTransitioner = styled.div<{ inputHasValue: boolean; isDarkTheme: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(2)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(3, 'revert')};
   color: ${({ isDarkTheme }) => CSS_Inputs.rightIconColor(isDarkTheme)};
   padding-left: ${({ inputHasValue }) => (inputHasValue ? '1.65em' : '0em')};
   cursor: pointer;
`;
