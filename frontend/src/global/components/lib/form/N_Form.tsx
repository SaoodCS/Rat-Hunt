/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IDateChangeEvent } from './datePicker/DatePickerInput';
import DatePickerInput from './datePicker/DatePickerInput';
import type { IDropDownOption, ISelectFieldChangeEvent } from './dropDown/DropDownInput';
import DropDownInput from './dropDown/DropDownInput';
import type { INumberLineOptions, INumberRangeChangeEvent } from './numberLine/NumberLineInput';
import NumberLineInput from './numberLine/NumberLineInput';
import type { ITextOrNumFieldChangeEvent } from './textOrNumber/TextOrNumFieldInput';
import TextOrNumFieldInput from './textOrNumber/TextOrNumFieldInput';

//TEMPORARILY HERE:
export interface ICheckboxSwitchRadioChangeEvent {
   target: {
      name: string | number;
      value: boolean;
      valueType: 'boolean';
   };
}

export namespace N_Form {
   export namespace Inputs {
      export namespace I {
         type InputObject<FieldName, ValueType> = AllInputProps & {
            name: FieldName;
            validator: (value: ValueType) => boolean | string;
         };
         export type InputArray<FormInputs> = {
            [FieldName in keyof FormInputs]: InputObject<FieldName, FormInputs[FieldName]>;
         }[keyof FormInputs][];
         export type TextOrNumTypeProp = 'string' | 'text' | 'email' | 'password' | 'number';
         export type TypeProp = TextOrNumTypeProp | 'boolean' | 'date';

         export type Components =
            // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS (after creating its component) -- //
            | typeof DatePickerInput
            | typeof DropDownInput
            | typeof NumberLineInput
            | typeof TextOrNumFieldInput;

         export type HandleChange = (
            // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS (after defining its handleChange type in its component) -- //
            e:
               | ITextOrNumFieldChangeEvent
               | ISelectFieldChangeEvent
               | IDateChangeEvent
               | INumberRangeChangeEvent
               | ICheckboxSwitchRadioChangeEvent,
         ) => void;

         export type CommonInputProps = {
            name: string | number;
            id: string;
            placeholder: string;
            isRequired: boolean;
            isDisabled: boolean;
            error: string;
            handleChange: HandleChange;
         };

         export type AllInputProps = Omit<CommonInputProps, 'error' | 'handleChange'> & {
            // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS (if it takes any additional props) -- //
            Component: Inputs.I.Components;
            type: TypeProp;
            autoComplete?: 'current-password' | 'new-password' | undefined;
            dropDownOptions?: IDropDownOption[] | undefined;
            numberLineOptions?: INumberLineOptions | undefined;
            hidePlaceholderOnFocus?: boolean | undefined;
            isRequired?: boolean | undefined;
            isDisabled?: boolean | undefined;
         };
      }
   }

   export namespace Helper {
      export function createInitialState<T>(arr: Inputs.I.InputArray<T>): T {
         // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS -- //
         const initialState: any = {};
         for (let i = 0; i < arr.length; i++) {
            const input = arr[i];
            if (input.Component === DatePickerInput) {
               initialState[input.name] = new Date();
               continue;
            }
            if (input.Component === TextOrNumFieldInput) {
               initialState[input.name] = '';
               continue;
            }
            if (input.Component === DropDownInput) {
               initialState[input.name] = '';
               continue;
            }
            if (input.Component === NumberLineInput) {
               initialState[input.name] = '';
               continue;
            }
            initialState[input.name] = '';
         }
         return initialState as T;
      }

      export function createInitialErrors<T>(arr: Inputs.I.InputArray<T>): Record<keyof T, string> {
         const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
         arr.forEach((input) => {
            errors[input.name] = '';
         });
         return errors;
      }

      export function validation<T>(
         formStateVal: T,
         formInputsArr: Inputs.I.InputArray<T>,
      ): Record<keyof T, string> {
         const validated = formInputsArr.map((input) => {
            const validationValue = input.validator(formStateVal[input.name]);
            return { [input.name]: validationValue === true ? '' : validationValue };
         });
         return Object.assign({}, ...validated);
      }

      export function hasErrors<T>(errors: Record<keyof T, string>): boolean {
         return !Object.values(errors).every((error) => error === '');
      }
   }
}
