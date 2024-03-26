import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { GameContext } from '../../../global/context/game/GameContext';
import { BannerContext } from '../../../global/context/widget/banner/BannerContext';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import MyCSS from '../../../global/css/MyCSS';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import {
   ItemLabel,
   ItemValue,
   PlayBtnContainer,
   RoomIdTopicItemContainer,
   UserListItemContainer,
   WaitingRoomTitle,
} from './style/Style';

const MIN_PLAYERS = 1;

export default function WaitingRoom(): JSX.Element {
   const { allUsers, localDbRoom, localDbUser } = useContext(GameContext);
   const navigation = useNavigate();
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [disablePlay, setDisablePlay] = useState(false);
   const { toggleBanner, setBannerMessage, setBannerType, setBannerZIndex } =
      useContext(BannerContext);
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const setRoomData = DBConnect.FSDB.Set.room({});

   useEffect(() => {
      setDisablePlay(allUsers.length < MIN_PLAYERS ? true : false);
   }, [allUsers]);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(roomData) && roomData.gameStarted) {
         navigation('/main/startedgame', { replace: true });
      }
   }, [roomData?.gameStarted]);

   async function handleStartGame(): Promise<void> {
      if (disablePlay) {
         toggleBanner(true);
         setBannerType('warning');
         setBannerMessage('3 Players are Required to Start the Game!');
         setBannerZIndex(100);
         return;
      }
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const { gameState } = roomData;
      const { activeTopic } = gameState;
      const initialRoundGameState = GameHelper.SetGameState.newRound({
         gameState,
         topicsData,
         newTopic: activeTopic,
      });
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: initialRoundGameState,
         gameStarted: true,
      });
   }

   async function copyToClipboard(): Promise<void> {
      await navigator.clipboard.writeText(localDbRoom);
      setToastMessage('Room ID Copied!');
      setWidth('200px');
      setVerticalPos('bottom');
      setHorizontalPos('center');
      setToastZIndex(100);
      toggleToast(true);
   }

   return (
      <>
         <FlexColumnWrapper padding="2em" localStyles={screenStyles()}>
            <FlexRowWrapper position="relative" alignItems="center" padding="0em 0em 1em 0em">
               <WaitingRoomTitle>
                  Waiting Room <AnimatedDots count={3} />
               </WaitingRoomTitle>
               <PlayBtnContainer onClick={() => handleStartGame()} disablePlay={disablePlay}>
                  <PlayCircleFill size="2.5em" />
               </PlayBtnContainer>
            </FlexRowWrapper>
            <RoomIdTopicItemContainer>
               <ItemLabel>Room ID</ItemLabel>
               <ItemValue>{localDbRoom}</ItemValue>
               <Copy size="1em" onClick={copyToClipboard} style={{ cursor: 'pointer' }} />
            </RoomIdTopicItemContainer>
            <RoomIdTopicItemContainer>
               <ItemLabel>Topic</ItemLabel>
               <ItemValue>
                  {StringHelper.firstLetterToUpper(roomData?.gameState?.activeTopic ?? '')}
               </ItemValue>
            </RoomIdTopicItemContainer>
            {allUsers.map((user, index) => (
               <UserListItemContainer key={index} isThisUser={user === localDbUser}>
                  <CircleUser size="1.75em" />
                  <TextColourizer padding="0em 0em 0em 1em">{user}</TextColourizer>
               </UserListItemContainer>
            ))}
         </FlexColumnWrapper>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      width: 30em;
      margin: 0 auto;
      font-size: 1.2em;
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet);
};
