import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext } from 'react';
import { TextBtn } from '../../../../../../../global/components/lib/button/textBtn/Style';
import type { IDropDownOption } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../utils/GameHelper/GameHelper';
import { gameFormStyles } from '../style/Style';
import WordGuessFormClass from './class/WordGuessFormClass';

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
      // eslint-disable-next-line no-useless-return
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const userStatesWithoutThisUser = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
      const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', localDbUser);
      const updatedUserState: typeof userState = { ...userState, guess: form.guess };
      const updatedUserStates: (typeof userState)[] = [
         ...userStatesWithoutThisUser,
         updatedUserState,
      ];
      const updatedCurrentTurn = '';
      const updatedGameState: typeof gameState = {
         ...gameState,
         currentTurn: updatedCurrentTurn,
         userStates: updatedUserStates,
      };
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: GameHelper.SetGameState.userPoints(updatedGameState),
      });
   }

   function dropDownOptions(
      input: (typeof WordGuessFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (input.name !== 'guess') return;
      const topicWords = ArrayOfObjects.getArrOfValuesFromKey(activeTopicWords, 'word');
      const dropDownOptions = topicWords.map((word) => ({ value: word, label: word }));
      return ArrayOfObjects.sort(dropDownOptions, 'label');
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {WordGuessFormClass.form.inputs.map((input) => (
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
