import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import GameHelper from '../../../../../../../shared/app/GameHelper/GameHelper';
import ArrayHelper from '../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';
import ArrOfObj from '../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import Fader from '../../../../../global/components/lib/animation/fader/Fader';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import CurrentTurnCountdown from './components/currentTurnCountdown/CurrentTurnCountdown';
import ClueForm from './components/forms/clueForm/ClueForm';
import RatVoteForm from './components/forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './components/forms/wordGuessForm/WordGuessForm';
import GameStateTable from './components/gameStateTable/GameStateTable';
import RoundSummary from './components/summary/RoundSummary';
import { CurrentTurnAndFormWrapper, FormContainer, GameStateTableWrapper } from './style/Style';

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
      // This useEffect handles the case of skipping the current turn if the current user is disconnected or spectating
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const connectedUsers = GameHelper.Get.connectedUserIds(roomData.gameState.userStates);
      const sortedConnectedUsers = ArrayHelper.sort(connectedUsers);
      if (localDbUser !== sortedConnectedUsers[0]) return;
      const shouldSkipTurn = GameHelper.Check.shouldSkipTurn(gameState);
      if (!shouldSkipTurn) return;
      const updatedGameState = GameHelper.SetGameState.skipCurrentTurn(gameState);
      updateGameStateMutation.mutate({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
   }, [roomData?.gameState?.currentTurn, localDbUser, roomData?.gameState.userStates]);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRat, currentTurn } = gameState;
      const ratUserState = ArrOfObj.getObj(userStates, 'userId', currentRat);
      if (!MiscHelper.isNotFalsyOrEmpty(ratUserState)) return;
      const isPlayerRat = currentRat === localDbUser;
      const allCluesExist = !ArrOfObj.hasKeyVal(userStates, 'clue', '');
      const allVotesExist = !ArrOfObj.hasKeyVal(userStates, 'votedFor', '');
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
         // eslint-disable-next-line no-irregular-whitespace
         text: `Current Turn  :  ${roomData?.gameState?.currentTurn}`,
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
            <CurrentTurnAndFormWrapper>
               <FlexColumnWrapper
                  height="100%"
                  justifyContent="center"
                  width="100%"
                  alignItems="start"
                  localStyles={screenStyles()}
               >
                  {gameplayHeadMap.map(({ text, condition, component }, index) => (
                     <ConditionalRender key={index} condition={condition}>
                        <Fader
                           fadeInCondition={condition}
                           transitionDuration={0.5}
                           height="100%"
                           width="100%"
                        >
                           <FlexRowWrapper
                              width="100%"
                              alignItems="center"
                              fontSize="0.9em"
                              padding="0em 1em 0em 1em"
                              position="relative"
                              color={'yellow'}
                              height="100%"
                              boxSizing="border-box"
                              justifyContent="center"
                           >
                              <ConditionalRender condition={!!text}>
                                 <TextColourizer color={'yellow'} textAlign="center">
                                    {text}
                                 </TextColourizer>
                                 <CurrentTurnCountdown />
                              </ConditionalRender>
                              <ConditionalRender condition={!!component}>
                                 <FormContainer>{component}</FormContainer>
                                 <CurrentTurnCountdown />
                              </ConditionalRender>
                           </FlexRowWrapper>
                        </Fader>
                     </ConditionalRender>
                  ))}
               </FlexColumnWrapper>
            </CurrentTurnAndFormWrapper>
            <GameStateTableWrapper>
               <GameStateTable />
            </GameStateTableWrapper>
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
      &:first-child {
         & > * {
            font-size: 1.1em;
         }
      }
   `);
   const forTablet = MyCSS.Media.tablet(css``);
   const medium = css`
      @media (min-width: 544px) {
         max-width: 35em;
         margin: 0 auto;
         align-items: center;
      }
   `;
   return MyCSS.Helper.concatStyles(forDesktop, forTablet, medium);
};
