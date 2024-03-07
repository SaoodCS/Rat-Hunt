import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useQueryClient } from '@tanstack/react-query';
import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref } from 'firebase/database';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { firebaseRTDB } from '../../../global/firebase/config/config';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../utils/DBConnect/DBConnect';
import GameHelper from '../../../utils/GameHelper/GameHelper';
import HelpGuide from './HelpGuide';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const { localDbRoom, localDbUser, setLocalDbRoom, setLocalDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const deleteUserFromFs = DBConnect.FSDB.Delete.user({});
   const deleteRoomMutation = DBConnect.FSDB.Delete.room({});
   const updateRoomStateMutation = DBConnect.FSDB.Set.room({}, false);
   const navigation = useNavigate();
   const queryClient = useQueryClient();

   function handleHelpGuide(): void {
      setModalHeader('How To Play?');
      setModalContent(<HelpGuide />);
      setModalZIndex(100);
      toggleModal(true);
   }

   async function handleLeaveRoom(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const isLastUser = roomData.users.length === 1;
      const userStatusRef: DatabaseReference = ref(
         firebaseRTDB,
         `/rooms/${localDbRoom}/${localDbUser}`,
      );
      if (isLastUser) {
         await deleteRoomMutation.mutateAsync({ roomId: localDbRoom });
         await DBConnect.RTDB.Delete.room(localDbRoom);
      } else {
         const { gameState, users } = roomData;
         const { currentTurn, userStates, currentRat, activeTopic } = gameState;
         if (currentRat === localDbUser) {
            if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
            const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
            const disconnectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
               disconnectedUsers,
               'userId',
            );

            const updatedGameState = GameHelper.SetGameState.newRound({
               disconnectedUsersIds,
               gameState,
               topicsData,
               newTopic: activeTopic,
               resetCurrentRound: true,
               delUserFromUserStateId: localDbUser,
            });
            const updatedUsers = ArrayOfObjects.filterOut(users, 'userId', localDbUser);
            const updatedRoomState: DBConnect.FSDB.I.Room = {
               ...roomData,
               users: updatedUsers,
               gameState: updatedGameState,
            };
            await updateRoomStateMutation.mutateAsync(updatedRoomState);
         } else if (currentTurn === localDbUser) {
            const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
            const disconnectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
               disconnectedUsers,
               'userId',
            );
            const nextUser = GameHelper.Get.nextTurnUserId(
               userStates,
               localDbUser,
               'leaveRoom',
               currentRat,
               disconnectedUsersIds,
            );

            const updatedUserStates = ArrayOfObjects.filterOut(userStates, 'userId', localDbUser);
            const updatedGameState = {
               ...gameState,
               currentTurn: nextUser,
               userStates: updatedUserStates,
            };
            const updatedUsers = ArrayOfObjects.filterOut(users, 'userId', localDbUser);
            const updatedRoomState: DBConnect.FSDB.I.Room = {
               ...roomData,
               users: updatedUsers,
               gameState: updatedGameState,
            };
            await updateRoomStateMutation.mutateAsync(updatedRoomState);
            await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
         } else {
            await deleteUserFromFs.mutateAsync({
               roomData: roomData,
               userId: localDbUser,
            });
            await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
         }
      }
      await onDisconnect(userStatusRef).cancel();
      setLocalDbRoom('');
      setLocalDbUser('');
      queryClient.removeQueries();
      navigation('/main/play');
   }

   function waitingOrStartedPage(): boolean {
      return currentPath.includes('waiting') || currentPath.includes('started');
   }

   return (
      <>
         {waitingOrStartedPage() && <LogOut onClick={handleLeaveRoom} />}
         <Help onClick={handleHelpGuide} />
      </>
   );
}
