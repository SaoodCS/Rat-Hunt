import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../global/hooks/useForm';
import { GameContext } from '../../../../context/GameContext';
import ClueFormClass from './class/ClueFormClass';
import FirestoreDB from '../../../../class/FirestoreDb';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';

export default function ClueForm(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError, setApiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      ClueFormClass.form.initialState,
      ClueFormClass.form.initialErrors,
      ClueFormClass.form.validate,
   );
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         const userClue = form.clue;
         const userStates = roomData.gameState.userStates;
         const submittedClues = ArrayOfObjects.getArrOfValuesFromKey(userStates, 'clue');
         if (submittedClues.includes(userClue)) {
            setApiError('Another user has already submitted this clue.');
            return;
         }
      }
      setApiError('');
      // TODO: API to submit clue form here
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
