/* eslint-disable @typescript-eslint/no-floating-promises */
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import FirestoreDB from '../class/FirestoreDb';
import LocalDB from '../class/LocalDb';
import { GameContext } from './GameContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../global/firebase/config/config';
import { useQueryClient } from '@tanstack/react-query';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [allUsers, setAllUsers] = useState<string[]>([]);
   const [localDbUser, setLocalDbUser] = useLocalStorage(LocalDB.key.localDbName, '');
   const [localDbRoom, setLocalDbRoom] = useLocalStorage(LocalDB.key.localDbRoom, '');
   const { data: roomData, isLoading, refetch } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [ranBefore, setRanBefore] = useState(false);
   const navigation = useNavigate();

   const queryClient = useQueryClient();

   useEffect(() => {
      if (MiscHelper.isNotFalsyOrEmpty(localDbRoom)) {
         const docRef = doc(firestore, FirestoreDB.Room.key.collection, localDbRoom);
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
      if (MiscHelper.isNotFalsyOrEmpty(localDbRoom)) {
         refetch();
      }
   }, [localDbRoom]);

   useEffect(() => {
      if (!isLoading && !ranBefore) {
         setRanBefore(true);
         const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
         if (!roomDataExists) {
            setLocalDbRoom('');
            setLocalDbUser('');
            navigation('/main/play');
            return;
         }

         const localDbUserExistsInRoom = roomData.users.some((user) => user.userId === localDbUser);
         if (roomDataExists && !localDbUserExistsInRoom) {
            alert('You have been removed from the room!');
            setLocalDbRoom('');
            setLocalDbUser('');
            navigation('/main/play');
            return;
         }

         if (roomDataExists && localDbUserExistsInRoom) {
            const userIds = roomData.users.map((user) => user.userId);
            setAllUsers(userIds);
            if (roomData.gameStarted) {
               navigation('/main/startedgame');
            } else {
               navigation('/main/waitingroom');
            }
         }
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
