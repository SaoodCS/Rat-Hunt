import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import GameHelper from '../../../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../../../shared/app/types/AppTypes';
import StringHelper from '../../../../../../shared/lib/helpers/string/StringHelper';
import { N_Form } from '../../../../global/components/lib/form/N_Form';
import DropDownInput from '../../../../global/components/lib/form/dropDown/DropDownInput';
import NumberLineInput from '../../../../global/components/lib/form/numberLine/NumberLineInp';
import TextOrNumFieldInput from '../../../../global/components/lib/form/textOrNumber/TextOrNumFieldInput';

export interface IPlayFormClass {
   name: string;
   joinOrHost: 'join' | 'host';
   roomId: string;
   topic: string;
   noOfRounds: number;
}

export default class PlayFormClass {
   private static inputs: N_Form.Inputs.I.ArrOfInputObjects<IPlayFormClass> = [
      {
         Component: TextOrNumFieldInput,
         name: 'name',
         id: 'user-name',
         label: 'Username',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         capitalize: 'characters',
         validator: (value: string): string | true => {
            if (!value) return 'Please enter your name';
            if (value.trim() === '') return 'Name cannot be empty';
            if (value.length < 2) return 'Name must be at least 2 characters';
            const invalidChars = ['.', '#', '$', '[', ']'];
            if (StringHelper.containsOneOf(value, invalidChars)) {
               return 'Name cannot contain: ".", "#", "$", "[", or "]"';
            }
            return true;
         },
      },
      {
         Component: DropDownInput,
         name: 'joinOrHost',
         id: 'join-or-host',
         label: 'Join or Host',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         dropDownOptions: {
            options: [
               { value: 'join', label: 'Join' },
               { value: 'host', label: 'Host' },
            ],
         },
         validator: (value: string): string | true => {
            if (!value) return 'Please select join or host';
            if (!(value === 'join' || value === 'host')) return 'Please select join or host';
            return true;
         },
      },
      {
         Component: TextOrNumFieldInput,
         name: 'roomId',
         id: 'join-room-id',
         label: 'Room Id',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         // This autofills the input when receiving a msg with the "code" keyword
         autoComplete: 'one-time-code',
         capitalize: 'characters',
         validator: (value: string): string | true => {
            if (!value) return 'Please enter the room id';
            return true;
         },
      },
      {
         Component: DropDownInput,
         name: 'topic',
         id: 'select-topic',
         label: 'Select Topic',
         type: 'text',
         isRequired: true,
         isDisabled: false,
         dropDownOptions: {
            options: [],
            menu: {
               maxHeight: 150,
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
         label: 'Rounds',
         type: 'number',
         numberLineOptions: {
            min: 1,
            max: 10,
            increment: 1,
         },
         isRequired: true,
         isDisabled: false,
         validator: (value: number): string | true => {
            if (typeof value !== 'number') return 'Please enter the number of rounds';
            if (value < 1) return 'Number of rounds must be at least 1';
            if (value > 10) return 'Number of rounds must be at most 10';
            return true;
         },
      },
   ];

   private static initialState: IPlayFormClass = N_Form.Helper.createInitialState<IPlayFormClass>(
      PlayFormClass.inputs,
   );

   private static initialErrors = N_Form.Helper.createInitialErrors(PlayFormClass.inputs);

   private static validate(formValues: IPlayFormClass): Record<keyof IPlayFormClass, string> {
      const formValidation = N_Form.Helper.validation(formValues, PlayFormClass.inputs);
      if (formValues.joinOrHost === 'host') formValidation.roomId = '';
      if (formValues.joinOrHost === 'join') {
         formValidation.topic = '';
         formValidation.noOfRounds = '';
      }
      return formValidation;
   }

   private static validateJoin(
      roomDocSnap: DocumentSnapshot<DocumentData, DocumentData>,
      form: IPlayFormClass,
   ): Partial<Record<keyof IPlayFormClass, string>> {
      if (!roomDocSnap.exists()) {
         return { roomId: 'Room does not exist' };
      }
      const roomData = roomDocSnap.data() as AppTypes.Room;
      const usernameTaken = roomData.gameState.userStates.some(
         (user) => user.userId.trim() === form.name.trim(),
      );
      if (usernameTaken) {
         return { name: 'Username already taken' };
      }
      const roomIsFull =
         roomData.gameState.userStates.length >= GameHelper.CONSTANTS.MAX_PLAYERS_IN_ROOM;
      if (roomIsFull) {
         return { roomId: 'Room is full' };
      }
      return {};
   }

   static form = {
      inputs: PlayFormClass.inputs,
      initialState: PlayFormClass.initialState,
      initialErrors: PlayFormClass.initialErrors,
      validate: PlayFormClass.validate,
      validateJoin: PlayFormClass.validateJoin,
   };
}
