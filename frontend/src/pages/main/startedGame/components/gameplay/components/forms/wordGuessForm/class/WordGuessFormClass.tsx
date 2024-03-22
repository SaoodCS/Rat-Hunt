import { N_Form } from '../../../../../../../../../global/components/lib/form/N_Form';
import DropDownInput from '../../../../../../../../../global/components/lib/form/dropDown/DropDownInput';

export interface IWordGuessFormClass {
   guess: string;
}

export default class WordGuessFormClass {
   private static inputs: N_Form.Inputs.I.ArrOfInputObjects<IWordGuessFormClass> = [
      {
         Component: DropDownInput,
         name: 'guess',
         id: 'select-guess',
         placeholder: 'Select a word to guess',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select a word to guess';
            return true;
         },
      },
   ];

   private static initialState: IWordGuessFormClass =
      N_Form.Helper.createInitialState<IWordGuessFormClass>(WordGuessFormClass.inputs);

   private static initialErrors = N_Form.Helper.createInitialErrors<IWordGuessFormClass>(
      WordGuessFormClass.inputs,
   );

   private static validate(
      formValues: IWordGuessFormClass,
   ): Record<keyof IWordGuessFormClass, string> {
      const validation = N_Form.Helper.validation(formValues, WordGuessFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: WordGuessFormClass.inputs,
      initialState: WordGuessFormClass.initialState,
      initialErrors: WordGuessFormClass.initialErrors,
      validate: WordGuessFormClass.validate,
   };
}
