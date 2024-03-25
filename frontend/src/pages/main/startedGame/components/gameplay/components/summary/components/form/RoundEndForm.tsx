import { useContext } from 'react';
import { StaticButton } from '../../../../../../../../../global/components/lib/button/staticButton/Style';
import type { IDropDownOptions } from '../../../../../../../../../global/components/lib/form/dropDown/dropDownInput';
import InputCombination from '../../../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../../../../../../../global/components/lib/form/style/Style';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import useApiErrorContext from '../../../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayHelper from '../../../../../../../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../../../global/utils/GameHelper/GameHelper';
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
      const { gameState } = roomData;
      const { newTopic, noOfRounds } = form;
      const updatedGameState = GameHelper.SetGameState.newRound({
         gameState,
         topicsData,
         newTopic,
         resetRoundToOne: isLastRound ? true : undefined,
         resetScores: isLastRound ? true : undefined,
         newNoOfRounds: isLastRound ? noOfRounds : undefined,
      });
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: updatedGameState,
      });
   }

   function dropDownOptions(
      input: (typeof RoundEndFormClass.form.inputs)[0],
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (input.name === 'newTopic' && MiscHelper.isNotFalsyOrEmpty(topicsData)) {
         const topics = topicsData.flatMap((topic) => topic.key);
         if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return input.dropDownOptions;
         const dropDownOptions: IDropDownOptions['options'] = [];
         const topicLabels = ArrayHelper.capFirstLetterOfWords(topics);
         for (let i = 0; i < topics.length; i++) {
            dropDownOptions.push({ value: topics[i], label: topicLabels[i] });
         }
         return {
            ...input.dropDownOptions,
            options: ArrOfObj.sort(dropDownOptions, 'label'),
         };
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
         {RoundEndFormClass.form.inputs
            .filter((input) => input.name !== 'noOfRounds' || isLastRound)
            .map((input) => (
               <InputCombination
                  Component={input.Component}
                  key={input.id}
                  name={input.name}
                  id={input.id}
                  label={input.label}
                  type={input.type}
                  autoComplete={input.autoComplete}
                  dropDownOptions={dropDownOptions(input)}
                  numberLineOptions={input.numberLineOptions}
                  isRequired={input.isRequired}
                  isDisabled={input.isDisabled}
                  value={form[input.name]}
                  error={errors[input.name]}
                  handleChange={handleChange}
               />
            ))}

         <StaticButton isDarkTheme type="submit">
            Submit
         </StaticButton>
      </StyledForm>
   );
}
