import type { InputArray } from '../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../global/helpers/react/form/FormHelper';

export interface IPlayFormClass {
   name: string;
   joinOrHost: 'join' | 'host';
   roomId: string;
   topic: string;
}

export default class PlayFormClass {
   private static inputs: InputArray<IPlayFormClass> = [
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
         name: 'roomId',
         id: 'join-room-id',
         placeholder: 'Room Id',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter the room id';
            return true;
         },
      },
      {
         name: 'topic',
         id: 'select-topic',
         placeholder: 'Select Topic',
         type: 'select',
         isRequired: true,
         isDropDown: true,
         dropDownOptions: [],
         validator: (value: string): string | true => {
            if (!value) return 'Please select a topic';
            return true;
         },
      },
   ];

   private static initialState: IPlayFormClass = FormHelper.createInitialState<IPlayFormClass>(
      PlayFormClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(PlayFormClass.inputs);

   private static validate(formValues: IPlayFormClass): Record<keyof IPlayFormClass, string> {
      const formValidation = FormHelper.validation(formValues, PlayFormClass.inputs);
      if (formValues.joinOrHost === 'host') formValidation.roomId = '';
      if (formValues.joinOrHost === 'join') formValidation.topic = '';
      return formValidation;
   }

   static form = {
      inputs: PlayFormClass.inputs,
      initialState: PlayFormClass.initialState,
      initialErrors: PlayFormClass.initialErrors,
      validate: PlayFormClass.validate,
   };
}
