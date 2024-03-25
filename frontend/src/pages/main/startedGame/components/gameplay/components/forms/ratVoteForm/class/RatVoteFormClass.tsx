import { N_Form } from '../../../../../../../../../global/components/lib/form/N_Form';
import DropDownInput from '../../../../../../../../../global/components/lib/form/dropDown/dropDownInput';

export interface IRatVoteFormClass {
   vote: string;
}

export default class RatVoteFormClass {
   private static inputs: N_Form.Inputs.I.ArrOfInputObjects<IRatVoteFormClass> = [
      {
         Component: DropDownInput,
         name: 'vote',
         id: 'select-vote',
         label: 'Vote who you think the rat is',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         dropDownOptions: {
            options: [],
         },
         validator: (value: string): string | true => {
            if (!value) return 'Please select a player';
            return true;
         },
      },
   ];

   private static initialState: IRatVoteFormClass =
      N_Form.Helper.createInitialState<IRatVoteFormClass>(RatVoteFormClass.inputs);

   private static initialErrors = N_Form.Helper.createInitialErrors<IRatVoteFormClass>(
      RatVoteFormClass.inputs,
   );

   private static validate(formValues: IRatVoteFormClass): Record<keyof IRatVoteFormClass, string> {
      const validation = N_Form.Helper.validation(formValues, RatVoteFormClass.inputs);
      return validation;
   }

   static form = {
      inputs: RatVoteFormClass.inputs,
      initialState: RatVoteFormClass.initialState,
      initialErrors: RatVoteFormClass.initialErrors,
      validate: RatVoteFormClass.validate,
   };
}
