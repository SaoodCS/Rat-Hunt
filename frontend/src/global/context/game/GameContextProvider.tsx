/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../../shared/app/types/AppTypes';
import DBConnect from '../../database/DBConnect/DBConnect';
import useCustomNavigate from '../../hooks/useCustomNavigate';
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
   const { isInForeground } = useContext(DeviceContext);
   const navigation = useCustomNavigate();
   const queryClient = useQueryClient();

   useEffect(() => {
      // This useEffect listens to changes in the firestore room document and updates the roomData cache when the document is updated (doesn't re-run the getRoomQuery, so onSuccess etc. query events are not triggered)
      const docRef = DBConnect.FSDB.Get.roomRef(localDbRoom);
      const unsubscribe = onSnapshot(docRef, async (doc) => {
         if (doc.exists()) {
            const roomInScope = doc.data() as AppTypes.Room;
            const { gameStarted } = roomInScope;
            const { userStates } = roomInScope.gameState;
            if (GameHelper.Check.isUserInRoom(localDbUser, userStates)) {
               const { userStatus } = GameHelper.Get.userState(localDbUser, userStates);
               if (userStatus !== 'connected' && isInForeground) {
                  await DBConnect.RTDB.Set.userStatus(localDbUser, localDbRoom);
               }
               queryClient.setQueryData([DBConnect.FSDB.CONSTS.QUERY_KEYS.GET_ROOM], roomInScope);
               navigation(gameStarted ? '/main/startedgame' : '/main/waitingroom');
               return;
            }
            alert('You have been removed from the room!');
         }
         setLocalDbRoom('');
         setLocalDbUser('');
         queryClient.clear();
         navigation('/main/play');
         unsubscribe();
      });
      return () => unsubscribe();
   }, [localDbRoom, localDbUser, isInForeground]);

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
