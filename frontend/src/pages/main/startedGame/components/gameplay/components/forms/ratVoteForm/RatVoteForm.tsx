import { useContext, useEffect } from 'react';
import { N_Form } from '../../../../../../../../global/components/lib/form/N_Form';
import type { IDropDownOptions } from '../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import InputCombination from '../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../../../../../../global/components/lib/form/style/Style';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import DBConnect from '../../../../../../../../global/database/DBConnect/DBConnect';
import useForm from '../../../../../../../../global/hooks/useForm';
import { gameFormStyles, gameInputWrapperStyles } from '../style/Style';
import RatVoteFormClass from './class/RatVoteFormClass';
import MiscHelper from '../../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import ObjectHelper from '../../../../../../../../../../shared/lib/helpers/objectHelper/ObjectHelper';
import ArrOfObj from '../../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import GameHelper from '../../../../../../../../../../shared/app/GameHelper/GameHelper';
import DateHelper from '../../../../../../../../../../shared/lib/helpers/date/DateHelper';
import axios from 'axios';

export default function RatVoteForm(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { apiError } = useApiErrorContext();
   const { form, setErrors, errors, handleChange, initHandleSubmit } = useForm(
      RatVoteFormClass.form.initialState,
      RatVoteFormClass.form.initialErrors,
      RatVoteFormClass.form.validate,
   );
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   async function submitOnChange(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, localDbUser, [
         { key: 'votedFor', value: form.vote },
      ]);
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(gameState);

      const currentTime = await DateHelper.getCurrentTime(axios);
      const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
         { key: 'currentTurn', value: updatedCurrentTurn },
         { key: 'currentTurnChangedAt', value: currentTime },
         { key: 'userStates', value: updatedUserStates },
      ]);
      await updateGameStateMutation.mutateAsync({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
   }

   useEffect(() => {
      if (ObjectHelper.allPropValsEmpty(form)) return;
      const validationErrors = RatVoteFormClass.form.validate(form);
      if (N_Form.Helper.hasErrors(validationErrors)) {
         setErrors(validationErrors);
         return;
      }
      submitOnChange().catch((error) => {
         setErrors({ vote: error.message });
      });
   }, [form.vote]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await submitOnChange();
   }

   function dropDownOptions(
      input: (typeof RatVoteFormClass.form.inputs)[0],
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (!(input.name === 'vote' && MiscHelper.isNotFalsyOrEmpty(roomData))) return;
      const usersArr = roomData.gameState.userStates;
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
      <StyledForm
         onSubmit={handleSubmit}
         apiError={apiError}
         style={gameFormStyles}
         inputWrapperStyles={gameInputWrapperStyles}
      >
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
               capitalize={input.capitalize}
               isDisabled={input.isDisabled}
               numberLineOptions={input.numberLineOptions}
               Component={input.Component}
            />
         ))}
      </StyledForm>
   );
}
