import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { InputContainer, InputLabel, LabelWrapper } from '../textOrNumber/Style';
import { DatePickerWrapper } from './Style';
import { ErrorLabel } from '../style/Style';

export interface IDatePickerInputProps extends N_Form.Inputs.I.CommonInputProps {
   value: Date | null;
}

export default function DatePickerInput(props: IDatePickerInputProps): JSX.Element {
   const { label, name, isRequired, value, error, handleChange, id, isDisabled } = props;
   const [isActive, setIsActive] = useState(false);
   const [inputHasValue, setInputHasValue] = useState(value !== null);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      setInputHasValue(value !== null);
   }, [value]);

   function handleFocus(e: React.FocusEvent<HTMLInputElement, Element>): void {
      setIsActive(true);
      const el = e.target as HTMLInputElement;
      el.setAttribute('inputmode', 'none');
   }

   function handleOnCalendarOpen(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
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
            >
               {label}
            </InputLabel>
         </LabelWrapper>
         <DatePickerWrapper isDarkTheme={isDarkTheme} isActive={isActive} hasError={!!error}>
            <DatePicker
               id={id}
               selected={value}
               onChange={(date) => {
                  handleChange({
                     target: {
                        name,
                        value: date,
                     },
                  });
               }}
               onBlur={handleBlur}
               onFocus={(e) => handleFocus(e)}
               dateFormat="MMMM d, yyyy h:mm aa"
               showTimeSelect
               onCalendarClose={handleBlur}
               onCalendarOpen={handleOnCalendarOpen}
               showIcon
            />
         </DatePickerWrapper>
         <ErrorLabel isDarkTheme={isDarkTheme}>{error}</ErrorLabel>
      </InputContainer>
   );
}
