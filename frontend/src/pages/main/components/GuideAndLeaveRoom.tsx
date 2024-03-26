import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useQueryClient } from '@tanstack/react-query';
import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseRTDB } from '../../../global/config/firebase/config';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrOfObj from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../global/utils/GameHelper/GameHelper';
import HelpGuide from './HelpGuide';
import { Share } from '@styled-icons/fluentui-system-regular/Share';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import Device from '../../../global/helpers/pwa/deviceHelper';

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
         const gamePhase = GameHelper.Get.gamePhase(gameState);
         if (currentRat === localDbUser) {
            if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
            const updatedGameState = GameHelper.SetGameState.newRound({
               gameState,
               topicsData,
               newTopic: activeTopic,
               resetCurrentRound: true,
               idOfUserToDelFromUserStates: localDbUser,
               cancelGameStateUpdate: gamePhase === 'roundSummary',
            });
            const updatedUsers = ArrOfObj.filterOut(users, 'userId', localDbUser);
            const updatedRoomState = GameHelper.SetRoomState.keysVals(roomData, [
               { key: 'users', value: updatedUsers },
               { key: 'gameState', value: updatedGameState },
            ]);
            await updateRoomStateMutation.mutateAsync(updatedRoomState);
         } else if (GameHelper.Get.currentTurnUserId(currentTurn) === localDbUser) {
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
            const updatedUsers = ArrOfObj.filterOut(users, 'userId', localDbUser);

            const updatedRoomState = GameHelper.SetRoomState.keysVals(roomData, [
               { key: 'users', value: updatedUsers },
               { key: 'gameState', value: updatedGameState },
            ]);
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
      navigation('/main/play', { replace: true });
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
