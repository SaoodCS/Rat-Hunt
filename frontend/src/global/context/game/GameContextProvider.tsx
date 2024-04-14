/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import DBConnect from '../../database/DBConnect/DBConnect';
import useLocalStorage from '../../hooks/useLocalStorage';
import { DeviceContext } from '../device/DeviceContext';
import { GameContext } from './GameContext';
import useCustomNavigate from '../../hooks/useCustomNavigate';

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
   const navigation = useCustomNavigate();
   const queryClient = useQueryClient();

   function clearDataAndNavToPlay(): void {
      setLocalDbRoom('');
      setLocalDbUser('');
      queryClient.clear();
      navigation('/main/play');
   }

   useEffect(() => {
      // This useEffect listens to changes in the firestore room document and updates the roomData cache when the document is updated (doesn't re-run the getRoomQuery, so onSuccess etc. query events are not triggered)
      const docRef = DBConnect.FSDB.Get.roomRef(localDbRoom);
      const unsubscribe = onSnapshot(docRef, (doc) => {
         const { isUserInRoom } = GameHelper.Check;
         if (doc.exists() && isUserInRoom(localDbUser, doc.data().gameState.userStates)) {
            queryClient.setQueryData([DBConnect.FSDB.CONSTS.QUERY_KEYS.GET_ROOM], doc.data());
            return;
         }
         clearDataAndNavToPlay();
         unsubscribe();
      });
      return () => unsubscribe();
   }, [localDbRoom, isInForeground]); // these dependency arrays run the cleanup function when the localDbRoom changes or the app goes to the foreground before a new event listener is created

   useEffect(() => {
      // This useEffect runs only once after the app finishes it's first attempt to fetch the roomData from firestore
      if (isLoading || !initialRender) return;
      setInitialRender(false);
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) {
         clearDataAndNavToPlay();
         return;
      }
      const { gameStarted, gameState } = roomData;
      if (!GameHelper.Check.isUserInRoom(localDbUser, gameState.userStates)) {
         alert('You have been removed from the room!');
         clearDataAndNavToPlay();
         return;
      }
      navigation(gameStarted ? '/main/startedgame' : '/main/waitingroom');
      DBConnect.RTDB.Set.userStatus(localDbUser, roomData.roomId);
   }, [isLoading]);

   useEffect(() => {
      // This useEffect runs whenever the app is back in the foreground and sets the connection status to connected in RTDB if the user is still in a room
      if (!(isInForeground && MiscHelper.isNotFalsyOrEmpty(roomData))) return;
      DBConnect.RTDB.Get.userStatus(localDbUser, localDbRoom).then((userStatus): void => {
         if (userStatus === 'disconnected') DBConnect.RTDB.Set.userStatus(localDbUser, localDbRoom);
      });
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
