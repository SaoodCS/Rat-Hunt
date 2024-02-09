import { doc, getDoc, setDoc } from 'firebase/firestore';
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
import { firestore } from '../../../global/firebase/config/config';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import FirestoreDB from '../class/FirestoreDb';
import LocalDB from '../class/LocalDb';
import PlayFormClass from '../class/PlayForm';

export default function Play(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   const { apiError } = useApiErrorContext();
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      PlayFormClass.form.initialState,
      PlayFormClass.form.initialErrors,
      PlayFormClass.form.validate,
   );
   const { isLoading, isPaused, data } = FirestoreDB.Topics.getTopicsQuery();
   const { data: allRoomIds } = FirestoreDB.Game.getAllRoomIdsQuery();
   const navigation = useNavigate();
   const [clientUser, setClientUser] = useLocalStorage(LocalDB.key.clientName, '');
   const [clientRoom, setClientRoom] = useLocalStorage(LocalDB.key.clientRoom, '');

   const setRoomData = FirestoreDB.Room.setRoomMutation({});

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      console.log('isFormValid', isFormValid);
      if (!isFormValid) return;
      if (form.joinOrHost === 'host') {
         await handleHostGame();

         return;
      }
      await handleJoinGame();
   }

   async function handleJoinGame(): Promise<void> {
      // Check to see if the room exists in firestore by running the query
      const docRef = doc(firestore, FirestoreDB.Room.key.collection, form.roomId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
         alert('Room does not exist!');
         return;
      }
      const roomData = docSnap.data() as FirestoreDB.Room.IRoom;
      const clientUserExistsInRoom = roomData.users.some((user) => user.userId === form.name);
      if (clientUserExistsInRoom) {
         alert('Be original, Ben');
         return;
      }
      const roomIsFull = roomData.users.length >= 10;
      if (roomIsFull) {
         alert('Room is full');
         return;
      }
      setClientRoom(form.roomId);
      setClientUser(form.name);
      if (roomData.gameStarted) {
         const averageScore =
            ArrayOfObjects.calcSumOfKeyValue(roomData.users, 'score') / roomData.users.length;
         const user = { deliberateExit: false, score: averageScore, userId: form.name };
         const updatedRoomData = { ...roomData, users: [...roomData.users, user] };
         await setDoc(docRef, { room: updatedRoomData });
         navigation('/main/startedgame');
      }
      if (roomData.gameStarted === false) {
         const user = { deliberateExit: false, score: 0, userId: form.name };
         const updatedRoomData = { ...roomData, users: [...roomData.users, user] };
         await setDoc(docRef, { room: updatedRoomData });
         navigation('/main/waitingroom');
      }
   }

   async function handleHostGame(): Promise<void> {
      const generatedRoomId = FirestoreDB.Room.generateUniqueId(allRoomIds ?? ['']);
      const room: FirestoreDB.Room.IRoom = {
         activeTopic: form.topic,
         gameStarted: false,
         roomId: generatedRoomId,
         users: [
            {
               deliberateExit: false,
               score: 0,
               userId: form.name,
            },
         ],
      };
      await setRoomData.mutateAsync(room);

      setClientRoom(generatedRoomId);
      setClientUser(form.name);
      navigation('/main/waitingroom');
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
