import { Send } from '@styled-icons/ionicons-sharp/Send';
import { Fragment, useContext, useState } from 'react';
import { gameFormStyles } from '../style/Style';
import WordGuessFormClass from './class/WordGuessFormClass';
import { GameContext } from '../../../../../../../../global/context/game/GameContext';
import useThemeContext from '../../../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../global/utils/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import GameHelper from '../../../../../../../../global/utils/GameHelper/GameHelper';
import type { IDropDownOption } from '../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../../global/components/lib/form/form/Style';
import { TextBtn } from '../../../../../../../../global/components/lib/button/textBtn/Style';
import ArrOfObj from '../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import {
   DropDownArrowAlt,
   StyledOption,
   StyledSelectAlt,
} from '../../../../../../../../global/components/lib/form/dropDown/Style';
import { ErrorLabel } from '../../../../../../../../global/components/lib/form/input/Style';
import Color from '../../../../../../../../global/css/colors';

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
   const [isActive, setIsActive] = useState(false);

   function handleFocus(): void {
      setIsActive(true);
   }

   function handleBlur(): void {
      setIsActive(false);
   }

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
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (input.name !== 'guess') return;
      const topicWords = ArrOfObj.getArrOfValuesFromKey(activeTopicWords, 'word');
      const dropDownOptions = topicWords.map((word) => ({ value: word, label: word }));
      return ArrOfObj.sort(dropDownOptions, 'label');
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} style={gameFormStyles}>
         {WordGuessFormClass.form.inputs.map((input) => (
            <Fragment key={input.id}>
               <DropDownArrowAlt darktheme={'false'} focusedinput={isActive.toString()} />
               <StyledSelectAlt
                  id={input.id}
                  name={input.name}
                  isRequired={input.isRequired}
                  autoComplete={input.autoComplete}
                  onChange={handleChange}
                  isDarkTheme
                  isDisabled={false}
                  hasError={!!errors[input.name]}
                  value={form[input.name]}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
               >
                  <StyledOption
                     isDarkTheme={isDarkTheme}
                     value=""
                     hidden={input.isRequired || false}
                     label={input.placeholder}
                  />
                  {dropDownOptions(input)?.map((option) => (
                     <StyledOption
                        isDarkTheme={isDarkTheme}
                        value={option.value}
                        key={option.value}
                     >
                        {option.label}
                     </StyledOption>
                  ))}
               </StyledSelectAlt>
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
