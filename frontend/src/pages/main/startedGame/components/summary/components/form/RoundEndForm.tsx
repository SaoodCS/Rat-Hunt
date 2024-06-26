import { useContext } from 'react';
import RoundEndFormClass from './class/RoundEndFormClass';
import useApiErrorContext from '../../../../../../../global/context/widget/apiError/hooks/useApiErrorContext';
import useForm from '../../../../../../../global/hooks/useForm';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import type { IDropDownOptions } from '../../../../../../../global/components/lib/form/dropDown/DropDownInput';
import ArrayHelper from '../../../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import { StyledForm } from '../../../../../../../global/components/lib/form/style/Style';
import InputCombination from '../../../../../../../global/components/lib/form/inputCombination/InputCombination';
import { StaticButton } from '../../../../../../../global/components/lib/button/staticButton/Style';
import type AppTypes from '../../../../../../../../../shared/app/types/AppTypes';
import axios from 'axios';
import { topics } from '../../../../../../../../../shared/app/utils/topics/topics';

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
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const setRoomData = DBConnect.FSDB.Set.room({});

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { newTopic, noOfRounds } = form;
      let updatedGameState: AppTypes.GameState;
      if (isLastRound) {
         updatedGameState = await GameHelper.SetGameState.resetGame(
            gameState,
            noOfRounds,
            newTopic,
            axios,
         );
      } else {
         updatedGameState = await GameHelper.SetGameState.nextRound(gameState, newTopic, axios);
      }
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: updatedGameState,
      });
   }

   function dropDownOptions(
      input: (typeof RoundEndFormClass.form.inputs)[0],
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (input.name === 'newTopic') {
         const topicsNames = topics.flatMap((topic) => topic.key);
         if (!MiscHelper.isNotFalsyOrEmpty(topics)) return input.dropDownOptions;
         const dropDownOptions: IDropDownOptions['options'] = [];
         const topicLabels = ArrayHelper.toTitleCase(topicsNames);
         for (let i = 0; i < topicsNames.length; i++) {
            dropDownOptions.push({ value: topicsNames[i], label: topicLabels[i] });
         }
         return {
            ...input.dropDownOptions,
            options: ArrOfObj.sort(dropDownOptions, 'label'),
         };
      }
      return input.dropDownOptions;
   }

   return (
      <StyledForm
         onSubmit={handleSubmit}
         apiError={apiError}
         padding={1}
         inputWrapperStyles={{
            margin: '0.2em 0em 1em 0em',
         }}
         btnStyles={{
            margin: '0em 0em 1em 0em',
         }}
      >
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
                  capitalize={input.capitalize}
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
