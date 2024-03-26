import { N_Form } from '../../../../../../../../../../global/components/lib/form/N_Form';
import DropDownInput from '../../../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import NumberLineInput from '../../../../../../../../../../global/components/lib/form/numberLine/NumberLineInp';

export interface IRoundEndForm {
   newTopic: string;
   noOfRounds: number;
}

export default class RoundEndFormClass {
   private static inputs: N_Form.Inputs.I.ArrOfInputObjects<IRoundEndForm> = [
      {
         Component: DropDownInput,
         name: 'newTopic',
         id: 'select-newTopic',
         label: 'Select a Topic',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         dropDownOptions: {
            options: [],
            menu: {
               maxHeight: 200,
               placement: 'bottom',
            },
         },
         validator: (value: string): string | true => {
            if (!value) return 'Please select a topic';
            return true;
         },
      },

      {
         Component: NumberLineInput,
         name: 'noOfRounds',
         id: 'no-of-rounds',
         label: 'Number of Rounds',
         type: 'number',
         isRequired: true,
         isDisabled: false,
         numberLineOptions: {
            min: 1,
            max: 10,
            increment: 1,
         },
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Please enter the number of rounds';
            if (value < 1) return 'Number of rounds must be at least 1';
            if (value > 10) return 'Number of rounds must be at most 10';
            return true;
         },
      },
   ];

   private static initialState: IRoundEndForm = N_Form.Helper.createInitialState<IRoundEndForm>(
      RoundEndFormClass.inputs,
   );

   private static initialErrors = N_Form.Helper.createInitialErrors(RoundEndFormClass.inputs);

   private static validate(
      isLastRound: boolean,
   ): (formValues: IRoundEndForm) => Record<keyof IRoundEndForm, string> {
      return (formValues: IRoundEndForm): Record<keyof IRoundEndForm, string> => {
         const formValidation = N_Form.Helper.validation(formValues, RoundEndFormClass.inputs);
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
