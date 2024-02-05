import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFader from '../../../global/components/app/logo/LogoFader';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import { IDropDownOption } from '../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import socket from '../../../socket';
import PlayFormClass from './components/playForm/Class';
import TopicClass from '../../../helper/topicsClass/TopicClass';

export default function Play(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      PlayFormClass.form.initialState,
      PlayFormClass.form.initialErrors,
      PlayFormClass.form.validate,
   );
   const { isLoading, error, isPaused, data } = TopicClass.getTopicsQuery();
   const navigation = useNavigate();

   useEffect(() => {
      // Game Hosting Event Listener:
      socket.on('gamehosted', (roomId, topic, user) => {
         console.log(`Game hosted by ${user} with roomId: ${roomId}, topic: ${topic}`);
         navigation('/main/waitingroom');
      });
      return () => {
         socket.off('gamehosted');
      };
   }, []);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      console.log('isFormValid', isFormValid);
      if (!isFormValid) return;
      if (form.joinOrHost === 'host') {
         console.log('hosting');
         handleHostGame();
         return;
      }
      console.log('joining');
      handleJoinGame();
   }

   function handleHostGame(): void {
      // TODO: Any other functionality for hosting a game goes here...
      socket.emit('hostgame', form.name, form.topic);
   }

   function handleJoinGame(): void {
      // TODO: Functionality for joining a game goes here...
   }

   function dropDownOptions(
      input: (typeof PlayFormClass.form.inputs)[0],
   ): IDropDownOption[] | undefined {
      if (!input.isDropDown) return;
      if (input.name === 'topic' && MiscHelper.isNotFalsyOrEmpty(data)) {
         const topics = data.flatMap((topic) => topic.key);
         if (!MiscHelper.isNotFalsyOrEmpty(data)) return input.dropDownOptions;
         const dropDownOptions: IDropDownOption[] = [];
         const topicLabels = ArrayHelper.capFirstLetterOfWords(topics);
         for (let i = 0; i < topics.length; i++) {
            dropDownOptions.push({ value: topics[i], label: topicLabels[i] });
         }
         return dropDownOptions;
      }
      return input.dropDownOptions;
   }

   if (isLoading && !isPaused) return <Loader isDisplayed />;
   if (isPaused) return <OfflineFetch />;
   // if (error) return <FetchError />;

   const showRoomIdField = form.joinOrHost === 'join';
   const showTopicField = MiscHelper.isNotFalsyOrEmpty(data) && form.joinOrHost === 'host';

   return (
      <FlexColumnWrapper justifyContent="center" alignItems="center" height="100%">
         <LogoFader />
         <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
            {PlayFormClass.form.inputs
               .filter((input) => input.name !== 'roomId' || showRoomIdField)
               .filter((input) => input.name !== 'topic' || showTopicField)
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

            <StaticButton isDarkTheme={isDarkTheme}>Submit</StaticButton>
         </StyledForm>
      </FlexColumnWrapper>
   );
}
