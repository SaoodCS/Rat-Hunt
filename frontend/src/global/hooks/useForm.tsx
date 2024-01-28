import { useState } from 'react';
import useApiErrorContext from '../context/widget/apiError/hooks/useApiErrorContext';
import StringHelper from '../helpers/dataTypes/string/StringHelper';
import FormHelper from '../helpers/react/form/FormHelper';

export interface IDateChangeEvent {
   date: Date | null;
   name: string | number;
}

interface IUseFormReturn<T> {
   form: T;
   setForm: React.Dispatch<React.SetStateAction<T>>;
   errors: Record<keyof T, string>;
   setErrors: React.Dispatch<React.SetStateAction<Record<keyof T, string>>>;
   handleChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | IDateChangeEvent,
   ) => void;
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

   function handleChange(
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | IDateChangeEvent,
   ): void {
      if ('date' in e) {
         setForm((prevState) => ({ ...prevState, [e.name]: e.date }));
         return;
      }
      const isESelect = e.target instanceof HTMLSelectElement;
      const selectElIsNumber = isESelect && StringHelper.isNumber(e.target.value);
      const { name, value, type } = e.target;
      if (type === 'number' || selectElIsNumber) {
         setForm((prevState) => ({ ...prevState, [name]: value === '' ? '' : Number(value) }));
         return;
      }
      if (type === 'checkbox') {
         setForm((prevState) => ({ ...prevState, [name]: Boolean(value) }));
         return;
      }
      setForm((prevState) => ({ ...prevState, [name]: value }));
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

// Potential update:
//1 - rather than passing initialErrors as a prop, create initialErrors from initialState in the hook
// --- adv: less code to write in each form's class (DRY principle)
// --- disadv: less consistency as initialState and initialErrors won't both created in same place
// --- disadv2: as initialErrors would be create in a hook / react component, it would be re-calculated on every render (unless memoized)
//2 - rather than passing initialErrors and initialState, pass the inputs prop from the form's class and then create the initialErrors and initialState in the hook
// -- adv: less code to write in each form's class (DRY principle)
// --- disadv: less control over setting the initialState for an individual form
// --- disadv2: both initialState and initialErrors would be created in a hook / react component, so they would be re-calculated on every render (unless memoized)
