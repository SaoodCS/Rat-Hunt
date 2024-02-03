import FormHelper, { InputArray } from '../../../../global/helpers/react/form/FormHelper';

export interface INameFormClass {
   name: string;
   joinOrHost: 'join' | 'host';
   joinSessionId: string;
}

export default class NameFormClass {
   private static inputs: InputArray<INameFormClass> = [
      {
         name: 'name',
         id: 'user-name',
         placeholder: 'User Name',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter your name';
            if (value.length < 3) return 'Name must be at least 3 characters';
            return true;
         },
      },
      {
         name: 'joinOrHost',
         id: 'join-or-host',
         placeholder: 'Join or Host',
         type: 'select',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [
            { value: 'join', label: 'Join' },
            { value: 'host', label: 'Host' },
         ],
         validator: (value: string): string | true => {
            if (!value) return 'Please select join or host';
            if (!(value === 'join' || value === 'host')) return 'Please select join or host';
            return true;
         },
      },
      {
         name: 'joinSessionId',
         id: 'join-session-id',
         placeholder: 'Session Id',
         type: 'string',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter the session id';
            return true;
         },
      },
   ];

   private static initialState: INameFormClass = FormHelper.createInitialState<INameFormClass>(
      NameFormClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(NameFormClass.inputs);

   private static validate(formValues: INameFormClass): Record<keyof INameFormClass, string> {
      const formValidation = FormHelper.validation(formValues, NameFormClass.inputs);
      if (formValues.joinOrHost === 'host') formValidation.joinSessionId = '';
      return formValidation;
   }

   static form = {
      inputs: NameFormClass.inputs,
      initialState: NameFormClass.initialState,
      initialErrors: NameFormClass.initialErrors,
      validate: NameFormClass.validate,
   };
}
