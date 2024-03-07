import { useContext, useEffect } from 'react';
import Gameplay from './components/gameplay/Gameplay';
import GameHeader from './components/header/GameHeader';
import TopicBoard from './components/topicBoard/TopicBoard';
import {
   GameHeaderWrapper,
   GamePageWrapper,
   GameplayWrapper,
   TopicBoardWrapper,
} from './style/Style';
import DBConnect from '../../../global/utils/DBConnect/DBConnect';
import { GameContext } from '../../../global/context/game/GameContext';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrOfObj from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';

export default function StartedGame(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const thisUserState = ArrOfObj.findObj(userStates, 'userId', localDbUser);
      const { spectate } = thisUserState;
      if (!spectate) return;
      setModalHeader('Spectator Mode');
      setModalContent(<>You are spectating the current round as it has already started.</>);
      setModalZIndex(100);
      toggleModal(true);
   }, []);

   return (
      <GamePageWrapper>
         <GameHeaderWrapper>
            <GameHeader />
         </GameHeaderWrapper>
         <GameplayWrapper>
            <Gameplay />
         </GameplayWrapper>
         <TopicBoardWrapper>
            <TopicBoard />
         </TopicBoardWrapper>
      </GamePageWrapper>
   );
}
