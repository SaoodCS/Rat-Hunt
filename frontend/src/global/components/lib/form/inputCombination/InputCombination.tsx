import MiscHelper from '../../../../helpers/dataTypes/miscHelper/MiscHelper';
import type { InputType } from '../../../../helpers/react/form/FormHelper';
import type { IUseFormHandleChange } from '../../../../hooks/useForm';
import DatePickerInput from '../datePicker/DatePickerInput';
import type { IDropDownOption } from '../dropDown/DropDownInput';
import DropDownInput from '../dropDown/DropDownInput';
import type { INumberLineOptions } from '../numberLine/NumberLineInput';
import NumberLineInput from '../numberLine/NumberLineInput';
import TextOrNumFieldInput from '../textOrNumber/TextOrNumFieldInput';

interface IInputCombination {
   name: string | number;
   id: string;
   placeholder: string;
   type: InputType;
   autoComplete: 'current-password' | 'new-password' | undefined;
   dropDownOptions: IDropDownOption[] | undefined;
   numberLineOptions: INumberLineOptions | undefined;
   hidePlaceholderOnFocus: boolean | undefined;
   isRequired: boolean | undefined;
   isDisabled: boolean | undefined;
   value: string | number | Date;
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
   } = props;

   function isValueNumber(value: unknown): value is number {
      return typeof value === 'number' || value === '';
   }

   if (MiscHelper.isNotFalsyOrEmpty(numberLineOptions)) {
      if (!isValueNumber(value)) {
         throw new Error('NumberLineInput requires a number value');
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
            type={type}
            numberLineOptions={numberLineOptions}
         />
      );
   }

   if (value instanceof Date) {
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

   if (dropDownOptions) {
      return (
         <DropDownInput
            placeholder={placeholder}
            name={name}
            dropDownOptions={dropDownOptions}
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
