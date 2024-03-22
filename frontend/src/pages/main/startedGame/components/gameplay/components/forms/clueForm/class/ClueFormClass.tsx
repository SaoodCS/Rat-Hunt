import { N_Form } from '../../../../../../../../../global/components/lib/form/N_Form';
import TextOrNumFieldInput from '../../../../../../../../../global/components/lib/form/textOrNumber/TextOrNumFieldInput';

export interface IClueFormClass {
   clue: string;
}

export default class ClueFormClass {
   private static inputs: N_Form.Inputs.I.InputArray<IClueFormClass> = [
      {
         Component: TextOrNumFieldInput,
         name: 'clue',
         id: 'clue',
         placeholder: 'Please enter a clue',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter a clue';
            if (value.length < 1) return 'Clue must be at least 1 character';
            // if (value.length > 10) return 'Clue must be at most 10 characters';
            if (value.trim() === '') return 'Clue cannot be empty';
            if (value.trim().split(' ').length > 1) return 'Clue cannot be more than one word';
            return true;
         },
      },
   ];

   private static initialState: IClueFormClass = N_Form.Helper.createInitialState<IClueFormClass>(
      ClueFormClass.inputs,
   );

   private static initialErrors = N_Form.Helper.createInitialErrors<IClueFormClass>(
      ClueFormClass.inputs,
   );

   private static validate(formValues: IClueFormClass): Record<keyof IClueFormClass, string> {
      const validation = N_Form.Helper.validation(formValues, ClueFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: ClueFormClass.inputs,
      initialState: ClueFormClass.initialState,
      initialErrors: ClueFormClass.initialErrors,
      validate: ClueFormClass.validate,
   };
}
