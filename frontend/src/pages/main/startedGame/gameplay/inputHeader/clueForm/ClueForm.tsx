import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
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
      const userStates = roomData.gameState.userStates;
      const submittedClues = ArrayOfObjects.getArrOfValuesFromKey(userStates, 'clue');
      if (submittedClues.includes(userClue)) {
         setApiError('Another user has already submitted this clue.');
         return;
      }
      setApiError('');
      const { gameState } = roomData;
      const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', localDbUser);
      const userStatesWithoutThisUser = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
      const updatedUserState: typeof userState = { ...userState, clue: userClue };
      const updatedUserStates: (typeof userState)[] = [
         ...userStatesWithoutThisUser,
         updatedUserState,
      ];
      const updatedGameState: typeof gameState = { ...gameState, userStates: updatedUserStates };
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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

         <StaticButton isDarkTheme={isDarkTheme} type="submit">
            Submit
         </StaticButton>
      </StyledForm>
   );
}
