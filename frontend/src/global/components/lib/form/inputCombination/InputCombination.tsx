import type { N_Form } from '../N_Form';
import DatePickerInput from '../datePicker/DatePickerInput';
import DropDownInput from '../dropDown/DropDownInput';
import NumberLineInput from '../numberLine/NumberLineInput';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

interface IInputCombination extends N_Form.Inputs.I.AllInputProps {
   value: string | number | Date | boolean;
   error: string;
   handleChange: N_Form.Inputs.I.HandleChange;
}

export default function InputCombination(props: IInputCombination): JSX.Element {
   const {
      placeholder,
      name,
      isRequired,
      handleChange,
      error,
      dropDownOptions,
      id,
      type,
      value,
      autoComplete,
      isDisabled,
      hidePlaceholderOnFocus,
      numberLineOptions,
      Component,
   } = props;

   function isValueNumber(value: unknown): value is number {
      return typeof value === 'number' || value === '';
   }

   if (Component === NumberLineInput) {
      if (!numberLineOptions || !isValueNumber(value)) {
         const errSuffix = !numberLineOptions ? 'numberLineOptions' : 'a value of type number';
         throw new Error(`${name} does not have ${errSuffix}`);
      }
      return (
         <NumberLineInput
            placeholder={placeholder}
            name={name}
            isRequired={isRequired || false}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled || false}
            numberLineOptions={numberLineOptions}
         />
      );
   }

   if (Component === DatePickerInput) {
      if (!(value instanceof Date)) {
         throw new Error(`${name} does not have a value of type Date`);
      }
      return (
         <DatePickerInput
            placeholder={placeholder}
            name={name}
            isRequired={isRequired || false}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled || false}
         />
      );
   }

   if (Component === DropDownInput) {
      if (!dropDownOptions || !(typeof value === 'string' || typeof value === 'number')) {
         throw new Error(`${name} does not have dropDownOptions`);
      }
      return (
         <DropDownInput
            placeholder={placeholder}
            name={name}
            type={type}
            dropDownOptions={dropDownOptions || []}
            isRequired={isRequired || false}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled || false}
            hidePlaceholderOnFocus={hidePlaceholderOnFocus || false}
         />
      );
   }

   if (!(typeof value === 'string' || typeof value === 'number')) {
      throw new Error(`${name} does not have a value of type string or number`);
   }
   if (type === 'boolean' || type === 'date') {
      throw new Error(
         `${name} must have a type prop set to 'text' | 'email' | 'password' | 'number'`,
      );
   }
   return (
      <TextOrNumFieldInput
         placeholder={placeholder}
         type={type}
         name={name}
         isRequired={isRequired || false}
         autoComplete={autoComplete}
         handleChange={handleChange}
         value={value}
         error={error}
         id={id}
         isDisabled={isDisabled || false}
         hidePlaceholderOnFocus={hidePlaceholderOnFocus || false}
      />
   );
}
