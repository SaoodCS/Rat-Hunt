import { useContext } from 'react';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../global/hooks/useForm';
import FirestoreDB from '../../../../class/FirestoreDb';
import { GameContext } from '../../../../context/GameContext';
import ClueFormClass from './class/ClueFormClass';
import { TextBtn } from '../../../../../../global/components/lib/button/textBtn/Style';
import { Send } from '@styled-icons/ionicons-sharp/Send';
import { gameFormStyles } from '../style/Style';

export default function ClueForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError, setApiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ClueFormClass.form.initialState,
      ClueFormClass.form.initialErrors,
      ClueFormClass.form.validate,
   );
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const updateGameStateMutation = FirestoreDB.Room.updateGameStateMutation({});

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const userClue = form.clue;
      const { gameState } = roomData;
      const { userStates } = gameState;
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
      const finalClueSubmission = ArrayOfObjects.isKeyInAllObjsNotValuedAs(
         userStatesWithoutThisUser,
         'clue',
         '',
      );
      const sortedUserStates = ArrayOfObjects.sort(userStates, 'userId');
      const firstUser = sortedUserStates[0].userId;
      const thisUserIndex = sortedUserStates.findIndex((u) => u.userId === localDbUser);
      const nextUser = sortedUserStates[thisUserIndex + 1]?.userId || firstUser;
      const updatedCurrentTurn = finalClueSubmission ? firstUser : nextUser;
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
