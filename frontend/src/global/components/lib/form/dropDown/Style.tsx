import type { ControlProps } from 'react-select/dist/declarations/src/components/Control';
import type { OptionProps } from 'react-select/dist/declarations/src/components/Option';
import type { DropdownIndicatorProps } from 'react-select/dist/declarations/src/components/indicators';
import type { CSSObjectWithLabel, GroupBase } from 'react-select/dist/declarations/src/types';
import CSS_Color from '../../../../css/utils/colors';
import CSS_Inputs from '../../../../css/utils/inputs';
import Device from '../../../../helpers/pwa/deviceHelper';
import type { IDropDownOptions } from './DropDownInput';

export const parentContainerStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
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
   const borderColorOne = hasError
      ? CSS_Inputs.errorBorderCol(isDarkTheme)
      : CSS_Inputs.borderCol(isDarkTheme, 0.75);
   const borderColorTwo = hasError
      ? CSS_Inputs.errorBorderCol(isDarkTheme)
      : CSS_Inputs.borderCol(isDarkTheme, 0.5);
   const borderWidth = CSS_Inputs.border(isDarkTheme).slice(0, 3);
   return {
      ...provided,
      border: 0,
      boxShadow: isFocused
         ? `inset 0 0 0 ${borderWidth} ${borderColorOne}`
         : `inset 0 0 0 ${borderWidth} ${borderColorTwo}`,
      WebkitTapHighlightColor: 'transparent',
      minHeight: '0em',
      cursor: 'pointer',
      transition: CSS_Inputs.transition,
      backgroundColor: CSS_Inputs.bgCol(isDarkTheme),
      height: '100%',
      width: '100%',
   };
};

export const valPlaceholderContainerStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
   return {
      ...provided,
      alignItems: 'center',
      position: 'absolute',
      height: '100%',
      width: `calc(100% - ${CSS_Inputs.rightIconBoxWidth})`,
   };
};

export const inputFieldValueStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   return {
      ...provided,
      color: CSS_Inputs.valueCol(isDarkTheme),
   };
};

export const inputFieldPlaceholderStyle = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   return {
      ...provided,
      color: CSS_Inputs.placeholderCol(isDarkTheme),
   };
};

export const dropDownMenuStyles = (
   isDarkTheme: boolean,
   provided: CSSObjectWithLabel,
): CSSObjectWithLabel => {
   const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
   return {
      ...provided,
      zIndex: 999,
      backgroundColor: CSS_Color.setRgbOpacity(theme.txt, 0.9),
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
   const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
   return {
      ...provided,
      color: theme.bg,
      cursor: 'pointer',
      margin: 0,
      paddingTop: '1em',
      borderBottom: `1px solid ${CSS_Color.setRgbOpacity(theme.bg, 0.1)}`,
      backgroundColor: CSS_Color.setRgbOpacity(theme.txt, isSelected ? 1 : 0),
      ...(!Device.isTouchScreen() && {
         '&:hover': {
            backgroundColor: CSS_Color.setRgbOpacity(theme.txt, 0.4),
         },
      }),
      '&:active': {
         backgroundColor: CSS_Color.setRgbOpacity(theme.txt, 0.4),
      },
      transition: 'color 0.1s ease, background-color 0.1s ease',
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
   const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
   const { isFocused } = state;
   return {
      ...provided,
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: isFocused ? theme.txt : CSS_Inputs.rightIconColor(isDarkTheme),
      boxSizing: 'border-box',
      position: 'absolute',
      right: 0,
      left: `calc(100% - ${CSS_Inputs.rightIconBoxWidth})`,
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
   return {
      ...provided,
      borderRight: CSS_Inputs.rightIconBoxBorder(isDarkTheme),
      position: 'absolute',
      boxSizing: 'border-box',
      top: 0,
      bottom: 0,
      left: `calc(100% - ${CSS_Inputs.rightIconBoxWidth})`,
      backgroundColor: 'transparent',
   };
};
