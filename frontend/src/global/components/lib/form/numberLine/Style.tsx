import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export const NumberLineInputWrapper = styled.div`
   position: relative;
   display: flex;
   font-size: 0.8em;
`;

export const StyledLineWrapper = styled.div<{
   propsStyles: CSSProperties;
   isDragged: boolean;
   isDarkTheme: boolean;
   hasError: boolean;
}>`
   ${({ propsStyles }) => MyCSS.Helper.convertInlineToStyledComp(propsStyles)};
   ${({ isDarkTheme, hasError }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const color = hasError ? theme.error : theme.txt;
      const opacity = hasError ? 1 : 0.3;
      return css`
         border: 2px solid ${Color.setRgbOpacity(color, opacity)};
         background-color: ${Color.setRgbOpacity(theme.txt, 0.1)};
      `;
   }};

   box-sizing: border-box;
   border-radius: 0.25em;
   height: 3em;
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
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const inputHasValue = value !== '';
      return css`
         color: ${Color.setRgbOpacity(theme.txt, isDragged || inputHasValue ? 1 : 0.5)};
      `;
   }}
`;

export const StyledLine = styled.div<{ inputHasValue: boolean; isDarkTheme: boolean }>`
   height: 5px;
   border-radius: 5px;
   box-sizing: border-box;
   ${({ isDarkTheme, inputHasValue }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      return css`
         background-color: ${Color.setRgbOpacity(theme.txt, inputHasValue ? 1 : 0.5)};
      `;
   }}
`;

export const StyledDot = styled.div<{
   propsStyles: CSSProperties;
   isDragged: boolean;
   value: number | '';
   isDarkTheme: boolean;
}>`
   ${({ propsStyles }) => MyCSS.Helper.convertInlineToStyledComp(propsStyles)};
   ${({ isDarkTheme, isDragged }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      return css`
         background-color: ${Color.setRgbOpacity(theme.txt, isDragged ? 1 : 0.5)};
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
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      return css`
         border-left: 1px solid ${Color.setRgbOpacity(theme.txt, 0.75)};
      `;
   }}
   right: 0px;
   width: 4em;
   display: flex;
   top: 0.6em;
   bottom: 0.6em;
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
   ${MyCSS.Clickables.removeDefaultEffects};
   padding-top: 0.2em;
   padding-right: ${({ inputHasValue }) => (inputHasValue ? '1.65em' : '0em')};
   transition: all 0.2s ease-in-out;
`;

export const RefreshBtnContainer = styled.div`
   position: absolute;
   width: 100%;
   text-align: center;
`;

export const RefreshBtnTransitioner = styled.div<{ inputHasValue: boolean; isDarkTheme: boolean }>`
   ${({ isDarkTheme }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      return css`
         color: ${Color.setRgbOpacity(theme.txt, 0.5)};
      `;
   }}
   ${MyCSS.Clickables.removeDefaultEffects};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(2)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(3, 'revert')};
   padding-left: ${({ inputHasValue }) => (inputHasValue ? '1.65em' : '0em')};
   cursor: pointer;
`;
