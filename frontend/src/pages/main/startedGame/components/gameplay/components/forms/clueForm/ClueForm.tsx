import { Send } from '@styled-icons/ionicons-sharp/Send';
import { Fragment, useContext } from 'react';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';
import { StyledForm } from '../../../../../../../../global/components/lib/form/form/Style';
import {
   ErrorLabel,
   TextInputAlt,
} from '../../../../../../../../global/components/lib/form/input/Style';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../../../../global/css/colors';
import ArrayHelper from '../../../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../global/utils/GameHelper/GameHelper';
import { gameFormStyles } from '../style/Style';
import ClueFormClass from './class/ClueFormClass';

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
      if (ArrayHelper.toUpperCase(submittedClues).includes(userClue.toUpperCase())) {
         setErrors((prev) => ({ ...prev, clue: 'Another user has already submitted this clue.' }));
         return;
      }
      setErrors((prev) => ({ ...prev, clue: '' }));
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, localDbUser, [
         { key: 'clue', value: userClue },
      ]);
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         userStates,
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
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {ClueFormClass.form.inputs.map((input) => (
            <Fragment key={input.id}>
               <TextInputAlt
                  id={input.id}
                  placeholder={input.placeholder}
                  name={input.name}
                  isRequired={input.isRequired}
                  isDisabled={false}
                  autoComplete={input.autoComplete}
                  onChange={handleChange}
                  type={input.type}
                  value={form[input.name]}
                  hasError={!!errors[input.name]}
                  style={{}}
               />
               <ErrorLabel isDarkTheme={isDarkTheme} style={{ position: 'absolute', bottom: 0 }}>
                  {errors[input.name]}
               </ErrorLabel>
            </Fragment>
         ))}

         <TextBtn isDarkTheme={isDarkTheme} type="submit">
            <Send size="1.5em" color={Color.darkThm.warning} />
         </TextBtn>
      </StyledForm>
   );
}
