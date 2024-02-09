import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useLocalStorage from '../../../global/hooks/useLocalStorage';
import FirestoreDB from '../class/FirestoreDb';
import LocalDB from '../class/LocalDb';
import { GameContext } from './GameContext';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [allUsers, setAllUsers] = useState<string[]>([]);

   const [clientUser, setClientUser] = useLocalStorage(LocalDB.key.clientName, '');
   const [clientRoom, setClientRoom] = useLocalStorage(LocalDB.key.clientRoom, '');
   const { data: roomData, isLoading } = FirestoreDB.Room.getRoomQuery(clientRoom);

   const navigation = useNavigate();

   useEffect(() => {
      if (!isLoading) {
         const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
         if (!roomDataExists) {
            setClientRoom('');
            setClientUser('');
            navigation('/main/play');
            return;
         }

         const clientUserExistsInRoom = roomData.users.some((user) => user.userId === clientUser);
         if (roomDataExists && !clientUserExistsInRoom) {
            alert('You have been removed from the room!');
            setClientRoom('');
            setClientUser('');
            navigation('/main/play');
            return;
         }

         if (roomDataExists && clientUserExistsInRoom) {
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

   return <GameContext.Provider value={{ allUsers, setAllUsers }}>{children}</GameContext.Provider>;
}
