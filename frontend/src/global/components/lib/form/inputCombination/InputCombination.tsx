import MiscHelper from '../../../../helpers/dataTypes/miscHelper/MiscHelper';
import type { InputType } from '../../../../helpers/react/form/FormHelper';
import type { IUseFormHandleChange } from '../../../../hooks/useForm';
import DatePickerInput from '../datePicker/DatePickerInput';
import type { IDropDownOption } from '../dropDown/DropDownInput';
import DropDownInput from '../dropDown/DropDownInput';
import InputComponent from '../input/Input';
import type { INumberLineOptions } from '../numberLine/NumberLineInput';
import NumberLineInput from '../numberLine/NumberLineInput';

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

   const hasDropDownOptions = !!dropDownOptions;

   function isValueDate(value: unknown): value is Date {
      return value instanceof Date;
   }

   function isTypeDate(type: string): type is 'date' {
      return type === 'date';
   }

   function isTypeNumberLine(numberLineInput: unknown): numberLineInput is INumberLineOptions {
      return MiscHelper.isNotFalsyOrEmpty(numberLineOptions);
   }

   function isValueNumber(value: unknown): value is number {
      return typeof value === 'number' || value === '';
   }

   return (
      <>
         {!hasDropDownOptions &&
            !isValueDate(value) &&
            !isTypeNumberLine(numberLineOptions) &&
            !isTypeDate(type) && (
               <InputComponent
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
            )}
         {hasDropDownOptions && !isValueDate(value) && !isTypeDate(type) && (
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
         )}
         {isTypeDate(type) && isValueDate(value) && (
            <DatePickerInput
               placeholder={placeholder}
               name={name}
               isRequired={isRequired || false}
               value={value}
               error={error}
               handleChange={handleChange}
               id={id}
               isDisabled={isDisabled || false}
               type={type}
            />
         )}
         {isTypeNumberLine(numberLineOptions) && isValueNumber(value) && (
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
         )}
      </>
   );
}
