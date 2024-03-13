/* eslint-disable @typescript-eslint/no-floating-promises */
import { Enter } from '@styled-icons/icomoon/Enter';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css, type FlattenSimpleInterpolation } from 'styled-components';
import LogoFader from '../../../global/components/app/logo/LogoFader';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import type { IDropDownOption } from '../../../global/components/lib/form/dropDown/DropDownInput';
import { StyledForm } from '../../../global/components/lib/form/form/Style';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { firestore } from '../../../global/config/firebase/config';
import { GameContext } from '../../../global/context/game/GameContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import MyCSS from '../../../global/css/MyCSS';
import Color from '../../../global/css/colors';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import PlayFormClass from './class/PlayForm';

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
      const roomId = form.roomId.toUpperCase();
      const formName = form.name.trim();
      const docRef = doc(
         firestore,
         DBConnect.FSDB.CONSTS.GAME_COLLECTION,
         `${DBConnect.FSDB.CONSTS.ROOM_DOC_PREFIX}${roomId}`,
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
         alert('Room does not exist!');
         return;
      }
      const roomData = docSnap.data() as DBConnect.FSDB.I.Room;
      const { gameStarted, users, gameState } = roomData;
      const clientUserExistsInRoom = users.some(
         (user) => user.userId.trim().toUpperCase() === formName.toUpperCase(),
      );
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
         userId: formName,
      };
      const userState: DBConnect.FSDB.I.UserState = {
         userId: formName,
         totalScore: 0,
         roundScores: [],
         clue: gameStarted ? 'SKIP' : '',
         guess: '',
         votedFor: gameStarted ? 'SKIP' : '',
         spectate: gameStarted,
      };
      await addUserToRoom.mutateAsync({
         roomId: roomId,
         userObjForUsers: user,
         userObjForUserState: userState,
         gameStateObj: gameState,
      });
      setLocalDbRoom(roomId);
      setLocalDbUser(formName);
      await DBConnect.RTDB.Set.userStatus(formName, roomId);
      navigation(gameStarted ? '/main/startedgame' : '/main/waitingroom', { replace: true });
   }

   async function handleHostGame(): Promise<void> {
      const generatedRoomId = GameHelper.New.roomUID(allRoomIds ?? ['']);
      const formName = form.name.trim();
      const room: DBConnect.FSDB.I.Room = {
         gameStarted: false,
         roomId: generatedRoomId,
         users: [
            {
               userStatus: 'connected',
               statusUpdatedAt: new Date().toUTCString(),
               userId: formName,
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
                  userId: formName,
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
      setLocalDbUser(formName);
      DBConnect.RTDB.Set.userStatus(formName, generatedRoomId);
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
               <TextBtn
                  type="submit"
                  isDarkTheme
                  style={{
                     alignItems: 'center',
                     borderRadius: '0.25em',
                     border: `2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.4)}`,
                     background: Color.setRgbOpacity(Color.darkThm.accent, 0.1),
                  }}
               >
                  <LogoText
                     size={'1.25em'}
                     color={Color.setRgbOpacity(Color.darkThm.accent, 1)}
                     style={{ filter: 'brightness(1.2)' }}
                  >
                     {HTMLEntities.space}ENTER {HTMLEntities.space}
                  </LogoText>
                  <Enter
                     width={'1.25em'}
                     color={Color.setRgbOpacity(Color.darkThm.accent, 1)}
                     style={{ filter: 'brightness(1.2)' }}
                  />
                  {HTMLEntities.space}
               </TextBtn>
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

   const forShort = MyCSS.Media.short(css`
      & > *:nth-child(1) {
         font-size: 0.7em;
      }
   `);
   return MyCSS.Helper.concatStyles(forDesktop, forShort);
};
