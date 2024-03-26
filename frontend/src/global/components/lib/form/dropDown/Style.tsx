import type { ControlProps } from 'react-select/dist/declarations/src/components/Control';
import type { OptionProps } from 'react-select/dist/declarations/src/components/Option';
import type { DropdownIndicatorProps } from 'react-select/dist/declarations/src/components/indicators';
import type { CSSObjectWithLabel, GroupBase } from 'react-select/dist/declarations/src/types';
import Color from '../../../../css/colors';
import Device from '../../../../helpers/pwa/deviceHelper';
import type { IDropDownOptions } from './dropDownInput';

const ARROWICON_BOX_WIDTH_PERC = 12;

export const parentContainerStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      height: '100%',
   };
};

export const inputFieldStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
   state: ControlProps<
      IDropDownOptions['options'][0],
      false,
      GroupBase<IDropDownOptions['options'][0]>
   >,
   hasError: boolean,
): CSSObjectWithLabel => {
   const { isFocused } = state;
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   const borderColor = hasError ? Color.darkThm.error : theme.txt;
   const opacityOne = hasError ? 1 : 0.75;
   const opacityTwo = hasError ? 1 : 0.3;
   return {
      ...provided,
      border: 0,
      boxShadow: isFocused
         ? `inset 0 0 0 2px ${Color.setRgbOpacity(borderColor, opacityOne)}`
         : `inset 0 0 0 2px ${Color.setRgbOpacity(borderColor, opacityTwo)}`,
      WebkitTapHighlightColor: 'transparent',
      minHeight: '0em',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: Color.setRgbOpacity(theme.bg, 0.1),
      height: '100%',
      width: '100%',
   };
};

export const valPlaceholderContainerStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      alignItems: 'center',
      position: 'absolute',
      height: '100%',
      width: `${100 - ARROWICON_BOX_WIDTH_PERC}%`,
   };
};

export const inputFieldValueStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      color: theme.txt,
   };
};

export const inputFieldPlaceholderStyle = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      color: Color.setRgbOpacity(theme.txt, 0.5),
   };
};

export const dropDownMenuStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      zIndex: 999,
      backgroundColor: Color.setRgbOpacity(theme.txt, 0.8),
      margin: 0,
      backdropFilter: 'blur(100px)',
      animation: 'fadeIn 0.2s ease-in-out',
      '@keyframes fadeIn': {
         from: {
            opacity: 0,
         },
         to: {
            opacity: 1,
         },
      },
   };
};

export const dropDownOptionsStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
   state: OptionProps<
      IDropDownOptions['options'][0],
      false,
      GroupBase<IDropDownOptions['options'][0]>
   >,
): CSSObjectWithLabel => {
   const { isSelected } = state;
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;

   return {
      ...provided,
      color: theme.bg,
      cursor: 'pointer',
      margin: 0,
      paddingTop: '1em',
      borderBottom: `1px solid ${Color.setRgbOpacity(theme.bg, 0.1)}`,
      backgroundColor: Color.setRgbOpacity(theme.txt, isSelected ? 1 : 0),
      ...(!Device.isTouchScreen() && {
         '&:hover': {
            backgroundColor: Color.setRgbOpacity(theme.txt, 0.4),
         },
      }),
      '&:active': {
         backgroundColor: Color.setRgbOpacity(theme.txt, 0.4),
      },
      transition: 'color 0.2s ease, background-color 0.2s ease',
   };
};

export const iconStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
   state: DropdownIndicatorProps<
      IDropDownOptions['options'][0],
      false,
      GroupBase<IDropDownOptions['options'][0]>
   >,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   const { isFocused } = state;
   return {
      ...provided,
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: isFocused ? theme.txt : Color.setRgbOpacity(theme.txt, 0.5),
      boxSizing: 'border-box',
      position: 'absolute',
      right: 0,
      left: `${100 - ARROWICON_BOX_WIDTH_PERC}%`,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   };
};

export const iconBorderSeperator = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      borderRight: `1px solid ${Color.setRgbOpacity(theme.txt, 0.75)}`,
      position: 'absolute',
      boxSizing: 'border-box',
      top: 0,
      bottom: 0,
      left: `${100 - ARROWICON_BOX_WIDTH_PERC}%`,
      backgroundColor: 'transparent',
   };
};
