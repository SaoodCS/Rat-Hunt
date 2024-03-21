import { useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { IUseFormHandleChange } from '../../../../hooks/useForm';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

interface IInput {
   name: string | number;
   id: string;
   placeholder: string;
   type: string;
   autoComplete: 'current-password' | 'new-password' | undefined;
   hidePlaceholderOnFocus: boolean;
   isRequired: boolean;
   isDisabled: boolean;
   value: string | number;
   error: string;
   handleChange: IUseFormHandleChange;
}

export default function TextOrNumFieldInput(props: IInput): JSX.Element {
   const {
      placeholder,
      type,
      name,
      isRequired,
      handleChange,
      value,
      error,
      id,
      autoComplete,
      isDisabled,
      hidePlaceholderOnFocus,
   } = props;
   const [isActive, setIsActive] = useState(false);
   const { isDarkTheme } = useThemeContext();

   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

   return (
      <InputContainer>
         <LabelWrapper htmlFor={id || name.toString()}>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired || false}
               inputHasValue={!!value || value === 0}
               isDarkTheme={isDarkTheme}
               isDisabled={isDisabled || false}
               hideLabel={!!hidePlaceholderOnFocus && (!!isActive || !!value)}
            >
               {placeholder}
            </InputLabel>
         </LabelWrapper>

         <TextInput
            id={id || name.toString()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={type}
            name={name.toString()}
            isRequired={isRequired || false}
            onChange={handleChange}
            value={value}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            autoComplete={autoComplete}
            isDisabled={isDisabled || false}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputContainer>
   );
}
