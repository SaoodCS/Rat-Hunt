import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext } from 'react';
import { TextBtn } from '../../../../../../../global/components/lib/button/textBtn/Style';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../global/hooks/useForm';
import FirestoreDB from '../../../../../class/FirestoreDb';
import { GameContext } from '../../../../../context/GameContext';
import { gameFormStyles } from '../style/Style';
import RatVoteFormClass from './class/RatVoteFormClass';

export default function RatVoteForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      RatVoteFormClass.form.initialState,
      RatVoteFormClass.form.initialErrors,
      RatVoteFormClass.form.validate,
   );
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const updateGameStateMutation = FirestoreDB.Room.updateGameStateMutation({}, false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState, users } = roomData;
      const { userStates, currentRat } = gameState;
      const userStatesWithoutThisUser = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
      const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', localDbUser);
      const updatedUserState: typeof userState = { ...userState, votedFor: form.vote };
      const updatedUserStates: (typeof userState)[] = [
         ...userStatesWithoutThisUser,
         updatedUserState,
      ];
      const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
      const disconnectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
         disconnectedUsers,
         'userId',
      );
      const updatedCurrentTurn = FirestoreDB.Room.getNextTurnUser(
         userStates,
         localDbUser,
         'ratVote',
         currentRat,
         disconnectedUsersIds,
      );

      const updatedGameState: typeof gameState = {
         ...gameState,
         currentTurn: updatedCurrentTurn,
         userStates: updatedUserStates,
      };
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
   }

   function dropDownOptions(
      input: (typeof RatVoteFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (!(input.name === 'vote' && MiscHelper.isNotFalsyOrEmpty(roomData))) return;
      const usersArr = roomData.users;
      const dropDownOptions: IDropDownOption[] = usersArr.map((user) => ({
         value: user.userId,
         label: user.userId,
      }));
      return ArrayOfObjects.sort(dropDownOptions, 'label');
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {RatVoteFormClass.form.inputs.map((input) => (
            <InputCombination
               key={input.id}
               id={input.id}
               placeholder={input.placeholder}
               name={input.name}
               isRequired={input.isRequired}
               autoComplete={input.autoComplete}
               handleChange={handleChange}
               error={errors[input.name]}
               type={input.type}
               value={form[input.name]}
               dropDownOptions={dropDownOptions(input)}
            />
         ))}

         <TextBtn isDarkTheme={isDarkTheme} type="submit">
            <Send size="1.5em" />
         </TextBtn>
      </StyledForm>
   );
}
