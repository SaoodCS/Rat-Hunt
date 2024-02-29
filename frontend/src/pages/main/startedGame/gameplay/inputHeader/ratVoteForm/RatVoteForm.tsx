import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../global/hooks/useForm';
import FirestoreDB from '../../../../class/FirestoreDb';
import RatVoteFormClass from './class/RatVoteFormClass';
import { GameContext } from '../../../../context/GameContext';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';

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
   const updateGameStateMutation = FirestoreDB.Room.updateGameStateMutation({});

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const userStates = gameState.userStates;
      const userStatesWithoutThisUser = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
      const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', localDbUser);
      const updatedUserState: typeof userState = { ...userState, votedFor: form.vote };
      const updatedUserStates: (typeof userState)[] = [
         ...userStatesWithoutThisUser,
         updatedUserState,
      ];
      const finalVoteSubmission = ArrayOfObjects.isKeyInAllObjsNotValuedAs(
         userStatesWithoutThisUser,
         'votedFor',
         '',
      );
      const ratUser = gameState.currentRat;
      const thisUserIndex = gameState.userStates.findIndex(
         (userState) => userState.userId === localDbUser,
      );
      const nextUser = gameState.userStates[thisUserIndex + 1]?.userId || ratUser;
      const updatedCurrentTurn = finalVoteSubmission ? ratUser : nextUser;
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
      return dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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

         <StaticButton isDarkTheme={isDarkTheme} type="submit">
            Submit
         </StaticButton>
      </StyledForm>
   );
}
