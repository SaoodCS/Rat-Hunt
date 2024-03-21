import { useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { IUseFormHandleChange } from '../../../../hooks/useForm';
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
   } = props;
   const { isDarkTheme } = useThemeContext();
   const [isActive, setIsActive] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   function selectCurrentValue(e: React.ChangeEvent<HTMLSelectElement>): void {
      setIsEmpty(e.target.value === '');
      handleChange(e);
   }

   return (
      <DropDownInputContainer>
         <DropDownArrow darktheme={isDarkTheme.toString()} focusedinput={isActive.toString()} />
         <DropDownLabelWrapper>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={!isEmpty || !!value}
               isDarkTheme={isDarkTheme}
               isDisabled={isDisabled || false}
               hideLabel={!(!!isActive || !!value) || !!hidePlaceholderOnFocus}
            >
               {placeholder}
            </InputLabel>
         </DropDownLabelWrapper>
         <StyledSelect
            name={name.toString()}
            onChange={selectCurrentValue}
            id={id}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isRequired={isRequired || false}
            value={value}
            isDisabled={isDisabled || false}
            isActive={!!isActive}
            valueExists={!!value}
         >
            <StyledOption
               isDarkTheme={isDarkTheme}
               label={!(!!isActive || !!value) ? placeholder : ''}
               value=""
               hidden={isRequired || false}
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
