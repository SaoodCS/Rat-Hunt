import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFader from '../../../global/components/app/logo/LogoFader';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import type { IDropDownOption } from '../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import useThemeContext from '../../../global/context/theme/hooks/useThemeContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import socket from '../../../socket';
import LocalDB from '../class/LocalDb';
import PlayFormClass from '../class/PlayForm';
import FirestoreDB from '../class/FirestoreDb';

export default function Play(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      PlayFormClass.form.initialState,
      PlayFormClass.form.initialErrors,
      PlayFormClass.form.validate,
   );
   const { isLoading, error, isPaused, data } = FirestoreDB.Topics.getTopicsQuery();
   const navigation = useNavigate();
   const [clientUser, setClientUser] = useLocalStorage(LocalDB.key.clientName, '');
   const [clientRoom, setClientRoom] = useLocalStorage(LocalDB.key.clientRoom, '');

   useEffect(() => {
      // Game Hosting Event Listener:
      socket.on('gamehosted', (roomId) => {
         // TODO: Get user from realtime db using socket.id
         console.log(`Game hosted by ${form.name} with roomId: ${roomId}, topic: ${form.topic}`);
         // Add username to local storage and roomId
         setClientUser(form.name);
         setClientRoom(roomId);
         navigation('/main/waitingroom');
      });
      return () => {
         socket.off('gamehosted');
      };
   }, []);

   useEffect(() => {
      socket.on('usernametaken', () => {
         alert('Be Original, Ben');
      });
   }, []);

   useEffect(() => {
      socket.on('roomnotexists', () => {
         alert('Room does not exist');
      });
   });

   useEffect(() => {
      socket.on('userjoined', () => {
         // TODO: Get user and roomId from realtime database
         console.log(`User ${form.name} with roomId: ${form.roomId}`);
         // Add username to local storage and roomId
         setClientUser(form.name);
         setClientRoom(form.roomId);
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
      // emit event to server with game deats
      socket.emit('hostgame', form.name, form.topic);
   }

   function handleJoinGame(): void {
      // TODO: Functionality for joining a game goes here...
      socket.emit('joingame', form.name, form.roomId);
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
