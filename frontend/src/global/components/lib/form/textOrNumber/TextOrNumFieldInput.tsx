import { useEffect, useState } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { TextInput, TextInputWrapper } from './Style';
import { ErrorLabel } from '../style/Style';

export type ITextOrNumInputType = 'text' | 'email' | 'password' | 'number';
export type IAutoComplete = 'current-password' | 'new-password';

interface IInput extends N_Form.Inputs.I.CommonInputProps {
   type: ITextOrNumInputType;
   autoComplete?: IAutoComplete;
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

   return (
      <TextInputWrapper>
         <TextInput
            type={type}
            name={name.toString()}
            id={id}
            onChange={handleChange}
            value={value}
            autoComplete={autoComplete}
            placeholder={label}
            required={isRequired}
            isDarkTheme={isDarkTheme}
            hasError={hasError}
            isDisabled={isDisabled}
            isRequired={isRequired}
            {...displayNumKeypad()}
         />
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </TextInputWrapper>
   );
}
