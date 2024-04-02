import { useContext, useEffect } from 'react';
import { N_Form } from '../../../../../../../../global/components/lib/form/N_Form';
import type { IDropDownOptions } from '../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import InputCombination from '../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../../../../../../global/components/lib/form/style/Style';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import DBConnect from '../../../../../../../../global/database/DBConnect/DBConnect';
import useForm from '../../../../../../../../global/hooks/useForm';
import { gameFormStyles, gameInputFieldStyles } from '../style/Style';
import WordGuessFormClass from './class/WordGuessFormClass';
import ArrOfObj from '../../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import ObjectHelper from '../../../../../../../../../../shared/lib/helpers/objectHelper/ObjectHelper';
import GameHelper from '../../../../../../../../../../shared/app/GameHelper/GameHelper';

export default function WordGuessForm(): JSX.Element {
   const { localDbRoom, localDbUser, activeTopicWords } = useContext(GameContext);
   const { apiError } = useApiErrorContext();
   const { form, errors, setErrors, handleChange, initHandleSubmit } = useForm(
      WordGuessFormClass.form.initialState,
      WordGuessFormClass.form.initialErrors,
      WordGuessFormClass.form.validate,
   );
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   async function submitOnChange(): Promise<void> {
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

   useEffect(() => {
      if (ObjectHelper.allPropValsEmpty(form)) return;
      const validationErrors = WordGuessFormClass.form.validate(form);
      if (N_Form.Helper.hasErrors(validationErrors)) {
         setErrors(validationErrors);
         return;
      }
      submitOnChange().catch((error) => {
         setErrors({ guess: error.message });
      });
   }, [form.guess]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      await submitOnChange();
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
      </StyledForm>
   );
}
