/* eslint-disable @typescript-eslint/no-floating-promises */
import { useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import GuideAndLeaveRoom from '../../../pages/main/components/GuideAndLeaveRoom';
import DBConnect from '../../database/DBConnect/DBConnect';
import { firestore } from '../../database/config/config';
import useLocalStorage from '../../hooks/useLocalStorage';
import { DeviceContext } from '../device/DeviceContext';
import useHeaderContext from '../widget/header/hooks/useHeaderContext';
import { GameContext } from './GameContext';

interface IGameContextProvider {
   children: ReactNode;
}

export default function GameContextProvider(props: IGameContextProvider): JSX.Element {
   const { children } = props;
   const [activeTopicWords, setActiveTopicWords] = useState<GameHelper.I.WordCell[]>([]);
   const [localDbUser, setLocalDbUser] = useLocalStorage(DBConnect.Local.STORAGE_KEYS.USER, '');
   const [localDbRoom, setLocalDbRoom] = useLocalStorage(DBConnect.Local.STORAGE_KEYS.ROOM, '');
   const { data: roomData, isLoading, refetch } = DBConnect.FSDB.Get.room(localDbRoom);
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const { isInForeground } = useContext(DeviceContext);
   const [initialRender, setInitialRender] = useState(true);
   const { setHeaderRightElement } = useHeaderContext();
   const navigation = useNavigate();
   const location = useLocation();
   const queryClient = useQueryClient();

   useEffect(() => {
      // This useEffect renders the Leave Room icon and Guide icon in the header if the user is in the waiting room or started game, otherwise it renders the Guide icon only
      setHeaderRightElement(<GuideAndLeaveRoom currentPath={location.pathname} />);
   }, [location.pathname]);

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
            // alert('Room does not exist or you have been removed from the room!'); <-- commented out because alert also shows when user intentionally leaves the room -->
            setLocalDbRoom('');
            setLocalDbUser('');
            queryClient.clear();
            queryClient.invalidateQueries();
            navigation('/main/play', { replace: true });
            unsubscribe();
         });
         return () => {
            unsubscribe();
         };
      }
   }, [localDbRoom]);

   useEffect(() => {
      const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
      const topicsDataExists = MiscHelper.isNotFalsyOrEmpty(topicsData);
      if (roomDataExists && topicsDataExists) {
         const activeTopicWords = GameHelper.Get.topicWordsAndCells(
            topicsData,
            roomData.gameState.activeTopic,
         );
         setActiveTopicWords(activeTopicWords);
      }
   }, [roomData?.gameState?.activeWord, topicsData]);

   // TODO add on the front-end that on refocusing the window, set the userStatus back to 'connected' in realtime db
   // useEffect(() => {
   // This useEffect sets the userStatus back to "connected" when the user re-focuses the pwa after being in the background
   // TODO: need to test if this updates and deletes correctly in realtime db I NEED TO DO THIS TOMORROW
   // TODO: NEED TO FIX THIS FOREGROUNDING TOMORROW - AT THE MOMENT THE PROBLEM IS THAT THE ONDISCONNECT FOREGROUND LISTENER ISNT CANCELLED SO IT RE-ADDS THE USER IF THEY RE-OPEN THE APP AND THE ROOM NO LONGER EXISTS
   //    if (isInForeground && !isLoading && !initialRender) {
   //       const roomDataExists = MiscHelper.isNotFalsyOrEmpty(roomData);
   //       const localDbUserInRoom = GameHelper.Check.isUserInRoom(
   //          localDbUser,
   //          roomData?.gameState?.userStates || [],
   //       );
   //       if (!(roomDataExists && localDbUserInRoom)) return;
   //       DBConnect.RTDB.Set.userStatus(localDbUser, roomData.roomId);
   //    }
   // }, [isInForeground, roomData]);

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
         setLocalDbRoom('');
         setLocalDbUser('');
         queryClient.clear();
         queryClient.invalidateQueries();
         navigation('/main/play', { replace: true });
      }
   }, [isLoading]);

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
