import MiscHelper from '../../../../helpers/dataTypes/miscHelper/MiscHelper';
import type { IDateChangeEvent, INumberRangeChangeEvent } from '../../../../hooks/useForm';
import DatePickerInput from '../datePicker/DatePickerInput';
import type { IDropDownOption } from '../dropDown/DropDownInput';
import DropDownInput from '../dropDown/DropDownInput';
import InputComponent from '../input/Input';
import NumberSliderInput from '../numberSlider/NumberSliderInput';

interface IInputCombination {
   placeholder: string;
   name: string | number;
   isRequired?: boolean;
   handleChange: (
      e:
         | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
         | IDateChangeEvent
         | INumberRangeChangeEvent,
   ) => void;
   error: string;
   dropDownOptions?: IDropDownOption[];
   id: string;
   type: string;
   value: string | number | Date;
   autoComplete?: 'current-password' | 'new-password';
   isDisabled?: boolean | undefined;
   hidePlaceholderOnFocus?: boolean;
   numberLineInputProps?: {
      min: number;
      max: number;
      displayAllNumbers?: boolean;
      displayLinePointers?: boolean;
   };
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
      numberLineInputProps,
   } = props;

   const hasDropDownOptions = !!dropDownOptions;

   function isValueDate(value: unknown): value is Date {
      return value instanceof Date;
   }

   function isTypeDate(type: string): type is 'date' {
      return type === 'date';
   }

   type INumberLineInputProps = Exclude<typeof numberLineInputProps, undefined>;

   function isTypeNumberSlider(numberLineInput: unknown): numberLineInput is INumberLineInputProps {
      return MiscHelper.isNotFalsyOrEmpty(numberLineInputProps);
   }

   function isValueNumber(value: unknown): value is number {
      return typeof value === 'number' || value === '';
   }

   return (
      <>
         {!hasDropDownOptions &&
            !isValueDate(value) &&
            !isTypeNumberSlider(numberLineInputProps) &&
            !isTypeDate(type) && (
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
                  hidePlaceholderOnFocus={hidePlaceholderOnFocus}
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
               hidePlaceholderOnFocus={hidePlaceholderOnFocus}
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
         {isTypeNumberSlider(numberLineInputProps) && isValueNumber(value) && (
            <NumberSliderInput
               placeholder={placeholder}
               name={name}
               isRequired={isRequired}
               value={value}
               error={error}
               handleChange={handleChange}
               id={id}
               isDisabled={isDisabled}
               type={type}
               numberLineInputProps={numberLineInputProps}
            />
         )}
      </>
   );
}
