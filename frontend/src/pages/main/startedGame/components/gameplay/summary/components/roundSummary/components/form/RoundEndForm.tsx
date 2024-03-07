import { useContext } from 'react';
import { StaticButton } from '../../../../../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOption } from '../../../../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../../../../../../../../global/components/lib/form/form/Style';
import InputCombination from '../../../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { GameContext } from '../../../../../../../../../../global/context/game/GameContext';
import useApiErrorContext from '../../../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayHelper from '../../../../../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../../../utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../../../utils/GameHelper/GameHelper';
import RoundEndFormClass from './class/RoundEndFormClass';

interface IRoundEndForm {
   isLastRound: boolean;
   toggleModal: (show: boolean) => void;
}

export default function RoundEndForm(props: IRoundEndForm): JSX.Element {
   const { isLastRound } = props;
   const { apiError } = useApiErrorContext();
   const { localDbRoom } = useContext(GameContext);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      RoundEndFormClass.form.initialState,
      RoundEndFormClass.form.initialErrors,
      RoundEndFormClass.form.validate(isLastRound),
   );
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const setRoomData = DBConnect.FSDB.Set.room({});

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const { gameState, users } = roomData;
      const { newTopic, noOfRounds } = form;
      const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
      const disconnectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
         disconnectedUsers,
         'userId',
      );
      const updatedGameState = GameHelper.SetGameState.newRound({
         disconnectedUsersIds,
         gameState,
         topicsData,
         newTopic,
         resetRoundToOne: isLastRound ? true : undefined,
         resetScores: isLastRound ? true : undefined,
         newNoOfRounds: noOfRounds,
      });
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: updatedGameState,
      });
   }

   function dropDownOptions(
      input: (typeof RoundEndFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (input.name === 'newTopic' && MiscHelper.isNotFalsyOrEmpty(topicsData)) {
         const topics = topicsData.flatMap((topic) => topic.key);
         if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return input.dropDownOptions;
         const dropDownOptions: IDropDownOption[] = [];
         const topicLabels = ArrayHelper.capFirstLetterOfWords(topics);
         for (let i = 0; i < topics.length; i++) {
            dropDownOptions.push({ value: topics[i], label: topicLabels[i] });
         }
         return dropDownOptions;
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {RoundEndFormClass.form.inputs
            .filter((input) => input.name !== 'noOfRounds' || isLastRound)
            .map((input) => (
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

         <StaticButton isDarkTheme type="submit">
            Submit
         </StaticButton>
      </StyledForm>
   );
}
