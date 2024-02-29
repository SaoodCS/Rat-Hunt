import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../global/hooks/useForm';
import FirestoreDB from '../../../../class/FirestoreDb';
import { GameContext } from '../../../../context/GameContext';
import WordGuessFormClass from './class/WordGuessFormClass';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';

export default function WordGuessForm(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      WordGuessFormClass.form.initialState,
      WordGuessFormClass.form.initialErrors,
      WordGuessFormClass.form.validate,
   );
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const { data: topicsData } = FirestoreDB.Topics.getTopicsQuery();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      // eslint-disable-next-line no-useless-return
      if (!isFormValid) return;
      // TODO: API to submit word guess here
   }

   function dropDownOptions(
      input: (typeof WordGuessFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      const inputIsGuess = input.name === 'guess';
      const topicsDataExists = MiscHelper.isNotFalsyOrEmpty(topicsData);
      const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
      if (!(inputIsGuess && topicsDataExists && roomDataExists)) return;
      const currentTopic = roomData.gameState.activeTopic;
      const currentTopicItems = ArrayOfObjects.filterIn(topicsData, 'key', currentTopic)[0].values;
      return currentTopicItems.map((item) => ({ value: item, label: item }));
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
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

         <StaticButton isDarkTheme={isDarkTheme} type="submit">
            Submit
         </StaticButton>
      </StyledForm>
   );
}
