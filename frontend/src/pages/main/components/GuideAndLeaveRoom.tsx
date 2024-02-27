import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref } from 'firebase/database';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { firebaseRTDB } from '../../../global/firebase/config/config';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../class/FirestoreDb';
import RTDB from '../class/firebaseRTDB';
import { GameContext } from '../context/GameContext';
import HelpGuide from './HelpGuide';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const { localDbRoom, localDbUser, setLocalDbRoom, setLocalDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const deleteUserFromFs = FirestoreDB.Room.deleteUserMutation({});
   const deleteRoomMutation = FirestoreDB.Room.deleteRoomMutation({});
   const navigation = useNavigate();

   function handleHelpGuide(): void {
      setModalHeader('How To Play?');
      setModalContent(<HelpGuide />);
      setModalZIndex(100);
      toggleModal(true);
   }

   async function handleLeaveRoom(): Promise<void> {
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         const isLastUser = roomData.users.length === 1;
         if (isLastUser) {
            await deleteRoomMutation.mutateAsync({ roomId: localDbRoom });
            await RTDB.deleteRoom(localDbRoom);
         } else {
            await deleteUserFromFs.mutateAsync({
               roomData: roomData,
               userId: localDbUser,
            });
            await RTDB.deleteUser(localDbUser, localDbRoom);
         }
         const userStatusRef: DatabaseReference = ref(
            firebaseRTDB,
            `/rooms/${localDbRoom}/${localDbUser}`,
         );
         await onDisconnect(userStatusRef).cancel();
         setLocalDbRoom('');
         setLocalDbUser('');
         navigation('/main/play');
      }
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
