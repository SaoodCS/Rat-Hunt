import StringHelper from '../../../../global/helpers/dataTypes/string/StringHelper';
import type { InputArray } from '../../../../global/helpers/react/form/FormHelper';
import FormHelper from '../../../../global/helpers/react/form/FormHelper';

export interface IPlayFormClass {
   name: string;
   joinOrHost: 'join' | 'host';
   roomId: string;
   topic: string;
   noOfRounds: number;
}

export default class PlayFormClass {
   private static inputs: InputArray<IPlayFormClass> = [
      {
         name: 'name',
         id: 'user-name',
         placeholder: 'Username',
         type: 'text',
         isRequired: true,
         validator: (value: string): string | true => {
            if (!value) return 'Please enter your name';
            if (value.trim() === '') return 'Name cannot be empty';
            if (value.length < 2) return 'Name must be at least 1 characters';
            // names cannot contain: ".", "#", "$", "[", or "]":
            const invalidChars = ['.', '#', '$', '[', ']'];
            if (StringHelper.containsOneOf(value, invalidChars)) {
               return 'Name cannot contain: ".", "#", "$", "[", or "]"';
            }
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

   private static initialState: IPlayFormClass = FormHelper.createInitialState<IPlayFormClass>(
      PlayFormClass.inputs,
   );

   private static initialErrors = FormHelper.createInitialErrors(PlayFormClass.inputs);

   private static validate(formValues: IPlayFormClass): Record<keyof IPlayFormClass, string> {
      const formValidation = FormHelper.validation(formValues, PlayFormClass.inputs);
      if (formValues.joinOrHost === 'host') formValidation.roomId = '';
      if (formValues.joinOrHost === 'join') {
         formValidation.topic = '';
         formValidation.noOfRounds = '';
      }
      return formValidation;
   }

   static form = {
      inputs: PlayFormClass.inputs,
      initialState: PlayFormClass.initialState,
      initialErrors: PlayFormClass.initialErrors,
      validate: PlayFormClass.validate,
   };
}
