import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useContext } from 'react';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, setModalZIndex, toggleModal } =
      useContext(ModalContext);

   function handleHelpGuide(): void {
      setModalHeader('Help Guide');
      setModalContent(<p>Help Guide Component Goes Here</p>);
      setModalZIndex(100);
      toggleModal(true);
   }

   function handleLeaveRoom(): void {
      setModalHeader('Leave Room');
      setModalContent(<p>Leave Room Confirmation and onClick Button Goes Here</p>);
      setModalZIndex(100);
      toggleModal(true);
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
