import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputWrapper } from '../style/Style';
import {
   dropDownMenuStyles,
   dropDownOptionsStyles,
   iconBorderSeperator,
   iconStyles,
   inputFieldPlaceholderStyle,
   inputFieldStyles,
   inputFieldValueStyles,
   parentContainerStyles,
   valPlaceholderContainerStyles,
} from './Style';

export interface IDropDownOptions {
   options: {
      value: string | number;
      label: string;
   }[];
   menu?: {
      maxHeight?: number;
      placement?: 'top' | 'bottom';
   };
}

interface IDropDownInput extends N_Form.Inputs.I.CommonInputProps {
   dropDownOptions: IDropDownOptions;
   value: string | number;
}

export default function DropDownInput(props: IDropDownInput): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { label, name, isRequired, handleChange, error, dropDownOptions, id, isDisabled } = props;
   const { menu, options } = dropDownOptions;
   const [hasError, setHasError] = useState(!!error);
   const [fontSize, setFontSize] = useState<string | undefined>(undefined);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (inputRef.current) {
         setFontSize(window.getComputedStyle(inputRef.current).fontSize);
      }
   }, []);

   useEffect(() => {
      setHasError(!!error);
   }, [error]);

   return (
      <InputWrapper ref={inputRef}>
         <Select
            name={name.toString()}
            id={id}
            placeholder={label}
            options={options}
            onChange={(option) =>
               handleChange({
                  target: {
                     name: name,
                     value: option?.value || '',
                  },
               })
            }
            isDisabled={isDisabled}
            required={isRequired}
            isMulti={false}
            isClearable={false}
            isSearchable={false}
            maxMenuHeight={menu?.maxHeight || 200}
            menuPlacement={menu?.placement || 'top'}
            menuShouldScrollIntoView={true}
            menuPortalTarget={document.body}
            styles={{
               container: (provided) => parentContainerStyles(isDarkTheme, provided),
               control: (provided, state) =>
                  inputFieldStyles(isDarkTheme, provided, state, hasError),
               valueContainer: (provided) => valPlaceholderContainerStyles(isDarkTheme, provided),
               singleValue: (provided) => inputFieldValueStyles(isDarkTheme, provided),
               placeholder: (provided) => inputFieldPlaceholderStyle(isDarkTheme, provided),
               menu: (provided) => dropDownMenuStyles(isDarkTheme, provided),
               option: (provided, state) => dropDownOptionsStyles(isDarkTheme, provided, state),
               indicatorSeparator: (provided) => iconBorderSeperator(isDarkTheme, provided),
               dropdownIndicator: (provided, state) => iconStyles(isDarkTheme, provided, state),
               menuPortal: (provided) => ({ ...provided, zIndex: 9999, fontSize: fontSize }),
            }}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputWrapper>
   );
}
