import { get, onDisconnect, push, ref, set } from 'firebase/database';
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
import { realtime } from '../../../global/firebase/config/config';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import TopicClass from '../../../helper/topicsClass/TopicClass';
import PlayFormClass from './components/playForm/Class';

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
   const [savedUserName, setSavedUserName] = useLocalStorage('userName', '');
   const [savedRoomId, setSavedRoomId] = useLocalStorage('roomId', '');

   useEffect(() => {
      // If the user is already in a room, redirect them to the waiting room
   }, []);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      console.log(form);
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

   async function handleHostGame(): Promise<void> {
      try {
         const roomRef = push(ref(realtime, 'rooms'));
         const roomId = roomRef.key;
         if (!roomId) {
            alert('Error creating room');
            return;
         }
         // Add the user to the room and set the connected status to true:
         await set(ref(realtime, `rooms/${roomId}/users/${form.name}/connected`), true);
         await set(ref(realtime, `rooms/${roomId}/topic`), form.topic);
         setSavedUserName(form.name);
         setSavedRoomId(roomId);
         onDisconnect(ref(realtime, `rooms/${roomId}/users/${form.name}/connected`)).set(false);
         navigation('/main/waitingroom');
      } catch (e) {
         console.error('Error hosting game', e);
      }
   }

   async function handleJoinGame(): Promise<void> {
      try {
         // Check if the room exists
         const roomSnapshot = await get(ref(realtime, `rooms/${form.roomId}`));
         if (!roomSnapshot.exists()) {
            alert('Room does not exist');
            return;
         }
         // Check if the user already exists in the room
         const userSnapshot = await get(ref(realtime, `rooms/${form.roomId}/users/${form.name}`));
         if (userSnapshot.exists()) {
            alert('Username already taken, try a different one');
            return;
         }

         // Check if the game has already started through if the gameStarted node is true. If it has, then tell the user that the game has already started and they cannot join.
         const gameStartedSnapshot = await get(ref(realtime, `rooms/${form.roomId}/gameStarted`));
         if (gameStartedSnapshot.exists() && gameStartedSnapshot.val() === true) {
            alert('Cannot Join. Game has already started');
            return;
         }

         // Add the user to the room and set the connected status to true:
         await set(ref(realtime, `rooms/${form.roomId}/users/${form.name}/connected`), true);
         setSavedUserName(form.name);
         setSavedRoomId(form.roomId);
         // If the user disconnects, do not remove them from the room, but set their connected status to false:
         onDisconnect(ref(realtime, `rooms/${form.roomId}/users/${form.name}/connected`)).set(
            false,
         );
         navigation('/main/waitingroom');
      } catch (e) {
         console.error('Error joining game', e);
      }
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
