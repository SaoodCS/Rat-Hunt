import { PlayCircleFill } from '@styled-icons/bootstrap/PlayCircleFill';
import { CircleUser } from '@styled-icons/fa-solid/CircleUser';
import {
   get,
   onChildAdded,
   onChildChanged,
   onChildMoved,
   onChildRemoved,
   onDisconnect,
   push,
   ref,
   set,
} from 'firebase/database';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoText } from '../../../global/components/app/logo/LogoText';
import { TextBtn } from '../../../global/components/lib/button/textBtn/Style';
import AnimatedDots from '../../../global/components/lib/font/animatedDots/AnimatedDots';
import { TextColourizer } from '../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import Color from '../../../global/css/colors';
import { realtime } from '../../../global/firebase/config/config';
import useLocalStorage from '../../../global/hooks/useLocalStorage';

export default function WaitingRoom(): JSX.Element {
   const [allUsers, setAllUsers] = useState<string[]>([]);
   const navigation = useNavigate();
   const [savedUserName, setSavedUserName] = useLocalStorage('userName', '');
   const [savedRoomId, setSavedRoomId] = useLocalStorage('roomId', '');

   useEffect(() => {
      // get all current users in the room and set the state of the array to the users. Also, listen for any changes to the users in the room and update the state of the array accordingly
      console.log('savedRoomId', savedRoomId);
      const roomRef = ref(realtime, `rooms/${savedRoomId}/users`);
      get(roomRef).then((roomSnapshot) => {
         const users: string[] = [];
         roomSnapshot.forEach((user) => {
            users.push(user.key);
         });
         setAllUsers(users);
      });
      const usersRef = ref(realtime, `rooms/${savedRoomId}/users`);
      onChildAdded(usersRef, (userSnapshot) => {
         const user = userSnapshot.key;
         
         if (user) {
            setAllUsers((prev) => [...prev, user]);
         }
      });
      onChildRemoved(usersRef, (userSnapshot) => {
         const user = userSnapshot.key;
         if (user) {
            setAllUsers((prev) => prev.filter((u) => u !== user));
         }
      });
   }, []);

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
                  {savedRoomId && ` - Room ID: ${savedRoomId}`}
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
