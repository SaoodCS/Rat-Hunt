/* eslint-disable @typescript-eslint/no-floating-promises */
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css, type FlattenSimpleInterpolation } from 'styled-components';
import LogoFader from '../../../global/components/app/logo/LogoFader';
import OfflineFetch from '../../../global/components/lib/fetch/offlineFetch/offlineFetch';
import type { IDropDownOptions } from '../../../global/components/lib/form/dropDown/DropDownInput';
import InputCombination from '../../../global/components/lib/form/inputCombination/InputCombination';
import { StyledForm } from '../../../global/components/lib/form/style/Style';
import Loader from '../../../global/components/lib/loader/fullScreen/Loader';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { firestore } from '../../../global/config/firebase/config';
import { GameContext } from '../../../global/context/game/GameContext';
import useApiErrorContext from '../../../global/context/widget/apiError/hooks/useApiErrorContext';
import MyCSS from '../../../global/css/MyCSS';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useForm from '../../../global/hooks/useForm';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import PlayFormClass from './class/PlayForm';
import { StaticButton } from '../../../global/components/lib/button/staticButton/Style';

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
   ): IDropDownOptions | undefined {
      if (input.dropDownOptions === undefined) return;
      if (input.name === 'topic' && MiscHelper.isNotFalsyOrEmpty(data)) {
         const topics = data.flatMap((topic) => topic.key);
         if (!MiscHelper.isNotFalsyOrEmpty(data)) return input.dropDownOptions;
         const options: IDropDownOptions['options'] = [];
         const topicLabels = ArrayHelper.capFirstLetterOfWords(topics);
         for (let i = 0; i < topics.length; i++) {
            options.push({ value: topics[i], label: topicLabels[i] });
         }
         return {
            ...input.dropDownOptions,
            options: ArrOfObj.sort(options, 'label'),
         };
      }
      return input.dropDownOptions;
   }

   if (isLoading && !isPaused) return <Loader isDisplayed />;
   if (isPaused) return <OfflineFetch />;
   // if (error) return <FetchError />;

   return (
      <FlexColumnWrapper
         justifyContent="space-evenly"
         alignItems="center"
         height="100%"
         localStyles={screenStyles()}
         padding="1em 0em 1em 0em"
         boxSizing="border-box"
      >
         <LogoFader />
         <StyledForm
            onSubmit={handleSubmit}
            apiError={apiError}
            padding={1}
            globalFieldStyles={{
               margin: '0em 0em 1em 0em',
            }}
         >
            {PlayFormClass.form.inputs
               .filter((input) => input.name !== 'roomId' || showRoomIdField)
               .filter((input) => input.name !== 'topic' || showHostFields)
               .filter((input) => input.name !== 'noOfRounds' || showHostFields)
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

            <StaticButton type="submit" isDarkTheme>
               Enter Room
            </StaticButton>
         </StyledForm>
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      justify-content: space-evenly;
      & > *:nth-child(2) {
         width: 35em;
      }
   `);
   return MyCSS.Helper.concatStyles(forDesktop);
};
