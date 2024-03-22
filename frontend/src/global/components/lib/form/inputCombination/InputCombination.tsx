import type { IUseFormHandleChange, InputValueTypes } from '../../../../hooks/useForm';
import DatePickerInput from '../datePicker/DatePickerInput';
import type { IDropDownOption } from '../dropDown/DropDownInput';
import DropDownInput from '../dropDown/DropDownInput';
import type { INumberLineOptions } from '../numberLine/NumberLineInput';
import NumberLineInput from '../numberLine/NumberLineInput';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

export type IInputComponents =
   | typeof DatePickerInput
   | typeof DropDownInput
   | typeof NumberLineInput
   | typeof TextOrNumFieldInput;

interface IInputCombination {
   Component: IInputComponents;
   name: string | number;
   id: string;
   placeholder: string;
   type: InputValueTypes;
   autoComplete: 'current-password' | 'new-password' | undefined;
   dropDownOptions: IDropDownOption[] | undefined;
   numberLineOptions: INumberLineOptions | undefined;
   hidePlaceholderOnFocus: boolean | undefined;
   isRequired: boolean | undefined;
   isDisabled: boolean | undefined;
   value: string | number | Date | boolean;
   error: string;
   handleChange: IUseFormHandleChange;
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
