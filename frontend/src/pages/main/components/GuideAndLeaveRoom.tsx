import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../class/FirestoreDb';
import RTDB from '../class/firebaseRTDB';
import { GameContext } from '../context/GameContext';

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
      setModalHeader('Help Guide');
      setModalContent(<p>Help Guide Component Goes Here</p>);
      setModalZIndex(100);
      toggleModal(true);
   }

   async function handleLeaveRoom(): Promise<void> {
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         const user = ArrayOfObjects.getObjWithKeyValuePair(roomData.users, 'userId', localDbUser);
         const isLastUser = roomData.users.length === 1;
         if (isLastUser) {
            await deleteRoomMutation.mutateAsync({ roomId: localDbRoom });
            await RTDB.deleteRoom(localDbRoom);
         } else {
            await deleteUserFromFs.mutateAsync({
               roomData: roomData,
               user: user,
            });
            await RTDB.deleteUser(localDbUser, localDbRoom);
         }
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
