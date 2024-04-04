import { SquareShareNodes } from '@styled-icons/fa-solid/SquareShareNodes';
import { useContext } from 'react';
import { ToastContext } from '../../../../../global/context/widget/toast/ToastContext';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import HTMLEntities from '../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import Device from '../../../../../global/helpers/pwa/deviceHelper';
import { RoomIDBtnContainer } from './Style';
import useLocalStorage from '../../../../../global/hooks/useLocalStorage';

export default function RoomIdBtn(): JSX.Element {
   const {
      toggleToast,
      setToastMessage,
      setWidth,
      setVerticalPos,
      setHorizontalPos,
      setToastZIndex,
   } = useContext(ToastContext);
   const [localDbRoom] = useLocalStorage(DBConnect.Local.STORAGE_KEYS.ROOM, '');

   async function shareRoomCode(): Promise<void> {
      if (!navigator.share) {
         await navigator.clipboard.writeText(localDbRoom);
         toggleToast(true);
         setToastMessage('Room Code Copied');
         setWidth('15em');
         setVerticalPos('bottom');
         setHorizontalPos('center');
         setToastZIndex(100);
         return;
      }
      await Device.shareContent({
         title: 'Play Rat Hunt With Me!',
         text: `Play Rat Hunt with me! Room code: ${localDbRoom}`,
      });
   }

   return (
      <RoomIDBtnContainer onClick={shareRoomCode}>
         Room ID:{HTMLEntities.space}
         {HTMLEntities.space}
         {localDbRoom}
         {HTMLEntities.space}
         {HTMLEntities.space}
         <SquareShareNodes size="1em" />
      </RoomIDBtnContainer>
   );
}
