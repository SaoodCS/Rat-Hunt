import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Share } from '@styled-icons/fluentui-system-regular/Share';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useQueryClient } from '@tanstack/react-query';
import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firebaseRTDB } from '../../../global/database/config/config';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import Device from '../../../global/helpers/pwa/deviceHelper';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import HelpGuide from './HelpGuide';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import ArrOfObj from '../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);
   const { localDbRoom, localDbUser, setLocalDbRoom, setLocalDbUser } = useContext(GameContext);
   const [isWaitingPage, setIsWaitingPage] = useState(currentPath.includes('waiting'));
   const [isStartedGamePage, setIsStartedGamePage] = useState(currentPath.includes('started'));
   const [isPlayPage, setIsPlayPage] = useState(currentPath.includes('play'));
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { data: topicsData } = DBConnect.FSDB.Get.topics();
   const deleteUserFromFs = DBConnect.FSDB.Delete.user({});
   const deleteRoomMutation = DBConnect.FSDB.Delete.room({});
   const updateRoomStateMutation = DBConnect.FSDB.Set.room({}, false);
   const navigation = useNavigate();
   const queryClient = useQueryClient();
   const location = useLocation();

   useEffect(() => {
      setIsWaitingPage(currentPath.includes('waiting'));
      setIsStartedGamePage(currentPath.includes('started'));
      setIsPlayPage(currentPath.includes('play'));
   }, [currentPath]);

   function handleHelpGuide(): void {
      setModalHeader('How To Play?');
      setModalContent(<HelpGuide />);
      setModalZIndex(100);
      toggleModal(true);
   }

   async function clearAppState(): Promise<void> {
      const userStatusRef: DatabaseReference = ref(
         firebaseRTDB,
         `/rooms/${localDbRoom}/${localDbUser}`,
      );
      await onDisconnect(userStatusRef).cancel();
      setLocalDbRoom('');
      setLocalDbUser('');
      queryClient.removeQueries();
      navigation('/main/play', { replace: true });
   }

   async function changeRatAndDeleteUser(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const roomDataWithoutUser = GameHelper.SetRoomState.removeUser(roomData, localDbUser);
      const { gameState } = roomDataWithoutUser;
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      let updatedGameState: typeof gameState;
      if (gamePhase !== 'roundSummary') {
         updatedGameState = GameHelper.SetGameState.resetCurrentRound(gameState, topicsData);
      } else updatedGameState = gameState;
      const updatedRoomState = GameHelper.SetRoomState.keysVals(roomData, [
         { key: 'gameState', value: updatedGameState },
      ]);
      await updateRoomStateMutation.mutateAsync(updatedRoomState);
      await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
      await clearAppState();
   }

   async function changeTurnAndDeleteUser(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const nextUser = GameHelper.Get.nextTurnUserId(
         gameState,
         localDbUser,
         'leaveRoom',
         currentRat,
      );
      const updatedUserStates = ArrOfObj.filterOut(userStates, 'userId', localDbUser);
      const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
         { key: 'currentTurn', value: nextUser },
         { key: 'userStates', value: updatedUserStates },
      ]);
      const updatedRoomState = GameHelper.SetRoomState.keysVals(roomData, [
         { key: 'gameState', value: updatedGameState },
      ]);
      await updateRoomStateMutation.mutateAsync(updatedRoomState);
      await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
      await clearAppState();
   }

   async function handleLeaveRoom(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
      const isLastUser = roomData.gameState.userStates.length === 1;
      if (isLastUser) {
         await deleteRoomMutation.mutateAsync({ roomId: localDbRoom });
         await DBConnect.RTDB.Delete.room(localDbRoom);
         await clearAppState();
         return;
      }
      const { gameState } = roomData;
      const { currentTurn, currentRat } = gameState;
      if (!location.pathname.includes('waiting')) {
         if (currentRat === localDbUser) {
            await changeRatAndDeleteUser();
            return;
         } else if (GameHelper.Get.currentTurnUserId(currentTurn) === localDbUser) {
            await changeTurnAndDeleteUser();
            return;
         }
      }
      await deleteUserFromFs.mutateAsync({
         roomData: roomData,
         userId: localDbUser,
      });
      await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
      await clearAppState();
   }

   async function shareApp(): Promise<void> {
      if (!navigator.share) {
         await navigator.clipboard.writeText(Device.getBaseURL());
         toggleToast(true);
         setToastMessage('Link Copied');
         setWidth('15em');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         setToastZIndex(100);
         return;
      }
      await Device.shareContent({
         title: 'Play Rat Hunt With Me!',
         text: 'Use the link to play Rat Hunt',
         url: Device.getBaseURL(),
      });
   }

   return (
      <>
         {(isWaitingPage || isStartedGamePage) && <LogOut onClick={handleLeaveRoom} />}
         {isPlayPage && <Share onClick={shareApp} />}
         <Help onClick={handleHelpGuide} />
      </>
   );
}
