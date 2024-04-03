import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputWrapper } from '../style/Style';
import { TextInput } from './Style';

export type ITextOrNumInputType = 'text' | 'email' | 'password' | 'number';
export type IAutoComplete = 'current-password' | 'new-password' | 'one-time-code' | 'username'; // Note: One time code autofills code received from email / sms, if the email / sms includes keyword "code"
export type ICapitalize = 'characters' | 'words' | 'sentences';

interface IInput extends N_Form.Inputs.I.CommonInputProps {
   type: ITextOrNumInputType;
   autoComplete?: IAutoComplete;
   capitalize?: ICapitalize;
   value: string | number;
}

export default function TextOrNumFieldInput(props: IInput): JSX.Element {
   const {
      label,
      type,
      name,
      isRequired,
      handleChange,
      value,
      error,
      id,
      autoComplete,
      isDisabled,
      capitalize,
   } = props;
   const { isDarkTheme } = useThemeContext();
   const [hasError, setHasError] = useState(!!error);
   const [isTypeNumber, setIsTypeNumber] = useState(type === 'number');

   useEffect(() => {
      setIsTypeNumber(type === 'number');
   }, [type]);

   useEffect(() => {
      setHasError(!!error);
   }, [error]);

   function displayNumKeypad(): {
      inputMode?: 'numeric';
      pattern?: string;
   } {
      if (!isTypeNumber) return {};
      return {
         inputMode: 'numeric',
         pattern: '[0-9]*',
      };
   }

   function amendHandleChange(e: React.ChangeEvent<HTMLInputElement>): void {
      const { value: newVal } = e.target;
      if (capitalize === 'characters') {
         const newValCapitalized = newVal.toUpperCase();
         handleChange({ target: { name, value: newValCapitalized } });
         return;
      }
      if (capitalize === 'words') {
         const newValCapitalized = newVal
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
         handleChange({ target: { name, value: newValCapitalized } });
         return;
      }
      if (capitalize === 'sentences') {
         const newValCapitalized = newVal
            .split('. ')
            .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
            .join('. ');
         handleChange({ target: { name, value: newValCapitalized } });
         return;
      }
      handleChange(e);
   }

   return (
      <InputWrapper>
         <TextInput
            type={type}
            name={name.toString()}
            id={id}
            onChange={amendHandleChange}
            value={value}
            autoComplete={autoComplete}
            placeholder={label}
            required={isRequired}
            isDarkTheme={isDarkTheme}
            hasError={hasError}
            isDisabled={isDisabled}
            isRequired={isRequired}
            autoCapitalize={capitalize}
            {...displayNumKeypad()}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputWrapper>
   );
}
