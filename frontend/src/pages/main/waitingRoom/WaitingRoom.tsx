import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../../global/css/colors';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import socket from '../../../socket';

export default function WaitingRoom(): JSX.Element {
   const [allUsers, setAllUsers] = useState<string[]>([]);
   const [disableStartBtn, setDisableStartBtn] = useState<boolean>(true);
   const navigation = useNavigate();
   const [clientRoom, setClientRoom] = useLocalStorage('clientRoom', '');
   const [clientUser, setUsername] = useLocalStorage('clientUser', '');

   useEffect(() => {
      socket.on('updateonline', () => {
         // (if this event listener isn't triggered when navigated from the waitingRoom, use useContext)
         // TODO: get users from the firebase realtime db using room
         // TODO: run setAllUsers(users from db)
      });
   }, []);

   useEffect(() => {
      // This useEffect enables the start button when there are at least 3 users in the room
      if (allUsers.length >= 3) {
         setDisableStartBtn(false);
      } else {
         setDisableStartBtn(true);
      }
   }, [allUsers]);

   function handleStartGame(): void {
      // TODO: Add any functionality for here that needs to be executed before / when navigating to the startedgame page...
      navigation('/main/startedgame');
   }

   return (
      <>
         <FlexColumnWrapper padding="2em">
            <FlexRowWrapper justifyContent="left" position="relative" alignItems="center">
               <LogoText size={'1.75em'} color={Color.darkThm.accentAlt}>
                  Waiting Room <AnimatedDots count={3} />
               </LogoText>
               <FlexRowWrapper position="absolute" style={{ right: 0 }}>
                  <TextBtn isDarkTheme isDisabled={false} onClick={() => handleStartGame()}>
                     <PlayCircleFill size="2.5em" />
                  </TextBtn>
               </FlexRowWrapper>
            </FlexRowWrapper>
            {allUsers.map((user, index) => (
               <FlexRowWrapper
                  alignItems="center"
                  bgColor={Color.darkThm.accentAlt}
                  margin="1em 0em 0em 0em"
                  borderRadius="1em"
                  key={index}
               >
                  <CircleUser size="1.75em" color={Color.darkThm.accent} />
                  <TextColourizer padding="0em 0em 0em 1em" bold color={Color.darkThm.accent}>
                     {user}
                  </TextColourizer>
               </FlexRowWrapper>
            ))}
         </FlexColumnWrapper>
      </>
   );
}
