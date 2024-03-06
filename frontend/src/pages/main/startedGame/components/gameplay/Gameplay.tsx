import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import Fader from '../../../../../global/components/lib/animation/fader/Fader';
import AnimatedDots from '../../../../../global/components/lib/font/animatedDots/AnimatedDots';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import Color from '../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../utils/DBConnect/DBConnect';
import GameHelper from '../../../../../utils/GameHelper/GameHelper';
import { GameContext } from '../../../context/GameContext';
import ClueForm from './forms/clueForm/ClueForm';
import RatVoteForm from './forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './forms/wordGuessForm/WordGuessForm';
import GameDataTable from './gameDataTable/GameDataTable';
import { GameplayWrapper } from './style/Style';
import RoundSummary from './summary/components/roundSummary/RoundSummary';

export default function Gameplay(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [showClueForm, setShowClueForm] = useState(false);
   const [showRatVoteForm, setShowRatVoteForm] = useState(false);
   const [showWordGuessForm, setShowWordGuessForm] = useState(false);
   const [showRoundSummary, setShowRoundSummary] = useState(false);
   const [showRatGuessingMsg, setShowRatGuessingMsg] = useState(false);
   const [showCurrentTurnMsg, setShowCurrentTurnMsg] = useState(false);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState, users } = roomData;
      const connectedUsers = GameHelper.Get.connectedUserIds(roomData.users);
      if (localDbUser !== connectedUsers[0]) return;
      const { currentTurn, userStates, currentRat } = gameState;
      const disconnectedUsers = GameHelper.Get.disconnectedUserIds(users);
      const currentTurnUserIsDisconnected = disconnectedUsers.includes(currentTurn);
      if (!currentTurnUserIsDisconnected) return;
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         userStates,
         currentTurn,
         gamePhase,
         currentRat,
         disconnectedUsers,
      );
      const updatedUserStates = GameHelper.SetUserState.userKeyVal(
         userStates,
         currentTurn,
         gamePhase,
         'SKIP',
      );
      const updatedGameState: typeof gameState = {
         ...gameState,
         currentTurn: updatedCurrentTurn,
         userStates: updatedUserStates,
      };
      updateGameStateMutation.mutate({
         roomId: localDbRoom,
         gameState:
            gamePhase === 'guess'
               ? GameHelper.SetGameState.userPoints(updatedGameState)
               : updatedGameState,
      });
   }, [roomData?.gameState.currentTurn, localDbUser, roomData?.users]);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat, currentTurn } = gameState;
      const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', currentRat);
      if (!MiscHelper.isNotFalsyOrEmpty(ratUserState)) return;
      const isPlayerRat = currentRat === localDbUser;
      const allCluesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
      const allVotesExist = ArrayOfObjects.isKeyInAllObjsNotValuedAs(userStates, 'votedFor', '');
      const ratHasGuessedWord = MiscHelper.isNotFalsyOrEmpty(ratUserState.guess);
      const isYourTurn = currentTurn.replace('.wordGuess', '') === localDbUser;
      const ratIsGuessingWord = currentTurn.includes('.wordGuess');
      setShowRatGuessingMsg(!isYourTurn && ratIsGuessingWord);
      setShowCurrentTurnMsg(!isYourTurn && !ratIsGuessingWord);
      if (allCluesExist && allVotesExist && ratHasGuessedWord) {
         setShowClueForm(false);
         setShowRatVoteForm(false);
         setShowWordGuessForm(false);
         setShowRoundSummary(true);
         return;
      }
      setShowRoundSummary(false);
      setShowWordGuessForm(isYourTurn && allCluesExist && allVotesExist && isPlayerRat);
      setShowRatVoteForm(isYourTurn && allCluesExist && !allVotesExist);
      setShowClueForm(isYourTurn && !allCluesExist);
   }, [roomData?.gameState.currentTurn, localDbUser]);

   const gameplayHeadMap = [
      {
         component: <ClueForm />,
         condition: showClueForm,
      },
      {
         component: <RatVoteForm />,
         condition: showRatVoteForm,
      },
      {
         component: <WordGuessForm />,
         condition: showWordGuessForm,
      },
      {
         component: <RoundSummary />,
         condition: showRoundSummary,
      },
      {
         text: `Current Turn: ${roomData?.gameState.currentTurn}`,
         condition: showCurrentTurnMsg,
      },
      {
         text: 'The Rat is guessing the word',
         condition: showRatGuessingMsg,
      },
   ];

   return (
      <>
         <ConditionalRender condition={!showRoundSummary}>
            <GameplayWrapper>
               <FlexRowWrapper position="absolute" height="4em" width="100%">
                  {gameplayHeadMap.map(({ text, condition, component }, index) => (
                     <ConditionalRender key={index} condition={condition}>
                        <Fader
                           fadeInCondition={condition}
                           transitionDuration={0.5}
                           width="100%"
                           height="100%"
                        >
                           <ConditionalRender condition={!!component}>
                              {component}
                           </ConditionalRender>
                           <ConditionalRender condition={!!text}>
                              <LogoText
                                 size="1.25em"
                                 color={Color.setRgbOpacity(Color.darkThm.success, 0.75)}
                                 style={{ paddingTop: '0.25em' }}
                              >
                                 {text} <AnimatedDots count={3} />
                              </LogoText>
                           </ConditionalRender>
                        </Fader>
                     </ConditionalRender>
                  ))}
               </FlexRowWrapper>
               <GameDataTable />
            </GameplayWrapper>
         </ConditionalRender>
         <ConditionalRender condition={showRoundSummary}>
            <Fader fadeInCondition={showRoundSummary} transitionDuration={2} height={'100%'}>
               <RoundSummary />
            </Fader>
         </ConditionalRender>
      </>
   );
}
