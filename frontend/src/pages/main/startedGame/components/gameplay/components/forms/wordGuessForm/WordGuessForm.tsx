import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext } from 'react';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';
import type { IDropDownOptions } from '../../../../../../../../global/components/lib/form/dropDown/dropDownInput';
import InputCombination from '../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../../../../../../global/components/lib/form/style/Style';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import Color from '../../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../global/utils/GameHelper/GameHelper';
import { gameFormStyles, gameInputFieldStyles } from '../style/Style';
import WordGuessFormClass from './class/WordGuessFormClass';

// TODO: Add boolean prop to dropdown input "submitOnChange" to submit form when dropdown value changes (which also then passes the handleSubmit func) -> then update the WordGuessForm and RatVoteForm accordingly

export default function WordGuessForm(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      WordGuessFormClass.form.initialState,
      WordGuessFormClass.form.initialErrors,
      WordGuessFormClass.form.validate,
   );
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, localDbUser, [
         { key: 'guess', value: form.guess },
      ]);
      const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
         { key: 'userStates', value: updatedUserStates },
         { key: 'currentTurn', value: '' },
      ]);
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: GameHelper.SetGameState.userPoints(updatedGameState),
      });
   }

   function dropDownOptions(
      input: (typeof WordGuessFormClass.form.inputs)[0],
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (input.name !== 'guess') return;
      const topicWords = ArrOfObj.getArrOfValuesFromKey(activeTopicWords, 'word');
      const options = topicWords.map((word) => ({ value: word, label: word }));
      return {
         ...input.dropDownOptions,
         options: ArrOfObj.sort(options, 'label'),
      };
   }

   return (
      <StyledForm
         onSubmit={handleSubmit}
         apiError={apiError}
         style={gameFormStyles}
         globalFieldStyles={gameInputFieldStyles}
      >
         {WordGuessFormClass.form.inputs.map((input) => (
            <InputCombination
               key={input.name}
               label={input.label}
               name={input.name}
               isRequired={input.isRequired}
               handleChange={handleChange}
               error={errors[input.name]}
               dropDownOptions={dropDownOptions(input)}
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
