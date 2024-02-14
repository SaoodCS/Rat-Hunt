/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useHeaderContext from '../../../global/context/widget/header/hooks/useHeaderContext';
import { firestore } from '../../../global/firebase/config/config';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import FirestoreDB from '../class/FirestoreDb';
import LocalDB from '../class/LocalDb';
import { setUserStatus } from '../class/firebaseRTDB';
import GuideAndLeaveRoom from '../components/GuideAndLeaveRoom';
import { GameContext } from './GameContext';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [allUsers, setAllUsers] = useState<string[]>([]);
   const [localDbUser, setLocalDbUser] = useLocalStorage(LocalDB.key.localDbName, '');
   const [localDbRoom, setLocalDbRoom] = useLocalStorage(LocalDB.key.localDbRoom, '');
   const { data: roomData, isLoading } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [ranBefore, setRanBefore] = useState(false);
   const { setHeaderRightElement } = useHeaderContext();
   const navigation = useNavigate();
   const location = useLocation();
   const queryClient = useQueryClient();
   const deleteRoomMutation = FirestoreDB.Room.deleteRoomMutation({});

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         // check if the user exists in the room, and if they do not, navigate them to the play page:
         const userExists = roomData.users.some((user) => user.userId === localDbUser);
         if (!userExists) {
            setLocalDbRoom('');
            setLocalDbUser('');
            navigation('/main/play');
         }
         // if there is no user in the room
         if (roomData.users.length === 0) {
            deleteRoomMutation.mutateAsync({ roomId: localDbRoom });
            setLocalDbRoom('');
            setLocalDbUser('');
            navigation('/main/play');
         }

         // TODO: this is a temporary console.log to check if the cloud function correctly updates the roomData on the front end when a user disconnects:
         const disconnectedUsers = roomData.users.filter(
            (user) => user.userStatus === 'disconnected',
         );
         console.log('disconnectedUsers:', disconnectedUsers);
         // TODO: TEST RESULTS: The realtimedb field userStatus correctly updates when a user disconnects, however the cloud function isn't triggered. However when I manually update the userStatus field in realtime database, the cloud function is triggered and the userStatus field in firestore is updated correctly.
      }
   }, [roomData]);

   useEffect(() => {
      // This useEffect renders the Leave Room icon and Guide icon in the header if the user is in the waiting room or started game, otherwise it renders the Guide icon only
      setHeaderRightElement(<GuideAndLeaveRoom currentPath={location.pathname} />);
   }, [location.pathname]);

   useEffect(() => {
      // This useEffect listens to changes in the firestore room document and updates the roomData cache when the document is updated (doesn't re-run the getRoomQuery, so onSuccess etc. query events are not triggered)
      if (MiscHelper.isNotFalsyOrEmpty(localDbRoom)) {
         const docRef = doc(firestore, FirestoreDB.Room.key.collection, `room-${localDbRoom}`);
         const unsubscribe = onSnapshot(docRef, (doc) => {
            const roomData = doc.data();
            if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
               queryClient.setQueryData([FirestoreDB.Room.key.getRoom], roomData);
            }
         });
         return () => {
            unsubscribe();
         };
      }
   }, [localDbRoom]);

   useEffect(() => {
      // This useEffect runs only once after the app finishes it's first attempt to fetch the roomData from firestore
      if (!isLoading && !ranBefore) {
         setRanBefore(true);
         const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
         const localDbUserInRoom = roomData?.users?.some((user) => user.userId === localDbUser);
         if (roomDataExists && localDbUserInRoom) {
            navigation(roomData.gameStarted ? '/main/startedgame' : '/main/waitingroom');
            setUserStatus(localDbUser, roomData.roomId);
            return;
         }
         if (roomDataExists && !localDbUserInRoom) alert('You have been removed from the room!');
         setLocalDbRoom('');
         setLocalDbUser('');
         navigation('/main/play');
      }
   }, [isLoading]);

   return (
      <GameContext.Provider
         value={{ allUsers, setAllUsers, localDbRoom, setLocalDbRoom, localDbUser, setLocalDbUser }}
      >
         {children}
      </GameContext.Provider>
   );
}
