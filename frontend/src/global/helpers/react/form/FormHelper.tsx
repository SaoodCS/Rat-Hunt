import DatePickerInput from '../../../components/lib/form/datePicker/DatePickerInput';
import type { IDropDownOption } from '../../../components/lib/form/dropDown/DropDownInput';
import DropDownInput from '../../../components/lib/form/dropDown/DropDownInput';
import type { IInputComponents } from '../../../components/lib/form/inputCombination/InputCombination';
import type { INumberLineOptions } from '../../../components/lib/form/numberLine/NumberLineInput';
import NumberLineInput from '../../../components/lib/form/numberLine/NumberLineInput';
import TextOrNumFieldInput from '../../../components/lib/form/textOrNumber/TextOrNumFieldInput';

export type InputType =
   | 'text'
   | 'password'
   | 'email'
   | 'number'
   | 'date'
   | 'checkbox'
   | 'select'
   | 'boolean';

type InputObject<FieldName, ValueType> = {
   name: FieldName;
   id: string;
   placeholder: string;
   type: InputType;
   validator: (value: ValueType) => string | true;
   autoComplete?: 'current-password' | 'new-password';
   dropDownOptions?: IDropDownOption[];
   numberLineOptions?: INumberLineOptions;
   hidePlaceholderOnFocus?: boolean;
   isRequired?: boolean;
   isDisabled?: boolean;
   Component: IInputComponents;
};

export type InputArray<FormInputs> = {
   [FieldName in keyof FormInputs]: InputObject<FieldName, FormInputs[FieldName]>;
}[keyof FormInputs][];

export type OptionalNumberInput = number | '';

export default class FormHelper {
   static createInitialState<T>(arr: InputArray<T>): T {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialState: any = {};
      arr.forEach((input) => {
         if (input.Component === TextOrNumFieldInput) {
            if (input.type === 'checkbox') {
               initialState[input.name] = false;
            } else {
               initialState[input.name] = '';
            }
         }
         if (input.Component === DatePickerInput) {
            initialState[input.name] = new Date();
         }
         if (input.Component === DropDownInput) {
            initialState[input.name] = '';
         }
         if (input.Component === NumberLineInput) {
            initialState[input.name] = '';
         }
      });
      return initialState as T;
   }

   static createInitialErrors<T>(arr: InputArray<T>): Record<keyof T, string> {
      const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
      arr.forEach((input) => {
         errors[input.name] = '';
      });
      return errors;
   }

   static validation<T>(formStateVal: T, formInputsArr: InputArray<T>): Record<keyof T, string> {
      const validated = formInputsArr.map((input) => {
         const validationValue = input.validator(formStateVal[input.name]);

         return { [input.name]: validationValue === true ? '' : validationValue };
      });
      return Object.assign({}, ...validated);
   }

   static hasErrors<T>(errors: Record<keyof T, string>): boolean {
      return !Object.values(errors).every((error) => error === '');
   }
}
