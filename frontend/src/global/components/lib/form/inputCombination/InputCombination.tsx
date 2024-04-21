import type { N_Form } from '../N_Form';
import CheckboxInput from '../checkbox/Checkbox';
import DatePickerInput from '../datePicker/DatePickerInput';
import DropDownInput from '../dropDown/DropDownInput';
import NumberLineInput from '../numberLine/NumberLineInp';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

export default function InputCombination(
   props: N_Form.Inputs.I.AllInputPropsAsRequired,
): JSX.Element {
   // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENT PROPS -- //
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
      numberLineOptions,
      capitalize,
      Component,
   } = props;

   function isValueNumber(value: unknown): value is number {
      return typeof value === 'number' || value === '';
   }

   if (Component === DatePickerInput) {
      if (!(value instanceof Date || value === '')) {
         throw new Error(`${name} does not have a value of type Date`);
      }
      return (
         <DatePickerInput
            label={label}
            name={name}
            isRequired={isRequired}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled}
         />
      );
   }

   if (Component === CheckboxInput) {
      if (typeof value !== 'boolean') {
         throw new Error(`${name} does not have a value of type boolean`);
      }
      return (
         <CheckboxInput
            label={label}
            name={name}
            isRequired={isRequired}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled}
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
            isRequired={isRequired}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled}
            numberLineOptions={numberLineOptions}
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
            isRequired={isRequired}
            value={value}
            error={error}
            handleChange={handleChange}
            id={id}
            isDisabled={isDisabled}
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
         isRequired={isRequired}
         autoComplete={autoComplete}
         capitalize={capitalize}
         handleChange={handleChange}
         value={value}
         error={error}
         id={id}
         isDisabled={isDisabled}
      />
   );
}
