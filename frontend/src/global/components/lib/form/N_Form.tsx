/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Types } from '../../../../../../shared/types/Types';
import CheckboxInput from './checkbox/Checkbox';
import type { IDropDownOptions } from './dropDown/DropDownInput';
import DropDownInput from './dropDown/DropDownInput';
import type { INumberLineOptions } from './numberLine/NumberLineInp';
import NumberLineInput from './numberLine/NumberLineInp';
import type { IAutoComplete, ITextOrNumInputType } from './textOrNumber/TextOrNumFieldInput';
import TextOrNumFieldInput from './textOrNumber/TextOrNumFieldInput';

export namespace N_Form {
   export namespace Inputs {
      export namespace I {
         type InputValue = string | number | Date | boolean | null;
         export type Components =
            // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS (after creating its component) -- //
            | typeof TextOrNumFieldInput
            | typeof CheckboxInput
            | typeof DropDownInput
            | typeof NumberLineInput;

         export type HandleChangeEvent =
            | {
                 target: {
                    name: string | number;
                    value: InputValue;
                 };
              }
            | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>;

         export type HandleChange = (e: HandleChangeEvent) => void;

         export type CommonInputProps = {
            name: string | number;
            id: string;
            label: string;
            isRequired: boolean;
            isDisabled: boolean;
            error: string;
            handleChange: HandleChange;
         };

         export type AllInputProps = CommonInputProps & {
            // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS (if it takes any additional props, add it as an optional) -- //
            Component: Inputs.I.Components;
            value: InputValue;
            type?: ITextOrNumInputType;
            autoComplete?: IAutoComplete;
            dropDownOptions?: IDropDownOptions;
            numberLineOptions?: INumberLineOptions;
         };

         export type ArrOfInputObjects<FormInputs> = {
            [FieldName in keyof FormInputs]: Omit<
               AllInputProps,
               'error' | 'handleChange' | 'value' | 'name'
            > & {
               name: FieldName;
               validator: (value: FormInputs[FieldName]) => boolean | string;
            };
         }[keyof FormInputs][];

         export type AllInputPropsAsRequired = Types.MakeAllRequired.AddORUndefined<AllInputProps>;
      }
   }

   export namespace Helper {
      export function createInitialState<T>(arr: Inputs.I.ArrOfInputObjects<T>): T {
         // -- UPDATE HERE WHEN ADDING NEW INPUT COMPONENTS -- //
         const initialState: any = {};
         for (let i = 0; i < arr.length; i++) {
            const input = arr[i];
            if (input.Component === CheckboxInput) {
               initialState[input.name] = false;
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

      export function createInitialErrors<T>(
         arr: Inputs.I.ArrOfInputObjects<T>,
      ): Record<keyof T, string> {
         const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
         arr.forEach((input) => {
            errors[input.name] = '';
         });
         return errors;
      }

      export function validation<T>(
         formStateVal: T,
         formInputsArr: Inputs.I.ArrOfInputObjects<T>,
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
