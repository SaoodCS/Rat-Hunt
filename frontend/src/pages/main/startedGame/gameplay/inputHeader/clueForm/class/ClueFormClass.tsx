import type { InputArray } from '../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../global/helpers/react/form/FormHelper';

export interface IClueFormClass {
   clue: string;
}

export default class ClueFormClass {
   private static inputs: InputArray<IClueFormClass> = [
      {
         name: 'clue',
         id: 'clue',
         placeholder: 'Please enter a clue',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter a clue';
            if (value.length < 3) return 'clue must be at least 3 character';
            return true;
         },
      },
   ];

   private static initialState: IClueFormClass = FormHelper.createInitialState<IClueFormClass>(
      ClueFormClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors<IClueFormClass>(
      ClueFormClass.inputs,
   );

   private static validate(formValues: IClueFormClass): Record<keyof IClueFormClass, string> {
      const validation = FormHelper.validation(formValues, ClueFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: ClueFormClass.inputs,
      initialState: ClueFormClass.initialState,
      initialErrors: ClueFormClass.initialErrors,
      validate: ClueFormClass.validate,
   };
}
