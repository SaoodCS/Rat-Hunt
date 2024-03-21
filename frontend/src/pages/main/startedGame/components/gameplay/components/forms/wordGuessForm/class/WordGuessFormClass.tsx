import DropDownInput from '../../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import type { InputArray } from '../../../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../../../global/helpers/react/form/FormHelper';

export interface IWordGuessFormClass {
   guess: string;
}

export default class WordGuessFormClass {
   private static inputs: InputArray<IWordGuessFormClass> = [
      {
         Component: DropDownInput,
         name: 'guess',
         id: 'select-guess',
         placeholder: 'Select a word to guess',
         type: 'text',
         isRequired: true,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select a word to guess';
            return true;
         },
      },
   ];

   private static initialState: IWordGuessFormClass =
      FormHelper.createInitialState<IWordGuessFormClass>(WordGuessFormClass.inputs);

   private static initialErrors = FormHelper.createInitialErrors<IWordGuessFormClass>(
      WordGuessFormClass.inputs,
   );

   private static validate(
      formValues: IWordGuessFormClass,
   ): Record<keyof IWordGuessFormClass, string> {
      const validation = FormHelper.validation(formValues, WordGuessFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: WordGuessFormClass.inputs,
      initialState: WordGuessFormClass.initialState,
      initialErrors: WordGuessFormClass.initialErrors,
      validate: WordGuessFormClass.validate,
   };
}
