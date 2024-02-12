import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useContext } from 'react';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../class/FirestoreDb';
import { GameContext } from '../context/GameContext';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

function LeaveRoomModal(): JSX.Element {
   return <p>Leave Room Confirmation and onClick Button Goes Here</p>;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const deleteUserFromFs = FirestoreDB.Room.deleteUserMutation({});

   function handleHelpGuide(): void {
      setModalHeader('Help Guide');
      setModalContent(<p>Help Guide Component Goes Here</p>);
      setModalZIndex(100);
      toggleModal(true);
   }

   async function handleLeaveRoom(): Promise<void> {
      // setModalHeader('Leave Room');
      // setModalContent(<LeaveRoomModal />);
      // setModalZIndex(100);
      // toggleModal(true);
      // get the user from the room:
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         const user = roomData.users.find((u) => u.userId === localDbUser);
         await deleteUserFromFs.mutateAsync({
            roomData: roomData,
            user: user,
         });
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
