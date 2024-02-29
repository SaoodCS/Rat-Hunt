import { useContext, useEffect, useState } from 'react';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../../../class/FirestoreDb';
import { GameContext } from '../../../context/GameContext';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import ClueForm from './clueForm/ClueForm';
import RatVoteForm from './ratVoteForm/RatVoteForm';
import WordGuessForm from './wordGuessForm/WordGuessForm';
import RoundSummary from '../summary/RoundSummary';
import GameSummary from '../summary/GameSummary';

// changing turns:
// - if the current user is the last user to submit a clue, then change the current user to the first user in the userStates array
// - if current user is not the last user to submit a clue, then change the current user to the next user in the userStates array
// - if the current user is the last user to submit a vote, then change the current user to the rat user
// - if the current user is not the last user to submit a vote, then change the current user to the next user in the userStates array
// - if the current user is the rat user and they have submitted the word guess, then:
//   - if the round was not the last round, change the currentUser to the first user in array, display a summary component which tells the users the word, who the rat was, and whether the rat guessed the word correctly. Also display a "next round" button. When submitted, change the currentRound number to the next number
//   - if the round was the last round, change the currentUser to the first user in array, display a summary component which summarises the game, who won, and the scores. Also display a "play again" and "leave game" button

export default function InputHeader(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [showClueForm, setShowClueForm] = useState(false);
   const [showRatVoteForm, setShowRatVoteForm] = useState(false);
   const [showWordGuessForm, setShowWordGuessForm] = useState(false);
   const [showRoundSummary, setShowRoundSummary] = useState(false);
   const [showGameSummary, setShowGameSummary] = useState(false);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat } = gameState;
      const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', currentRat);
      if (!MiscHelper.isNotFalsyOrEmpty(ratUserState)) return;
      const isPlayerRat = currentRat === localDbUser;
      const allCluesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
      const allVotesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'votedFor', '');
      const ratHasGuessedWord = MiscHelper.isNotFalsyOrEmpty(ratUserState.guess);
      const isLastRound = gameState.currentRound === gameState.numberOfRoundsSet;
      const isYourTurn = gameState.currentTurn === localDbUser;

      if (allCluesExist && allVotesExist && ratHasGuessedWord) {
         setShowClueForm(false);
         setShowRatVoteForm(false);
         setShowWordGuessForm(false);
         setShowGameSummary(isLastRound);
         setShowRoundSummary(!isLastRound);
         return;
      }

      if (isYourTurn) {
         setShowWordGuessForm(allCluesExist && allVotesExist && isPlayerRat);
         setShowRatVoteForm(allCluesExist && !allVotesExist);
         setShowClueForm(!allCluesExist);
         // return;
      }
   }, [roomData?.gameState.currentTurn, localDbUser]);

   return (
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
         <ConditionalRender condition={showRoundSummary}>
            <RoundSummary />
         </ConditionalRender>
         <ConditionalRender condition={showGameSummary}>
            <GameSummary />
         </ConditionalRender>
      </FlexRowWrapper>
   );
}
