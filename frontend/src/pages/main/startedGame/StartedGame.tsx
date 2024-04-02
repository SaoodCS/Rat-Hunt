import { useContext, useEffect } from 'react';
import { Wrapper } from '../../../global/components/lib/positionModifiers/wrapper/Style';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { SplashScreenContext } from '../../../global/context/widget/splashScreen/SplashScreenContext';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import Gameplay from './components/gameplay/Gameplay';
import GameHeader from './components/header/GameHeader';
import RatOrPlayerSplash from './components/ratOrPlayerSplash/RatOrPlayerSplash';
import TopicBoard from './components/topicBoard/TopicBoard';
import {
   GameHeaderWrapper,
   GamePageWrapper,
   GameplayWrapper,
   TopicBoardWrapper,
} from './style/Style';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import ArrOfObj from '../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';

export default function StartedGame(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { toggleModal, setModalContent, setModalHeader, setModalZIndex } =
      useContext(ModalContext);
   const { toggleSplashScreen, setSplashScreenContent } = useContext(SplashScreenContext);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const thisUserState = ArrOfObj.getObj(userStates, 'userId', localDbUser);
      if (!MiscHelper.isNotFalsyOrEmpty(thisUserState)) return;
      if (thisUserState?.spectate === true) {
         setModalHeader('Spectator Mode');
         setModalContent(
            <Wrapper padding="1.5em">
               You are spectating the current round as it has already started.
            </Wrapper>,
         );
         setModalZIndex(100);
         toggleModal(true);
         return;
      }
      const isThisUserRat = localDbUser === gameState?.currentRat;
      setSplashScreenContent(<RatOrPlayerSplash isUserRat={isThisUserRat} />);
      toggleSplashScreen(true);
   }, [roomData?.gameState?.currentRound]);

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
