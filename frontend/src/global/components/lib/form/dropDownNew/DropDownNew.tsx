import { useState } from 'react';
import Select from 'react-select';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel } from '../textOrNumber/Style';
import {
   dropDownMenuStyles,
   dropDownOptionsStyles,
   iconStyles,
   inputFieldPlaceholderStyle,
   inputFieldStyles,
   inputFieldValueStyles,
   parentContainerStyles,
} from './Style';

export interface IDropDownOption {
   value: string | number;
   label: string;
}

interface IDropDownInput extends N_Form.Inputs.I.CommonInputProps {
   dropDownOptions: IDropDownOption[];
   value: string | number;
}

export default function DropDownInputNew(props: IDropDownInput): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { label, name, isRequired, handleChange, error, dropDownOptions, id, value, isDisabled } =
      props;
   const [inputHasValue, setInputHasValue] = useState<boolean>(value !== '');
   const [menuHeight, setMenuHeight] = useState<number>(100);

   return (
      <div>
         <Select
            name={name.toString()}
            id={id}
            placeholder={label}
            options={dropDownOptions}
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
            maxMenuHeight={menuHeight}
            menuPlacement="top"
            menuShouldScrollIntoView={true}
            styles={{
               container: (provided) => parentContainerStyles(isDarkTheme, provided),
               control: (provided, state) => inputFieldStyles(isDarkTheme, provided, state),
               singleValue: (provided) => inputFieldValueStyles(isDarkTheme, provided),
               placeholder: (provided) => inputFieldPlaceholderStyle(isDarkTheme, provided),
               menu: (provided) => dropDownMenuStyles(isDarkTheme, provided),
               option: (provided, state) => dropDownOptionsStyles(isDarkTheme, provided, state),
               dropdownIndicator: (provided, state) => iconStyles(isDarkTheme, provided, state),
            }}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </div>
   );
}
