import type { IDateChangeEvent } from '../../../../hooks/useForm';
import DatePickerInput from '../datePicker/DatePickerInput';
import type { IDropDownOption } from '../dropDown/DropDownInput';
import DropDownInput from '../dropDown/DropDownInput';
import InputComponent from '../input/Input';

interface IInputCombination {
   placeholder: string;
   name: string | number;
   isRequired?: boolean;
   handleChange: (
      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | IDateChangeEvent,
   ) => void;
   error: string;
   dropDownOptions?: IDropDownOption[];
   id: string;
   type: string;
   value: string | number | Date;
   autoComplete?: 'current-password' | 'new-password';
   isDisabled?: boolean | undefined;
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
   } = props;

   const hasDropDownOptions = !!dropDownOptions;

   function isValueDate(value: unknown): value is Date {
      return value instanceof Date;
   }

   function isTypeDate(type: string): type is 'date' {
      return type === 'date';
   }

   return (
      <>
         {!hasDropDownOptions && !isValueDate(value) && !isTypeDate(type) && (
            <InputComponent
               placeholder={placeholder}
               type={type}
               name={name}
               isRequired={isRequired}
               autoComplete={autoComplete}
               handleChange={handleChange}
               value={value}
               error={error}
               id={id}
               isDisabled={isDisabled}
            />
         )}
         {hasDropDownOptions && !isValueDate(value) && !isTypeDate(type) && (
            <DropDownInput
               placeholder={placeholder}
               name={name}
               options={dropDownOptions}
               isRequired={isRequired}
               value={value}
               error={error}
               handleChange={handleChange}
               id={id}
               isDisabled={isDisabled}
            />
         )}
         {isTypeDate(type) && isValueDate(value) && (
            <DatePickerInput
               placeholder={placeholder}
               name={name}
               isRequired={isRequired}
               value={value}
               error={error}
               handleChange={handleChange}
               id={id}
               isDisabled={isDisabled}
               type={type}
            />
         )}
      </>
   );
}
