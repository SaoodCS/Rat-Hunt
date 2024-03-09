import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import Fader from '../../../../../global/components/lib/animation/fader/Fader';
import AnimatedDots from '../../../../../global/components/lib/font/animatedDots/AnimatedDots';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import Color from '../../../../../global/css/colors';
import ArrOfObj from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../global/utils/GameHelper/GameHelper';
import ClueForm from './components/forms/clueForm/ClueForm';
import RatVoteForm from './components/forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './components/forms/wordGuessForm/WordGuessForm';
import GameStateTable from './components/gameStateTable/GameStateTable';
import RoundSummary from './components/summary/RoundSummary';

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
      const spectatingUsers = GameHelper.Get.spectatingUserIds(userStates);
      const currentTurnUserIsDisconnected = disconnectedUsers.includes(currentTurn);
      const currentTurnUserIsSpectating = spectatingUsers.includes(currentTurn);
      if (!(currentTurnUserIsDisconnected || currentTurnUserIsSpectating)) return;
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      if (gamePhase === 'roundSummary') return;
      const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
         userStates,
         currentTurn,
         gamePhase,
         currentRat,
      );
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, currentTurn, [
         { key: gamePhase, value: 'SKIP' },
      ]);
      const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
         { key: 'currentTurn', value: updatedCurrentTurn },
         { key: 'userStates', value: updatedUserStates },
      ]);
      updateGameStateMutation.mutate({
         roomId: localDbRoom,
         gameState:
            gamePhase === 'guess'
               ? GameHelper.SetGameState.userPoints(updatedGameState)
               : updatedGameState,
      });
   }, [roomData?.gameState?.currentTurn, localDbUser, roomData?.users]);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat, currentTurn } = gameState;
      const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
      if (!MiscHelper.isNotFalsyOrEmpty(ratUserState)) return;
      const isPlayerRat = currentRat === localDbUser;
      const allCluesExist = ArrOfObj.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
      const allVotesExist = ArrOfObj.isKeyInAllObjsNotValuedAs(userStates, 'votedFor', '');
      const ratHasGuessedWord = MiscHelper.isNotFalsyOrEmpty(ratUserState.guess);
      const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
      const isYourTurn = currentTurnUserId === localDbUser;
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
   }, [roomData?.gameState?.currentTurn, localDbUser]);

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
         text: `Current Turn: ${roomData?.gameState?.currentTurn}`,
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
            <FlexColumnWrapper
               position="relative"
               height="100%"
               padding="1em 1em 1em 1em"
               boxSizing="border-box"
               localStyles={screenStyles()}
            >
               <FlexRowWrapper position="absolute" height="3em" width="100%">
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
                                 style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                              >
                                 {text} <AnimatedDots count={3} />
                              </LogoText>
                           </ConditionalRender>
                        </Fader>
                     </ConditionalRender>
                  ))}
               </FlexRowWrapper>
               <GameStateTable />
            </FlexColumnWrapper>
         </ConditionalRender>
         <ConditionalRender condition={showRoundSummary}>
            <Fader fadeInCondition={showRoundSummary} transitionDuration={2} height={'100%'}>
               <RoundSummary />
            </Fader>
         </ConditionalRender>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1.1em;
      & > :first-child {
         width: 25em;
         text-align: center;
         align-self: center;
      }
      & > :nth-child(2) {
         margin-left: 8em;
         margin-right: 8em;
      }
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   return MyCSS.Helper.concatStyles(forDesktop, forTablet);
};
