import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import NumberHelper from '../../../../../../../../../shared/lib/helpers/number/NumberHelper';
import { FlexRowWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import Color from '../../../../../../../global/css/colors';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import ArrayHelper from '../../../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';

const TURN_TIME_LIMIT = NumberHelper.minsToMs(1);

export default function CurrentTurnCountdown(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState<string>('');
   const [countdownExpiry, setCountdownExpiry] = useState<number>(0);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   useEffect(() => {
      const interval = setInterval(() => {
         const timeRemaining = Math.floor((countdownExpiry - Date.now()) / 1000);
         if (timeRemaining <= 0) {
            // TODO: some of the logic here is similar to the first useEffect in Gameplay.tsx. May be worth refactoring to avoid duplication...
            if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
            const connectedUsers = GameHelper.Get.connectedUserIds(roomData.gameState.userStates);
            const sortedConnectedUsers = ArrayHelper.sort(connectedUsers);
            if (localDbUser !== sortedConnectedUsers[0]) return;
            const { gameState } = roomData;
            const { currentTurn, currentRat, userStates } = gameState;
            const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
            const currentGamePhase = GameHelper.Get.gamePhase(gameState);
            if (currentGamePhase === 'roundSummary') return;
            const isRoundSummaryPostSkip = currentGamePhase === 'guess';
            const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
               gameState,
               currentTurnUserId,
               currentGamePhase,
               currentRat,
            );
            const updatedUserStates = GameHelper.SetUserStates.updateUser(
               userStates,
               currentTurnUserId,
               [{ key: currentGamePhase, value: 'SKIP' }],
            );
            const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
               { key: 'currentTurn', value: updatedCurrentTurn },
               {
                  key: 'currentTurnChangedAt',
                  value: isRoundSummaryPostSkip ? '' : new Date().getTime(),
               },
               { key: 'userStates', value: updatedUserStates },
            ]);
            updateGameStateMutation.mutate({
               roomId: localDbRoom,
               gameState: isRoundSummaryPostSkip
                  ? GameHelper.SetGameState.userPoints(updatedGameState)
                  : updatedGameState,
            });

            clearInterval(interval);
            return;
         }
         setTimeRemainingInSeconds(NumberHelper.asSecondsStr(timeRemaining, true));
      }, 1000);
      return () => clearInterval(interval);
   }, [countdownExpiry]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentTurnChangedAt } = gameState;
      if (!currentTurnChangedAt) return;
      setCountdownExpiry(currentTurnChangedAt + TURN_TIME_LIMIT);
   }, [roomData?.gameState?.currentTurnChangedAt]);

   return (
      <FlexRowWrapper>
         <TextColourizer color={Color.darkThm.warning}>{timeRemainingInSeconds}</TextColourizer>
      </FlexRowWrapper>
   );
}
