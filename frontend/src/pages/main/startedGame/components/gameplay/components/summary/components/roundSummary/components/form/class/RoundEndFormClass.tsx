import type { InputArray } from '../../../../../../../../../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../../../../../../../../../global/helpers/react/form/FormHelper';

export interface IRoundEndForm {
   newTopic: string;
   noOfRounds: number;
}

export default class RoundEndFormClass {
   private static inputs: InputArray<IRoundEndForm> = [
      {
         name: 'newTopic',
         id: 'select-newTopic',
         placeholder: 'Select a Topic',
         type: 'select',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select a topic';
            return true;
         },
      },

      {
         name: 'noOfRounds',
         id: 'no-of-rounds',
         placeholder: 'Number of Rounds',
         type: 'number',
         isRequired: true,
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Please enter the number of rounds';
            if (value < 1) return 'Number of rounds must be at least 1';
            if (value > 10) return 'Number of rounds must be at most 10';
            return true;
         },
      },
   ];

   private static initialState: IRoundEndForm = FormHelper.createInitialState<IRoundEndForm>(
      RoundEndFormClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(RoundEndFormClass.inputs);

   private static validate(
      isLastRound: boolean,
   ): (formValues: IRoundEndForm) => Record<keyof IRoundEndForm, string> {
      return (formValues: IRoundEndForm): Record<keyof IRoundEndForm, string> => {
         const formValidation = FormHelper.validation(formValues, RoundEndFormClass.inputs);
         if (!isLastRound) formValidation.noOfRounds = '';
         return formValidation;
      };
   }

   static form = {
      inputs: RoundEndFormClass.inputs,
      initialState: RoundEndFormClass.initialState,
      initialErrors: RoundEndFormClass.initialErrors,
      validate: RoundEndFormClass.validate,
   };
}
