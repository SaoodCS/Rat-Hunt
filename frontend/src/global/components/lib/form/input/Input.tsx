import { useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

interface IInput {
   placeholder: string;
   type: string;
   name: string | number;
   isRequired?: boolean;
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   error: string;
   value: string | number;
   id: string;
   autoComplete?: 'current-password' | 'new-password';
   isDisabled?: boolean | undefined;
}

export default function InputComponent(props: IInput): JSX.Element {
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
