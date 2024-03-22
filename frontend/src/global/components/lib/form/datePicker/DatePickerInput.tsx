import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { N_Form } from '../N_Form';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper } from '../textOrNumber/Style';
import { DatePickerWrapper } from './Style';

export interface IDateChangeEvent {
   target: {
      name: string | number;
      value: Date | null;
      valueType: 'date';
   };
}

export interface IDatePickerInputProps extends N_Form.Inputs.I.CommonInputProps {
   value: Date;
}

export default function DatePickerInput(props: IDatePickerInputProps): JSX.Element {
   const { placeholder, name, isRequired, value, error, handleChange, id, isDisabled } = props;
   const [isActive, setIsActive] = useState(false);
   const [inputHasValue, setInputHasValue] = useState(!!value);
   const { isDarkTheme } = useThemeContext();

   useEffect(() => {
      setInputHasValue(!!value);
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

   function handleChangeWithValueType(date: Date | null): void {
      const event: IDateChangeEvent = {
         target: {
            name,
            value: date,
            valueType: 'date',
         },
      };
      handleChange(event);
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
               {placeholder}
            </InputLabel>
         </LabelWrapper>
         <DatePickerWrapper isDarkTheme={isDarkTheme} isActive={isActive}>
            <DatePicker
               id={id}
               selected={value}
               onChange={(date) => handleChangeWithValueType(date)}
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
