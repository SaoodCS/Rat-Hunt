import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext } from 'react';
import { gameFormStyles } from '../style/Style';
import ClueFormClass from './class/ClueFormClass';
import useThemeContext from '../../../../../../../../global/context/theme/hooks/useThemeContext';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../global/utils/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import GameHelper from '../../../../../../../../global/utils/GameHelper/GameHelper';
import { StyledForm } from '../../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';

export default function ClueForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError, setApiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ClueFormClass.form.initialState,
      ClueFormClass.form.initialErrors,
      ClueFormClass.form.validate,
   );
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const userClue = form.clue;
      const { gameState, users } = roomData;
      const { userStates, currentRat } = gameState;
      const submittedClues = ArrayOfObjects.getArrOfValuesFromKey(userStates, 'clue');
      if (submittedClues.includes(userClue)) {
         setApiError('Another user has already submitted this clue.');
         return;
      }
      setApiError('');
      const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', localDbUser);
      const userStatesWithoutThisUser = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
      const updatedUserState: typeof userState = { ...userState, clue: userClue };
      const updatedUserStates: (typeof userState)[] = [
         ...userStatesWithoutThisUser,
         updatedUserState,
      ];
      const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
      const disconnectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
         disconnectedUsers,
         'userId',
      );
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         userStates,
         localDbUser,
         'clue',
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

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {ClueFormClass.form.inputs.map((input) => (
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
            />
         ))}

         <TextBtn isDarkTheme={isDarkTheme} type="submit">
            <Send size="1.5em" />
         </TextBtn>
      </StyledForm>
   );
}
