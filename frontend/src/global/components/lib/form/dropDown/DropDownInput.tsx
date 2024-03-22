import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type {
   ISelectFieldChangeEvent,
   IUseFormHandleChange,
   InputValueTypes,
} from '../../../../hooks/useForm';
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

interface IDropDownInput {
   name: number | string;
   id: string;
   placeholder: string;
   type: InputValueTypes;
   dropDownOptions: IDropDownOption[];
   hidePlaceholderOnFocus: boolean;
   isRequired: boolean;
   isDisabled: boolean;
   value: string | number;
   error: string;
   handleChange: IUseFormHandleChange;
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
      type,
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

   function handleChangeWithValueType(e: React.ChangeEvent<HTMLSelectElement>): void {
      const assertEType = e as ISelectFieldChangeEvent;
      assertEType.target.valueType = type;
      handleChange(assertEType);
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
            onChange={handleChangeWithValueType}
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
