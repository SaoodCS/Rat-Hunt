import type { ControlProps } from 'react-select/dist/declarations/src/components/Control';
import type { OptionProps } from 'react-select/dist/declarations/src/components/Option';
import type { DropdownIndicatorProps } from 'react-select/dist/declarations/src/components/indicators';
import type { CSSObjectWithLabel, GroupBase } from 'react-select/dist/declarations/src/types';
import Color from '../../../../css/colors';
import type { IDropDownOption } from './DropDownNew';
import Device from '../../../../helpers/pwa/deviceHelper';

export const parentContainerStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      paddingBottom: '1em',
      fontSize: '0.8em',
   };
};

export const inputFieldStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
   state: ControlProps<IDropDownOption, false, GroupBase<IDropDownOption>>,
): CSSObjectWithLabel => {
   const { isFocused } = state;
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   return {
      ...provided,
      border: 0,
      boxShadow: isFocused
         ? `inset 0 0 0 2px ${Color.setRgbOpacity(theme.txt, 0.75)}`
         : `inset 0 0 0 2px ${Color.setRgbOpacity(theme.txt, 0.3)}`,
      WebkitTapHighlightColor: 'transparent',
      minHeight: '0em',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: Color.setRgbOpacity(theme.txt, 0.1),
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
      backgroundColor: Color.setRgbOpacity(theme.txt, 0.5),
      margin: 0,
      backdropFilter: 'blur(5px)',
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
   state: OptionProps<IDropDownOption, false, GroupBase<IDropDownOption>>,
): CSSObjectWithLabel => {
   const { isSelected } = state;
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;

   return {
      ...provided,
      color: theme.bg,
      cursor: 'pointer',
      margin: 0,
      paddingTop: '1em',
      borderBottom: `1px solid ${Color.setRgbOpacity(theme.bg, 0.2)}`,
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
   state: DropdownIndicatorProps<IDropDownOption, false, GroupBase<IDropDownOption>>,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
   const { isFocused } = state;
   return {
      ...provided,
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: isFocused ? theme.txt : Color.setRgbOpacity(theme.txt, 0.5),
   };
};
