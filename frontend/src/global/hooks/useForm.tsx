import { useState } from 'react';
import { N_Form } from '../components/lib/form/N_Form';
import useApiErrorContext from '../context/widget/apiError/hooks/useApiErrorContext';

interface IUseFormReturn<T> {
   form: T;
   setForm: React.Dispatch<React.SetStateAction<T>>;
   errors: Record<keyof T, string>;
   setErrors: React.Dispatch<React.SetStateAction<Record<keyof T, string>>>;
   handleChange: N_Form.Inputs.I.HandleChange;
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
      if (N_Form.Helper.hasErrors(validationErrors)) {
         setErrors(validationErrors);
         return { isFormValid: false };
      }
      return { isFormValid: true };
   }

   function handleChange(e: Parameters<N_Form.Inputs.I.HandleChange>[0]): void {
      const { name, value, valueType } = e.target;
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
