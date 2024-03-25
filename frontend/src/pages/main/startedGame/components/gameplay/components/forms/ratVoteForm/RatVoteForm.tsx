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
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, localDbUser, [
         { key: 'votedFor', value: form.vote },
      ]);
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         gameState,
         localDbUser,
         'votedFor',
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

   function dropDownOptions(
      input: (typeof RatVoteFormClass.form.inputs)[0],
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (!(input.name === 'vote' && MiscHelper.isNotFalsyOrEmpty(roomData))) return;
      const usersArr = roomData.users;
      const options: IDropDownOptions['options'] = usersArr.map((user) => ({
         value: user.userId,
         label: user.userId,
      }));
      return {
         ...input.dropDownOptions,
         options: ArrOfObj.sort(options, 'label'),
      };
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {RatVoteFormClass.form.inputs.map((input) => (
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
               hideLabelOnFocus={input.hideLabelOnFocus}
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
