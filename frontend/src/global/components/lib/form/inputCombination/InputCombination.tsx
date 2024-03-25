import type { N_Form } from '../N_Form';
import CheckboxInput from '../checkbox/Checkbox';
import DatePickerInput from '../datePicker/DatePickerInput';
import DropDownInput from '../dropDown/dropDownInput';
import NumberLineInput from '../numberLine/numberLineInput';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

export default function InputCombination(
   props: N_Form.Inputs.I.AllInputPropsAsRequired,
): JSX.Element {
   const {
      label,
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
      hideLabelOnFocus,
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
            label={label}
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
            label={label}
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
            label={label}
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
         const suffix = !dropDownOptions ? 'dropDownOptions' : 'a value of type string or number';
         throw new Error(`${name} does not have ${suffix}`);
      }
      return (
         <DropDownInput
            label={label}
            name={name}
            dropDownOptions={dropDownOptions}
            isRequired={isRequired || false}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled || false}
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
         label={label}
         type={type}
         name={name}
         isRequired={isRequired || false}
         autoComplete={autoComplete}
         handleChange={handleChange}
         value={value}
         error={error}
         id={id}
         isDisabled={isDisabled || false}
         hideLabelOnFocus={hideLabelOnFocus || false}
      />
   );
}
