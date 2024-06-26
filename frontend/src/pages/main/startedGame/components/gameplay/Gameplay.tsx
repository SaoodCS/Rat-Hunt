/* eslint-disable no-irregular-whitespace */
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import GameHelper from '../../../../../../../shared/app/GameHelper/GameHelper';
import MiscHelper from '../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { TextColourizer } from '../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../global/context/game/GameContext';
import { CSS_Helper } from '../../../../../global/css/utils/helper';
import DBConnect from '../../../../../global/database/DBConnect/DBConnect';
import CurrentTurnCountdown from './components/currentTurnCountdown/CurrentTurnCountdown';
import ClueForm from './components/forms/clueForm/ClueForm';
import RatVoteForm from './components/forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './components/forms/wordGuessForm/WordGuessForm';
import GameStateTable from './components/gameStateTable/GameStateTable';
import {
   CurrentTurnAndFormItem,
   CurrentTurnAndFormWrapper,
   FormContainer,
   GameStateTableWrapper,
} from './style/Style';
import { CSS_Media } from '../../../../../global/css/utils/media';

export default function Gameplay(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [showClueForm, setShowClueForm] = useState(false);
   const [showRatVoteForm, setShowRatVoteForm] = useState(false);
   const [showWordGuessForm, setShowWordGuessForm] = useState(false);
   const [showRatGuessingMsg, setShowRatGuessingMsg] = useState(false);
   const [showCurrentTurnMsg, setShowCurrentTurnMsg] = useState(false);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   useEffect(() => {
      // This useEffect handles the case of skipping the current turn if the current user is disconnected or spectating
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const connectedUsers = GameHelper.Get.connectedUserIds(roomData.gameState.userStates);
      if (localDbUser !== connectedUsers[0]) return;
      const shouldSkipTurn = GameHelper.Check.shouldSkipTurn(gameState);
      if (!shouldSkipTurn) return;
      GameHelper.SetGameState.skipCurrentTurn(gameState, axios)
         .then((updatedGameState) => {
            updateGameStateMutation.mutate({
               roomId: localDbRoom,
               gameState: updatedGameState,
            });
         })
         .catch((error) => {
            console.error('Error in skipping turn: ', error);
         });
   }, [roomData?.gameState?.currentTurn, localDbUser, roomData?.gameState?.userStates]);

   useEffect(() => {
      // This useEffect is responsble for updating the UI when the currentTurn changes
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentTurn } = gameState;
      const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
      const isYourTurn = currentTurnUserId === localDbUser;
      const gamePhase = GameHelper.Get.gamePhase(gameState);
      setShowRatGuessingMsg(!isYourTurn && gamePhase === 'guess');
      setShowCurrentTurnMsg(!isYourTurn && gamePhase !== 'guess');
      setShowWordGuessForm(isYourTurn && gamePhase === 'guess');
      setShowRatVoteForm(isYourTurn && gamePhase === 'votedFor');
      setShowClueForm(isYourTurn && gamePhase === 'clue');
   }, [roomData?.gameState?.currentTurn, localDbUser]);

   const gameplayHeadMap = [
      { component: <ClueForm />, condition: showClueForm },
      { component: <RatVoteForm />, condition: showRatVoteForm },
      { component: <WordGuessForm />, condition: showWordGuessForm },
      {
         text: `Current Turn  :  ${roomData?.gameState?.currentTurn}`,
         condition: showCurrentTurnMsg,
      },
      { text: 'The Rat is guessing the word', condition: showRatGuessingMsg },
   ];

   return (
      <>
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
                     <CurrentTurnAndFormItem>
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
                     </CurrentTurnAndFormItem>
                  </ConditionalRender>
               ))}
            </FlexColumnWrapper>
         </CurrentTurnAndFormWrapper>
         <GameStateTableWrapper>
            <GameStateTable />
         </GameStateTableWrapper>
      </>
   );
}

const screenStyles = (): FlattenSimpleInterpolation => {
   const forDesktop = CSS_Media.Query.desktop(css`
      &:first-child {
         & > * {
            font-size: 1.1em;
         }
      }
   `);
   const forTablet = CSS_Media.Query.tablet(css``);
   const medium = css`
      @media (min-width: 544px) {
         max-width: 35em;
         margin: 0 auto;
         align-items: center;
      }
   `;
   return CSS_Helper.concatStyles(forDesktop, forTablet, medium);
};
