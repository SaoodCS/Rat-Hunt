import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import Fader from '../../../../../global/components/lib/animation/fader/Fader';
import AnimatedDots from '../../../../../global/components/lib/font/animatedDots/AnimatedDots';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../../../class/FirestoreDb';
import { GameContext } from '../../../context/GameContext';
import ClueForm from './forms/clueForm/ClueForm';
import RatVoteForm from './forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './forms/wordGuessForm/WordGuessForm';
import GameDataTable from './gameDataTable/GameDataTable';
import { GameplayWrapper } from './style/Style';
import RoundSummary from './summary/components/roundSummary/RoundSummary';

export default function Gameplay(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [showClueForm, setShowClueForm] = useState(false);
   const [showRatVoteForm, setShowRatVoteForm] = useState(false);
   const [showWordGuessForm, setShowWordGuessForm] = useState(false);
   const [showRoundSummary, setShowRoundSummary] = useState(false);
   const [showGameSummary, setShowGameSummary] = useState(false);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat, currentRound, numberOfRoundsSet, currentTurn } = gameState;
      const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', currentRat);
      if (!MiscHelper.isNotFalsyOrEmpty(ratUserState)) return;
      const isPlayerRat = currentRat === localDbUser;
      const allCluesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
      const allVotesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'votedFor', '');
      const ratHasGuessedWord = MiscHelper.isNotFalsyOrEmpty(ratUserState.guess);
      const isLastRound = currentRound === numberOfRoundsSet;
      const isYourTurn = currentTurn.replace('.wordGuess', '') === localDbUser;
      if (allCluesExist && allVotesExist && ratHasGuessedWord) {
         setShowClueForm(false);
         setShowRatVoteForm(false);
         setShowWordGuessForm(false);
         setShowGameSummary(isLastRound);
         setShowRoundSummary(!isLastRound);
         return;
      }
      setShowGameSummary(false);
      setShowRoundSummary(false);
      setShowWordGuessForm(isYourTurn && allCluesExist && allVotesExist && isPlayerRat);
      setShowRatVoteForm(isYourTurn && allCluesExist && !allVotesExist);
      setShowClueForm(isYourTurn && !allCluesExist);
   }, [roomData?.gameState.currentTurn, localDbUser]);

   return (
      <>
         <ConditionalRender condition={!showGameSummary && !showRoundSummary}>
            <GameplayWrapper>
               <FlexRowWrapper position="absolute" height="4em" width="100%">
                  <ConditionalRender condition={showClueForm}>
                     <ClueForm />
                  </ConditionalRender>
                  <ConditionalRender condition={showRatVoteForm}>
                     <RatVoteForm />
                  </ConditionalRender>
                  <ConditionalRender condition={showWordGuessForm}>
                     <WordGuessForm />
                  </ConditionalRender>
                  <ConditionalRender
                     condition={
                        roomData?.gameState.currentTurn.replace('.wordGuess', '') !== localDbUser &&
                        !showRoundSummary
                     }
                  >
                     <LogoText
                        size="1.1em"
                        color={Color.setRgbOpacity(Color.darkThm.success, 0.75)}
                     >
                        <ConditionalRender
                           condition={!roomData?.gameState.currentTurn.includes('.wordGuess')}
                        >
                           Current Turn: {roomData?.gameState.currentTurn}
                        </ConditionalRender>
                        <ConditionalRender
                           condition={!!roomData?.gameState.currentTurn.includes('.wordGuess')}
                        >
                           The Rat is guessing the word
                        </ConditionalRender>
                        <AnimatedDots count={3} />
                     </LogoText>
                  </ConditionalRender>
               </FlexRowWrapper>
               <GameDataTable />
            </GameplayWrapper>
         </ConditionalRender>
         <ConditionalRender condition={showRoundSummary || showGameSummary}>
            <Fader
               fadeInCondition={showRoundSummary || showGameSummary}
               transitionDuration={3}
               height={'100%'}
            >
               <RoundSummary />
            </Fader>
         </ConditionalRender>
      </>
   );
}
