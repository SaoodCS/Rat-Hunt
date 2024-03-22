import type { ChangeEvent } from 'react';
import { useState } from 'react';
import useApiErrorContext from '../context/widget/apiError/hooks/useApiErrorContext';
import FormHelper from '../helpers/react/form/FormHelper';

export type TextOrNumInputTypes = 'string' | 'text' | 'email' | 'password' | 'number';

export type InputValueTypes = TextOrNumInputTypes | 'boolean' | 'date';

export interface ITextOrNumFieldChangeEvent extends ChangeEvent<HTMLInputElement> {
   target: HTMLInputElement & { valueType: InputValueTypes };
}

export interface ISelectFieldChangeEvent extends ChangeEvent<HTMLSelectElement> {
   target: HTMLSelectElement & { valueType: InputValueTypes };
}

export interface INumberRangeChangeEvent {
   target: {
      name: string | number;
      value: number | '';
      valueType: 'number';
   };
}

export interface IDateChangeEvent {
   target: {
      name: string | number;
      value: Date | null;
      valueType: 'date';
   };
}

export interface ICheckboxSwitchRadioChangeEvent {
   target: {
      name: string | number;
      value: boolean;
      valueType: 'boolean';
   };
}

export type IUseFormHandleChange = (
   e:
      | ITextOrNumFieldChangeEvent
      | ISelectFieldChangeEvent
      | IDateChangeEvent
      | INumberRangeChangeEvent
      | ICheckboxSwitchRadioChangeEvent,
) => void;

interface IUseFormReturn<T> {
   form: T;
   setForm: React.Dispatch<React.SetStateAction<T>>;
   errors: Record<keyof T, string>;
   setErrors: React.Dispatch<React.SetStateAction<Record<keyof T, string>>>;
   handleChange: IUseFormHandleChange;
   initHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => { isFormValid: boolean };
}

export default function useForm<T>(
   initialState: T,
   initialErrors: Record<keyof T, string>,
   validationFunc: (formStateVal: T) => Record<keyof T, string>,
): IUseFormReturn<T> {
   const [form, setForm] = useState(initialState);
   const [errors, setErrors] = useState(initialErrors);
   const { setApiError } = useApiErrorContext();

   function initHandleSubmit(e: React.FormEvent<HTMLFormElement>): { isFormValid: boolean } {
      e.preventDefault();
      setApiError('');
      setErrors(initialErrors);
      const validationErrors = validationFunc(form);
      if (FormHelper.hasErrors(validationErrors)) {
         setErrors(validationErrors);
         return { isFormValid: false };
      }
      return { isFormValid: true };
   }

   function handleChange(e: Parameters<IUseFormHandleChange>[0]): void {
      const { name, value, valueType } = e.target;
      const typesAndNewValues: Record<InputValueTypes, typeof value> = {
         boolean: value === '' ? false : value,
         number: value,
         date: value,
         string: value,
         text: value,
         email: value,
         password: value,
      };
      setForm((prevState) => ({ ...prevState, [name]: typesAndNewValues[valueType] }));
   }

   return {
      form,
      setForm,
      errors,
      setErrors,
      handleChange,
      initHandleSubmit,
   };
}
