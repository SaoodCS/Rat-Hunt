import { useContext } from 'react';
import { StaticButton } from '../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../global/components/lib/form/inputCombination/InputCombination';
import useThemeContext from '../../../../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../global/hooks/useForm';
import FirestoreDB from '../../../../class/FirestoreDb';
import RatVoteFormClass from './class/RatVoteFormClass';
import { GameContext } from '../../../../context/GameContext';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';

export default function RatVoteForm(): JSX.Element {
   const { localDbRoom } = useContext(GameContext);
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      RatVoteFormClass.form.initialState,
      RatVoteFormClass.form.initialErrors,
      RatVoteFormClass.form.validate,
   );
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      // eslint-disable-next-line no-useless-return
      if (!isFormValid) return;
      // TODO: API to submit rat vote here
   }

   function dropDownOptions(
      input: (typeof RatVoteFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (!(input.name === 'vote' && MiscHelper.isNotFalsyOrEmpty(roomData))) return;
      const usersArr = roomData.users;
      const dropDownOptions: IDropDownOption[] = usersArr.map((user) => ({
         value: user.userId,
         label: user.userId,
      }));
      return dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {RatVoteFormClass.form.inputs.map((input) => (
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
