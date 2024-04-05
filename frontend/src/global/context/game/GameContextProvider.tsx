/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import DBConnect from '../../database/DBConnect/DBConnect';
import { firestore } from '../../database/config/config';
import useLocalStorage from '../../hooks/useLocalStorage';
import { DeviceContext } from '../device/DeviceContext';
import { GameContext } from './GameContext';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [activeTopicWords, setActiveTopicWords] = useState<GameHelper.I.WordCell[]>([]);
   const [localDbUser, setLocalDbUser] = useLocalStorage(DBConnect.Local.STORAGE_KEYS.USER, '');
   const [localDbRoom, setLocalDbRoom] = useLocalStorage(DBConnect.Local.STORAGE_KEYS.ROOM, '');
   const { data: roomData, isLoading } = DBConnect.FSDB.Get.room(localDbRoom);
   const { isInForeground } = useContext(DeviceContext);
   const [initialRender, setInitialRender] = useState(true);
   const navigation = useNavigate();
   const queryClient = useQueryClient();

   function clearDataAndNavToPlay(): void {
      setLocalDbRoom('');
      setLocalDbUser('');
      queryClient.clear();
      navigation('/main/play', { replace: true });
   }

   useEffect(() => {
      // This useEffect listens to changes in the firestore room document and updates the roomData cache when the document is updated (doesn't re-run the getRoomQuery, so onSuccess etc. query events are not triggered)
      if (MiscHelper.isNotFalsyOrEmpty(localDbRoom)) {
         const docRef = doc(
            firestore,
            DBConnect.FSDB.CONSTS.GAME_COLLECTION,
            `${DBConnect.FSDB.CONSTS.ROOM_DOC_PREFIX}${localDbRoom}`,
         );
         const unsubscribe = onSnapshot(docRef, (doc) => {
            const docExists = doc.exists();
            const roomData = doc?.data() as AppTypes.Room | undefined;
            const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
            const isUserInRoom = GameHelper.Check.isUserInRoom(
               localDbUser,
               roomData?.gameState?.userStates || [],
            );
            if (docExists && roomDataExists && isUserInRoom) {
               queryClient.setQueryData([DBConnect.FSDB.CONSTS.QUERY_KEYS.GET_ROOM], roomData);
               return;
            }
            clearDataAndNavToPlay();
            unsubscribe();
         });
         return () => {
            unsubscribe();
         };
      }
   }, [localDbRoom, isInForeground]); // these dependency arrays run the cleanup function when the localDbRoom changes or the app goes to the foreground before a new event listener is created

   useEffect(() => {
      // This useEffect runs only once after the app finishes it's first attempt to fetch the roomData from firestore
      if (!isLoading && initialRender) {
         setInitialRender(false);
         const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
         const localDbUserInRoom = GameHelper.Check.isUserInRoom(
            localDbUser,
            roomData?.gameState?.userStates || [],
         );
         if (roomDataExists) {
            if (localDbUserInRoom) {
               navigation(roomData.gameStarted ? '/main/startedgame' : '/main/waitingroom', {
                  replace: true,
               });
               DBConnect.RTDB.Set.userStatus(localDbUser, roomData.roomId);
               return;
            }
            alert('You have been removed from the room!');
         }
         clearDataAndNavToPlay();
      }
   }, [isLoading]);

   useEffect(() => {
      // This useEffect runs whenever the app is back in the foreground and sets the connection status to connected in RTDB if the user is still in a room
      if (isInForeground) {
         if (MiscHelper.isNotFalsyOrEmpty(roomData) && MiscHelper.isNotFalsyOrEmpty(localDbUser)) {
            DBConnect.RTDB.Get.userStatus(localDbUser, localDbRoom).then((userStatus): void => {
               if (userStatus === 'disconnected') {
                  DBConnect.RTDB.Set.userStatus(localDbUser, localDbRoom);
               }
            });
         }
      }
   }, [isInForeground]);

   return (
      <GameContext.Provider
         value={{
            localDbRoom,
            setLocalDbRoom,
            localDbUser,
            setLocalDbUser,
            activeTopicWords,
            setActiveTopicWords,
         }}
      >
         {children}
      </GameContext.Provider>
   );
}
