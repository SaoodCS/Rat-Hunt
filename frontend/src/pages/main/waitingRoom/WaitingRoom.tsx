import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { GameContext } from '../../../global/context/game/GameContext';
import { BannerContext } from '../../../global/context/widget/banner/BannerContext';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import Color from '../../../global/css/colors';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import MyCSS from '../../../global/css/MyCSS';

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
      // TODO: change to < 3 when testing is done
      setDisablePlay(allUsers.length < 1 ? true : false);
   }, [allUsers]);

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(roomData) && roomData.gameStarted) {
         navigation('/main/startedgame');
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
            <FlexRowWrapper justifyContent="left" position="relative" alignItems="center">
               <LogoText size={'1.75em'} color={Color.darkThm.accentAlt}>
                  Waiting Room <AnimatedDots count={3} />
               </LogoText>

               <FlexRowWrapper position="absolute" style={{ right: 0 }}>
                  <TextBtn isDarkTheme onClick={() => handleStartGame()}>
                     <PlayCircleFill
                        size="2.5em"
                        style={{ filter: disablePlay ? 'brightness(0.5)' : 'none' }}
                     />
                  </TextBtn>
               </FlexRowWrapper>
            </FlexRowWrapper>
            <FlexRowWrapper
               alignItems="center"
               padding="0.5em 0em 0em 0em"
               color={Color.darkThm.accentAlt}
            >
               <TextColourizer bold>Room ID:&nbsp;</TextColourizer>
               <TextColourizer>{localDbRoom}</TextColourizer>
               <Copy
                  size="1em"
                  onClick={copyToClipboard}
                  style={{ cursor: 'pointer', padding: '0em 0em 0em 0.2em' }}
               />
            </FlexRowWrapper>
            <FlexRowWrapper
               alignItems="center"
               padding="0.5em 0em 0em 0em"
               color={Color.darkThm.accentAlt}
            >
               <TextColourizer bold>Topic:&nbsp;</TextColourizer>
               <TextColourizer>
                  {StringHelper.firstLetterToUpper(roomData?.gameState?.activeTopic ?? '')}
               </TextColourizer>
            </FlexRowWrapper>
            {allUsers.map((user, index) => (
               <FlexRowWrapper
                  alignItems="center"
                  bgColor={Color.darkThm.accentAlt}
                  margin="1em 0em 0em 0em"
                  borderRadius="1em"
                  key={index}
               >
                  <CircleUser
                     size="1.75em"
                     color={localDbUser === user ? Color.darkThm.error : Color.darkThm.accent}
                  />
                  <TextColourizer
                     padding="0em 0em 0em 1em"
                     bold
                     color={localDbUser === user ? Color.darkThm.error : Color.darkThm.accent}
                  >
                     {user}
                  </TextColourizer>
               </FlexRowWrapper>
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
