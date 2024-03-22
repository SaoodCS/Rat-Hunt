import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type {
   ITextOrNumFieldChangeEvent,
   IUseFormHandleChange,
   TextOrNumInputTypes,
} from '../../../../hooks/useForm';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

interface IInput {
   name: string | number;
   id: string;
   placeholder: string;
   type: TextOrNumInputTypes;
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

   function handleChangeWithValueType(e: React.ChangeEvent<HTMLInputElement>): void {
      const assertEType = e as ITextOrNumFieldChangeEvent;
      assertEType.target.valueType = type;
      handleChange(assertEType);
   }

   return (
      <InputContainer>
         <LabelWrapper htmlFor={id}>
            <InputLabel
               focusedInput={isActive}
               isRequired={isRequired}
               inputHasValue={inputHasValue}
               isDarkTheme={isDarkTheme}
               isDisabled={isDisabled}
               hideLabel={!!hidePlaceholderOnFocus && (!!isActive || inputHasValue)}
            >
               {placeholder}
            </InputLabel>
         </LabelWrapper>

         <TextInput
            id={id}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={type}
            name={name.toString()}
            isRequired={isRequired}
            onChange={handleChangeWithValueType}
            value={value}
            hasError={!!error}
            isDarkTheme={isDarkTheme}
            autoComplete={autoComplete}
            isDisabled={isDisabled}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputContainer>
   );
}
