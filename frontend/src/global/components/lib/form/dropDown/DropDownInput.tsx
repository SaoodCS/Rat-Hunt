import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputLabel } from '../textOrNumber/Style';
import {
   DropDownArrow,
   DropDownInputContainer,
   DropDownLabelWrapper,
   StyledOption,
   StyledSelect,
} from './Style';

export interface IDropDownOption {
   value: string | number;
   label: string;
}

interface IDropDownInput extends N_Form.Inputs.I.CommonInputProps {
   dropDownOptions: IDropDownOption[];
   hidePlaceholderOnFocus: boolean;
   value: string | number;
}

export default function DropDownInput(props: IDropDownInput): JSX.Element {
   const {
      placeholder,
      name,
      isRequired,
      handleChange,
      error,
      dropDownOptions,
      id,
      value,
      isDisabled,
      hidePlaceholderOnFocus,
   } = props;
   const { isDarkTheme } = useThemeContext();
   const [isActive, setIsActive] = useState(false);
   const [inputHasValue, setInputHasValue] = useState(value !== '');

   useEffect(() => {
      setInputHasValue(value !== '');
   }, [value]);

   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   return (
      <DropDownInputContainer>
         <DropDownArrow darktheme={isDarkTheme.toString()} focusedinput={isActive.toString()} />
         <DropDownLabelWrapper>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired}
               inputHasValue={inputHasValue}
               isDarkTheme={isDarkTheme}
               isDisabled={isDisabled}
               hideLabel={!(!!isActive || inputHasValue) || !!hidePlaceholderOnFocus}
            >
               {placeholder}
            </InputLabel>
         </DropDownLabelWrapper>
         <StyledSelect
            name={name.toString()}
            onChange={handleChange}
            id={id}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isRequired={isRequired}
            value={value}
            isDisabled={isDisabled}
            isActive={!!isActive}
            valueExists={!!value}
         >
            <StyledOption
               isDarkTheme={isDarkTheme}
               label={!(!!isActive || inputHasValue) ? placeholder : ''}
               value=""
               hidden={isRequired}
            />
            {dropDownOptions.map((option) => (
               <StyledOption isDarkTheme={isDarkTheme} value={option.value} key={option.value}>
                  {option.label}
               </StyledOption>
            ))}
         </StyledSelect>
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </DropDownInputContainer>
   );
}
