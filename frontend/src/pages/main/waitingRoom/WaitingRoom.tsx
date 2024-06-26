import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import { SquareShareNodes } from '@styled-icons/fa-solid/SquareShareNodes';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import StringHelper from '../../../../../shared/lib/helpers/string/StringHelper';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { Wrapper } from '../../../global/components/lib/positionModifiers/wrapper/Style';
import Scroller from '../../../global/components/lib/scroller/Scroller';
import { GameContext } from '../../../global/context/game/GameContext';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import CSS_Color from '../../../global/css/utils/colors';
import { CSS_Helper } from '../../../global/css/utils/helper';
import { CSS_Media } from '../../../global/css/utils/media';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import Device from '../../../global/helpers/pwa/deviceHelper';
import useCustomNavigate from '../../../global/hooks/useCustomNavigate';
import {
   ItemLabel,
   ItemValue,
   PlayBtnContainer,
   RoomIdTopicItemContainer,
   UserListItemContainer,
   WaitingRoomTitle,
} from './style/Style';

export default function WaitingRoom(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const navigation = useCustomNavigate();
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastTextAlign,
      setToastType,
      setToastDurationSecs,
   } = useContext(ToastContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [disablePlay, setDisablePlay] = useState(false);
   const setRoomData = DBConnect.FSDB.Set.room({});
   const [allUsers, setAllUsers] = useState<string[]>([]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      setAllUsers(GameHelper.Get.allUserIds(roomData.gameState.userStates));
   }, [roomData?.gameState?.userStates]);

   useEffect(() => {
      setDisablePlay(
         allUsers.length < GameHelper.CONSTANTS.MIN_PLAYERS_TO_START_GAME ? true : false,
      );
   }, [allUsers]);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(roomData) && roomData.gameStarted) {
         navigation('/main/startedgame');
      }
   }, [roomData?.gameStarted]);

   async function handleStartGame(): Promise<void> {
      if (disablePlay) {
         toggleToast(true);
         setToastMessage('3 Players are Required to Start the Game!');
         setWidth('auto');
         setVerticalPos('top');
         setHorizontalPos('center');
         setToastTextAlign('center');
         setToastType('warning');
         setToastDurationSecs(3);
         return;
      }
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { activeTopic } = gameState;
      const initialRoundGameState = await GameHelper.SetGameState.nextRound(
         gameState,
         activeTopic,
         axios,
      );
      await setRoomData.mutateAsync({
         ...roomData,
         gameState: initialRoundGameState,
         gameStarted: true,
      });
   }

   async function shareRoomCode(): Promise<void> {
      if (!navigator.share) {
         await navigator.clipboard.writeText(localDbRoom);
         toggleToast(true);
         setToastMessage('Room Code Copied');
         setWidth('15em');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         return;
      }
      await Device.shareContent({
         title: 'Play Rat Hunt With Me!',
         text: `Play Rat Hunt with me! Room code: ${localDbRoom}`,
      });
   }

   return (
      <FlexColumnWrapper
         padding="2em"
         localStyles={screenStyles()}
         boxSizing="border-box"
         height="100%"
      >
         <FlexRowWrapper position="relative" alignItems="center" padding="0em 0em 1em 0em" flex={1}>
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
            <SquareShareNodes
               size="1.1em"
               onClick={shareRoomCode}
               style={{
                  cursor: 'pointer',
                  color: CSS_Color.setRgbOpacity(CSS_Color.darkThm.warning, 1),
                  marginBottom: '0.15em',
               }}
               color={CSS_Color.darkThm.warning}
            />
         </RoomIdTopicItemContainer>
         <RoomIdTopicItemContainer>
            <ItemLabel>Topic</ItemLabel>
            <ItemValue>
               {StringHelper.firstLetterToUpper(roomData?.gameState?.activeTopic ?? '')}
            </ItemValue>
         </RoomIdTopicItemContainer>
         <Wrapper overflow="hidden" flex={120}>
            <Scroller scrollbarWidth={8} withFader dependencies={[allUsers]} hideScrollbar>
               {allUsers.map((user, index) => (
                  <UserListItemContainer key={index} isThisUser={user === localDbUser}>
                     <CircleUser size="1.75em" />
                     <TextColourizer padding="0em 0em 0em 1em">{user}</TextColourizer>
                  </UserListItemContainer>
               ))}
            </Scroller>
         </Wrapper>
      </FlexColumnWrapper>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = CSS_Media.Query.desktop(css`
      width: 30em;
      margin: 0 auto;
      font-size: 1.2em;
   `);
   const forTablet = CSS_Media.Query.tablet(css``);
   return CSS_Helper.concatStyles(forDesktop, forTablet);
};
