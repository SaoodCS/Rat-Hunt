import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';
import { FadeInOut } from '../../../../../global/components/lib/animation/fadeInOut/FadeInOut';
import Fader from '../../../../../global/components/lib/animation/fader/Fader';
import { FlexColumnWrapper } from '../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { FlexRowWrapper } from '../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import ConditionalRender from '../../../../../global/components/lib/renderModifiers/conditionalRender/ConditionalRender';
import { GameContext } from '../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../global/css/MyCSS';
import Color from '../../../../../global/css/colors';
import ArrOfObj from '../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../global/utils/GameHelper/GameHelper';
import { ItemLabel } from '../header/style/Style';
import ClueForm from './components/forms/clueForm/ClueForm';
import RatVoteForm from './components/forms/ratVoteForm/RatVoteForm';
import WordGuessForm from './components/forms/wordGuessForm/WordGuessForm';
import RoundSummary from './components/summary/RoundSummary';

const FormContainer = styled.div`
   box-sizing: border-box;
   padding-left: 1em;
   padding-right: 1em;
   filter: brightness(0.8);
   height: 100%;
   width: 100%;
   color: ${Color.darkThm.accentDarkerShade};
`;

const CurrentTurnAndFormWrapper = styled.div`
   border-bottom: 1px solid ${Color.darkThm.accentDarkerShade};
   width: 100%;
   box-sizing: border-box;
   height: 4em;
   display: flex;
   flex-direction: column;
   justify-content: center;
   font-size: 0.8em;
`;

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
         text: `${roomData?.gameState?.currentTurn}`,
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
               >
                  {gameplayHeadMap.map(({ text, condition, component }, index) => (
                     <ConditionalRender key={index} condition={condition}>
                        <ConditionalRender condition={!!text}>
                           <FadeInOut
                              style={{
                                 width: '100%',
                                 display: 'flex',
                                 alignItems: 'center',
                                 fontSize: '1.1em',
                              }}
                           >
                              <ItemLabel color={'yellow'} style={{ width: 'fit-content' }}>
                                 Current Turn:{HTMLEntities.space}
                                 {HTMLEntities.space} {text}
                              </ItemLabel>
                           </FadeInOut>
                        </ConditionalRender>
                        <ConditionalRender condition={!!component}>
                           <Fader
                              fadeInCondition={condition}
                              transitionDuration={0.5}
                              height="100%"
                              width="100%"
                           >
                              <FlexRowWrapper width="100%" height="100%" alignItems="center">
                                 <FormContainer>
                                    <WordGuessForm />
                                 </FormContainer>
                              </FlexRowWrapper>
                           </Fader>
                        </ConditionalRender>
                     </ConditionalRender>
                  ))}
               </FlexColumnWrapper>
            </CurrentTurnAndFormWrapper>
            {/* 
               </FlexRowWrapper>
               <GameStateTable />
            </FlexColumnWrapper> */}
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
