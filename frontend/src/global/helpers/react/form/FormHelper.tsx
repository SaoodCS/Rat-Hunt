import type { IDropDownOption } from '../../../components/lib/form/dropDown/DropDownInput';

type InputObject<FieldName, ValueType> = {
   name: FieldName;
   id: string;
   placeholder: string;
   type: 'text' | 'password' | 'email' | 'number' | 'date' | 'checkbox' | 'select' | 'boolean';
   isRequired: boolean;
   autoComplete?: 'current-password' | 'new-password';
   validator: (value: ValueType) => string | true;
   isDropDown?: boolean;
   dropDownOptions?: IDropDownOption[];
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
         if (input.type === 'checkbox') {
            initialState[input.name] = false;
         }
         if (input.type === 'password' || input.type === 'email' || input.type === 'text') {
            initialState[input.name] = '';
         }
         if (input.type === 'number') {
            initialState[input.name] = '';
         }
         if (input.type === 'date') {
            initialState[input.name] = new Date();
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
