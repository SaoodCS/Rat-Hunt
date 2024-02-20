import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import Color from '../../../global/css/colors';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import StringHelper from '../../../global/helpers/dataTypes/string/StringHelper';
import FirestoreDB from '../class/FirestoreDb';
import { GameContext } from '../context/GameContext';

export default function WaitingRoom(): JSX.Element {
   const { allUsers, setAllUsers, localDbRoom, localDbUser } = useContext(GameContext);
   const navigation = useNavigate();
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);

   const updateGameStarted = FirestoreDB.Room.updateGameStartedMutation({});

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(roomData) && roomData.gameStarted) {
         navigation('/main/startedgame');
      }
   }, [roomData?.gameStarted]);

   async function handleStartGame(): Promise<void> {
      await updateGameStarted.mutateAsync({
         gameStarted: true,
         roomId: localDbRoom,
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
         <FlexColumnWrapper padding="2em">
            <FlexRowWrapper justifyContent="left" position="relative" alignItems="center">
               <LogoText size={'1.75em'} color={Color.darkThm.accentAlt}>
                  Waiting Room <AnimatedDots count={3} />
               </LogoText>

               <FlexRowWrapper position="absolute" style={{ right: 0 }}>
                  <TextBtn
                     isDarkTheme
                     isDisabled={allUsers.length < 0} // TODO: change to 3 after testing
                     onClick={() => handleStartGame()}
                  >
                     <PlayCircleFill size="2.5em" />
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
