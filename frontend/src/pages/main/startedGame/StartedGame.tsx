import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { Wrapper } from '../../../global/components/lib/positionModifiers/wrapper/Style';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { SplashScreenContext } from '../../../global/context/widget/splashScreen/SplashScreenContext';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import Gameplay from './components/gameplay/Gameplay';
import GameDetails from './components/header/GameDetails';
import RatOrPlayerSplash from './components/ratOrPlayerSplash/RatOrPlayerSplash';
import RoundSummary from './components/summary/RoundSummary';
import TopicBoard from './components/topicBoard/TopicBoard';
import {
   GameHeaderWrapper,
   GamePageWrapper,
   GameStateWrapper,
   TopicBoardWrapper,
} from './style/Style';

export default function StartedGame(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { toggleModal, setModalContent, setModalHeader } = useContext(ModalContext);
   const { toggleSplashScreen, setSplashScreenContent } = useContext(SplashScreenContext);
   const [showRoundSummary, setShowRoundSummary] = useState(false);

   useEffect(() => {
      // This useEffect handles the UI for when the currentRound changes.
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const thisUserState = GameHelper.Get.userState(localDbUser, userStates);
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      if (thisUserState.spectate === true && gamePhase !== 'roundSummary') {
         setModalHeader('Spectator Mode');
         setModalContent(<Wrapper padding="1.5em">You will begin in the next round</Wrapper>);
         toggleModal(true);
         return;
      }
      const isThisUserRat = localDbUser === gameState.currentRat;
      setSplashScreenContent(<RatOrPlayerSplash isUserRat={isThisUserRat} />);
      toggleSplashScreen(true);
   }, [roomData?.gameState?.currentRound]);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      if (gamePhase !== 'roundSummary') {
         setShowRoundSummary(false);
         return;
      }
      setShowRoundSummary(true);
   }, [roomData?.gameState?.currentTurn]);

   return (
      <GamePageWrapper>
         <GameHeaderWrapper>
            <GameDetails />
         </GameHeaderWrapper>
         <GameStateWrapper>{showRoundSummary ? <RoundSummary /> : <Gameplay />}</GameStateWrapper>
         <TopicBoardWrapper>
            <TopicBoard />
         </TopicBoardWrapper>
      </GamePageWrapper>
   );
}
