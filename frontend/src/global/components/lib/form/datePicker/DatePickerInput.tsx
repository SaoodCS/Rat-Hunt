import { useState } from 'react';
import DatePicker from 'react-datepicker';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import type { IDateChangeEvent } from '../../../../hooks/useForm';
import { ErrorLabel, InputContainer, InputLabel, LabelWrapper } from '../input/Style';
import { DatePickerWrapper } from './Style';

interface IDatePickerInput {
   placeholder: string;
   name: string | number;
   isRequired?: boolean;
   value: Date;
   error: string;
   handleChange: (
      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | IDateChangeEvent,
   ) => void;
   id: string;
   isDisabled: boolean | undefined;
   type: string;
}

export default function DatePickerInput(props: IDatePickerInput): JSX.Element {
   const { placeholder, name, isRequired, value, error, handleChange, id, isDisabled } = props;

   const [isActive, setIsActive] = useState(false);
   const { isDarkTheme } = useThemeContext();

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
         <DatePickerWrapper isDarkTheme={isDarkTheme} isActive={isActive}>
            <DatePicker
               id={id}
               selected={value}
               onChange={(date) => handleChange({ date, name })}
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
