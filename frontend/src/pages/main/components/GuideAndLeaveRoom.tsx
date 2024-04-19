import { LogOut } from '@styled-icons/boxicons-regular/LogOut';
import { Share } from '@styled-icons/fluentui-system-regular/Share';
import { Help } from '@styled-icons/ionicons-outline/Help';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { ToastContext } from '../../../global/context/widget/toast/ToastContext';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import Device from '../../../global/helpers/pwa/deviceHelper';
import HelpGuide from './HelpGuide';
import useCustomNavigate from '../../../global/hooks/useCustomNavigate';
import { LoaderContext } from '../../../global/context/widget/loader/LoaderContext';

interface IGuideAndLeaveRoom {
   currentPath: string;
}

export default function GuideAndLeaveRoom(props: IGuideAndLeaveRoom): JSX.Element {
   const { currentPath } = props;
   const { setModalContent, setModalHeader, toggleModal } = useContext(ModalContext);
   const { toggleToast, setToastMessage, setWidth, setVerticalPos, setHorizontalPos } =
      useContext(ToastContext);
   const { localDbRoom, localDbUser, setLocalDbRoom, setLocalDbUser } = useContext(GameContext);
   const [isWaitingPage, setIsWaitingPage] = useState(currentPath.includes('waiting'));
   const [isStartedGamePage, setIsStartedGamePage] = useState(currentPath.includes('started'));
   const [isPlayPage, setIsPlayPage] = useState(currentPath.includes('play'));
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const navigation = useCustomNavigate();
   const queryClient = useQueryClient();
   const { toggleLoader } = useContext(LoaderContext);

   useEffect(() => {
      setIsWaitingPage(currentPath.includes('waiting'));
      setIsStartedGamePage(currentPath.includes('started'));
      setIsPlayPage(currentPath.includes('play'));
   }, [currentPath]);

   function handleHelpGuide(): void {
      setModalHeader('How To Play?');
      setModalContent(<HelpGuide />);
      toggleModal(true);
   }

   async function handleLeaveRoom(): Promise<void> {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      toggleLoader(true);
      await DBConnect.RTDB.Delete.user(localDbUser, localDbRoom);
      setLocalDbRoom('');
      setLocalDbUser('');
      queryClient.clear();
      toggleLoader(false);
      navigation('/main/play');
   }

   async function shareApp(): Promise<void> {
      if (!navigator.share) {
         await navigator.clipboard.writeText(Device.getBaseURL());
         toggleToast(true);
         setToastMessage('Link Copied');
         setWidth('15em');
         setVerticalPos('bottom');
         setHorizontalPos('center');
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
