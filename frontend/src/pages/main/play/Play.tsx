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
   const { form, errors, setErrors, handleChange, initHandleSubmit } = useForm(
      PlayFormClass.form.initialState,
      PlayFormClass.form.initialErrors,
      PlayFormClass.form.validate,
   );
   const { isLoading, isPaused, data } = DBConnect.FSDB.Get.topics();
   const { data: allRoomIds } = DBConnect.FSDB.Get.allRoomIds();
   const navigation = useNavigate();
   const setRoomData = DBConnect.FSDB.Set.room({});
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
      const joinRoomErrors = PlayFormClass.form.validateJoin(docSnap, form);
      if (MiscHelper.isNotFalsyOrEmpty(joinRoomErrors)) {
         setErrors((prev) => ({ ...prev, ...joinRoomErrors }));
         return;
      }
      const roomData = docSnap.data() as DBConnect.FSDB.I.Room;
      const roomDataWithAddedUser = GameHelper.SetRoomState.newUser(roomData, formName);
      await setRoomData.mutateAsync(roomDataWithAddedUser);
      setLocalDbRoom(roomId);
      setLocalDbUser(formName);
      await DBConnect.RTDB.Set.userStatus(formName, roomId);
      const { gameStarted } = roomData;
      navigation(gameStarted ? '/main/startedgame' : '/main/waitingroom', { replace: true });
   }

   async function handleHostGame(): Promise<void> {
      const generatedRoomId = GameHelper.New.roomUID(allRoomIds ?? ['']);
      const { name, topic, noOfRounds } = form;
      const formName = name.trim();
      const room = GameHelper.SetRoomState.newRoom(generatedRoomId, formName, topic, noOfRounds);
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
                     border: `2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 1)}`,
                     background: Color.setRgbOpacity(Color.darkThm.accent, 0.1),
                     boxShadow: `inset 0.1em 0.1em 0em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.7)},
                     inset -0.1em -0.1em 0.1em 0 ${Color.setRgbOpacity(Color.darkThm.bg, 0.7)}`,
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
