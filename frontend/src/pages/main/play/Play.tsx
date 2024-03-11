/* eslint-disable @typescript-eslint/no-floating-promises */
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFader from '../../../global/components/app/logo/LogoFader';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import type { IDropDownOption } from '../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { firestore } from '../../../global/config/firebase/config';
import { GameContext } from '../../../global/context/game/GameContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import PlayFormClass from './class/PlayForm';
import { css, type FlattenSimpleInterpolation } from 'styled-components';
import MyCSS from '../../../global/css/MyCSS';
import { Enter } from '@styled-icons/icomoon/Enter';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';
import Color from '../../../global/css/colors';
import HTMLEntities from '../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';

export default function Play(): JSX.Element {
   const { apiError } = useApiErrorContext();
   const { setLocalDbRoom, setLocalDbUser } = useContext(GameContext);
   const { form, errors, handleChange, initHandleSubmit } = useForm(
      PlayFormClass.form.initialState,
      PlayFormClass.form.initialErrors,
      PlayFormClass.form.validate,
   );
   const { isLoading, isPaused, data } = DBConnect.FSDB.Get.topics();
   const { data: allRoomIds } = DBConnect.FSDB.Get.allRoomIds();
   const navigation = useNavigate();
   const setRoomData = DBConnect.FSDB.Set.room({});
   const addUserToRoom = DBConnect.FSDB.Set.user({});
   const [showHostFields, setShowHostFields] = useState(false);
   const [showRoomIdField, setShowRoomIdField] = useState(false);

   useEffect(() => {
      setShowRoomIdField(form.joinOrHost === 'join');
      setShowHostFields(MiscHelper.isNotFalsyOrEmpty(data) && form.joinOrHost === 'host');
   }, [data, form.joinOrHost]);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      const { isFormValid } = initHandleSubmit(e);
      if (!isFormValid) return;
      if (form.joinOrHost === 'host') {
         await handleHostGame();
         return;
      }
      await handleJoinGame();
   }

   async function handleJoinGame(): Promise<void> {
      const docRef = doc(
         firestore,
         DBConnect.FSDB.CONSTS.GAME_COLLECTION,
         `${DBConnect.FSDB.CONSTS.ROOM_DOC_PREFIX}${form.roomId}`,
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
         alert('Room does not exist!');
         return;
      }
      const roomData = docSnap.data() as DBConnect.FSDB.I.Room;
      const { gameStarted, users, gameState } = roomData;
      const clientUserExistsInRoom = users.some((user) => user.userId === form.name);
      if (clientUserExistsInRoom) {
         alert('Be original, Ben');
         return;
      }
      const roomIsFull = users.length >= 10;
      if (roomIsFull) {
         alert('Room is full');
         return;
      }
      const user: DBConnect.FSDB.I.User = {
         userStatus: 'connected',
         statusUpdatedAt: new Date().toUTCString(),
         userId: form.name,
      };
      const userState: DBConnect.FSDB.I.UserState = {
         userId: form.name,
         totalScore: 0,
         roundScores: [],
         clue: gameStarted ? 'SKIP' : '',
         guess: '',
         votedFor: gameStarted ? 'SKIP' : '',
         spectate: gameStarted,
      };
      await addUserToRoom.mutateAsync({
         roomId: form.roomId,
         userObjForUsers: user,
         userObjForUserState: userState,
         gameStateObj: gameState,
      });
      setLocalDbRoom(form.roomId);
      setLocalDbUser(form.name);
      await DBConnect.RTDB.Set.userStatus(form.name, form.roomId);
      navigation(gameStarted ? '/main/startedgame' : '/main/waitingroom', { replace: true });
   }

   async function handleHostGame(): Promise<void> {
      const generatedRoomId = GameHelper.New.roomUID(allRoomIds ?? ['']);
      const room: DBConnect.FSDB.I.Room = {
         gameStarted: false,
         roomId: generatedRoomId,
         users: [
            {
               userStatus: 'connected',
               statusUpdatedAt: new Date().toUTCString(),
               userId: form.name,
            },
         ],
         gameState: {
            activeTopic: form.topic,
            activeWord: '',
            currentRat: '',
            currentRound: 0,
            numberOfRoundsSet: form.noOfRounds,
            currentTurn: '',
            userStates: [
               {
                  userId: form.name,
                  totalScore: 0,
                  roundScores: [],
                  clue: '',
                  guess: '',
                  votedFor: '',
                  spectate: false,
               },
            ],
         },
      };
      await setRoomData.mutateAsync(room);
      setLocalDbRoom(generatedRoomId);
      setLocalDbUser(form.name);
      DBConnect.RTDB.Set.userStatus(form.name, generatedRoomId);
      navigation('/main/waitingroom', { replace: true });
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
         return ArrOfObj.sort(dropDownOptions, 'label');
      }
      return input.dropDownOptions;
   }

   if (isLoading && !isPaused) return <Loader isDisplayed />;
   if (isPaused) return <OfflineFetch />;
   // if (error) return <FetchError />;

   return (
      <FlexColumnWrapper
         justifyContent="center"
         alignItems="center"
         height="100%"
         localStyles={screenStyles()}
      >
         <LogoFader />
         <StyledForm onSubmit={handleSubmit} apiError={apiError} padding={1}>
            {PlayFormClass.form.inputs
               .filter((input) => input.name !== 'roomId' || showRoomIdField)
               .filter((input) => input.name !== 'topic' || showHostFields)
               .filter((input) => input.name !== 'noOfRounds' || showHostFields)
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

            <FlexRowWrapper justifyContent="center" alignItems="center">
               <StaticButton type="submit" isDarkTheme style={{ display: 'flex' }}>
                  <LogoText size={'1.5em'} color={Color.darkThm.accentDarkerShade}>
                     ENTER {HTMLEntities.space}
                  </LogoText>
                  <Enter width={'1.5em'} color={Color.darkThm.accentDarkerShade} />
               </StaticButton>
            </FlexRowWrapper>
         </StyledForm>
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      justify-content: space-evenly;
      & > *:nth-child(2) {
         width: 35em;
         margin: -2em;
      }
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet);
};
