import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../shared/app/GameHelper/GameHelper';
import ArrOfObj from '../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { Wrapper } from '../../../global/components/lib/positionModifiers/wrapper/Style';
import ConditionalRender from '../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../global/context/game/GameContext';
import { ModalContext } from '../../../global/context/widget/modal/ModalContext';
import { SplashScreenContext } from '../../../global/context/widget/splashScreen/SplashScreenContext';
import DBConnect from '../../../global/database/DBConnect/DBConnect';
import Gameplay from './components/gameplay/Gameplay';
import GameDetails from './components/header/GameDetails';
import RatOrPlayerSplash from './components/ratOrPlayerSplash/RatOrPlayerSplash';
import TopicBoard from './components/topicBoard/TopicBoard';
import WinnerLoserSplash from './components/winnerLoserSplash/WinnerLoserSplash';
import {
   GameHeaderWrapper,
   GamePageWrapper,
   GameplayWrapper,
   TopicBoardWrapper,
} from './style/Style';
import RoundSummary from './components/summary/RoundSummary';

export default function StartedGame(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { toggleModal, setModalContent, setModalHeader } = useContext(ModalContext);
   const { toggleSplashScreen, setSplashScreenContent, isSplashScreenDisplayed } =
      useContext(SplashScreenContext);
   const [showRoundSummary, setShowRoundSummary] = useState(false);

   useEffect(() => {
      // This useEffect handles the UI for when the currentRound changes.
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const thisUserState = GameHelper.Get.userState(localDbUser, userStates);
      if (thisUserState.spectate === true) {
         setModalHeader('Spectator Mode');
         setModalContent(<Wrapper padding="1.5em">The current round has already started</Wrapper>);
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
      const { userStates } = gameState;
      const allCluesExist = !ArrOfObj.hasKeyVal(userStates, 'clue', '');
      const allVotesExist = !ArrOfObj.hasKeyVal(userStates, 'votedFor', '');
      const ratHasGuessedWord = GameHelper.Check.hasRatGuessed(gameState);
      if (allCluesExist && allVotesExist && ratHasGuessedWord) {
         setSplashScreenContent(<WinnerLoserSplash />);
         toggleSplashScreen(true);
         setShowRoundSummary(true);
         return;
      }
      setShowRoundSummary(false);
   }, [roomData?.gameState?.currentTurn]);

   return (
      <ConditionalRender condition={!isSplashScreenDisplayed}>
         <GamePageWrapper>
            <GameHeaderWrapper>
               <GameDetails />
            </GameHeaderWrapper>
            <GameplayWrapper>{showRoundSummary ? <RoundSummary /> : <Gameplay />}</GameplayWrapper>
            <TopicBoardWrapper>
               <TopicBoard />
            </TopicBoardWrapper>
         </GamePageWrapper>
      </ConditionalRender>
   );
}
