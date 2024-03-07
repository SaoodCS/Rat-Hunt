import type { InputArray } from '../../../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../../../global/helpers/react/form/FormHelper';

export interface IRatVoteFormClass {
   vote: string;
}

export default class RatVoteFormClass {
   private static inputs: InputArray<IRatVoteFormClass> = [
      {
         name: 'vote',
         id: 'select-vote',
         placeholder: 'Vote who you think the rat is',
         type: 'select',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select a player';
            return true;
         },
      },
   ];

   private static initialState: IRatVoteFormClass =
      FormHelper.createInitialState<IRatVoteFormClass>(RatVoteFormClass.inputs);

   private static initialErrors = FormHelper.createInitialErrors<IRatVoteFormClass>(
      RatVoteFormClass.inputs,
   );

   private static validate(formValues: IRatVoteFormClass): Record<keyof IRatVoteFormClass, string> {
      const validation = FormHelper.validation(formValues, RatVoteFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: RatVoteFormClass.inputs,
      initialState: RatVoteFormClass.initialState,
      initialErrors: RatVoteFormClass.initialErrors,
      validate: RatVoteFormClass.validate,
   };
}
