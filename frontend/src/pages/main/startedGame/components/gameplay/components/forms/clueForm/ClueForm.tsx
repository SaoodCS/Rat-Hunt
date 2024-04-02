import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext } from 'react';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';
import InputCombination from '../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../../../../../../global/components/lib/form/style/Style';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../../../../global/css/colors';
import DBConnect from '../../../../../../../../global/database/DBConnect/DBConnect';
import useForm from '../../../../../../../../global/hooks/useForm';
import { gameFormStyles, gameInputFieldStyles } from '../style/Style';
import ClueFormClass from './class/ClueFormClass';
import MiscHelper from '../../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import ArrayHelper from '../../../../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import GameHelper from '../../../../../../../../../../shared/app/GameHelper/GameHelper';

export default function ClueForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit, setErrors } = useForm(
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
      const userClue = form.clue.trim();
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const submittedClues = ArrOfObj.getArrOfValuesFromKey(userStates, 'clue');
      if (ArrayHelper.toCapitalize(submittedClues).includes(userClue.toUpperCase())) {
         setErrors((prev) => ({ ...prev, clue: 'Another user has already submitted this clue.' }));
         return;
      }
      setErrors((prev) => ({ ...prev, clue: '' }));
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, localDbUser, [
         { key: 'clue', value: userClue },
      ]);
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         gameState,
         localDbUser,
         'clue',
         currentRat,
      );
      const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
         { key: 'currentTurn', value: updatedCurrentTurn },
         { key: 'userStates', value: updatedUserStates },
      ]);
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
   }

   return (
      <StyledForm
         onSubmit={handleSubmit}
         apiError={apiError}
         style={gameFormStyles}
         globalFieldStyles={gameInputFieldStyles}
      >
         {ClueFormClass.form.inputs.map((input) => (
            <InputCombination
               key={input.name}
               label={input.label}
               name={input.name}
               isRequired={input.isRequired}
               handleChange={handleChange}
               error={errors[input.name]}
               dropDownOptions={input.dropDownOptions}
               id={input.id}
               type={input.type}
               value={form[input.name]}
               autoComplete={input.autoComplete}
               isDisabled={input.isDisabled}
               numberLineOptions={input.numberLineOptions}
               Component={input.Component}
            />
         ))}

         <TextBtn isDarkTheme={isDarkTheme} type="submit">
            <Send size="1.5em" color={Color.darkThm.warning} />
         </TextBtn>
      </StyledForm>
   );
}
