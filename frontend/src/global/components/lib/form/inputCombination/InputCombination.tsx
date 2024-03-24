import type { N_Form } from '../N_Form';
import CheckboxInput from '../checkbox/Checkbox';
import DatePickerInput from '../datePicker/DatePickerInput';
import DropDownInput from '../dropDown/DropDownInput';
import NumberLineInput from '../numberLine/NumberLineInput';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

export default function InputCombination(
   props: N_Form.Inputs.I.AllInputPropsAsRequired,
): JSX.Element {
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

   if (Component === CheckboxInput) {
      if (typeof value !== 'boolean') {
         throw new Error(`${name} does not have a value of type boolean`);
      }
      return (
         <CheckboxInput
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
      if (!(value instanceof Date || value === null)) {
         throw new Error(`${name} does not have a value of type Date or unset as null`);
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
   if (!type) {
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
