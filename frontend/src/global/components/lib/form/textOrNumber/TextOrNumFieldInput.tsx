import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper, TextInput } from './Style';

export interface ITextOrNumFieldChangeEvent extends ChangeEvent<HTMLInputElement> {
   target: HTMLInputElement & { valueType: N_Form.Inputs.I.TypeProp };
}

interface IInput extends N_Form.Inputs.I.CommonInputProps {
   type: N_Form.Inputs.I.TextOrNumTypeProp;
   autoComplete: 'current-password' | 'new-password' | undefined;
   hidePlaceholderOnFocus: boolean;
   value: string | number;
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
