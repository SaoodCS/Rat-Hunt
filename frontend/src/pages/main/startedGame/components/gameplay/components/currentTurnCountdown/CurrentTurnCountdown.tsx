import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import ArrayHelper from '../../../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { TimerBar } from './style/Style';

// CurrentTurnTimerFiller
export default function CurrentTurnCountdown(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
   const [countdownExpiry, setCountdownExpiry] = useState<number>(0);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   useEffect(() => {
      const interval = setInterval(() => {
         const newTimeRemaining = Math.floor((countdownExpiry - Date.now()) / 1000);
         setTimeRemaining(newTimeRemaining);
         if (newTimeRemaining <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
   }, [countdownExpiry]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { currentTurnChangedAt } = gameState;
      if (!currentTurnChangedAt) return;
      setCountdownExpiry(currentTurnChangedAt + GameHelper.CONSTANTS.TURN_TIME_LIMIT_MS);
   }, [roomData?.gameState?.currentTurnChangedAt]);

   useEffect(() => {
      if (timeRemaining === null) return;
      if (timeRemaining > 0) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const connectedUsers = GameHelper.Get.connectedUserIds(roomData.gameState.userStates);
      const sortedConnectedUsers = ArrayHelper.sort(connectedUsers);
      if (localDbUser !== sortedConnectedUsers[0]) return;
      const { gameState } = roomData;
      const updatedGameState = GameHelper.SetGameState.skipCurrentTurn(gameState);
      updateGameStateMutation.mutate({
         roomId: localDbRoom,
         gameState: updatedGameState,
      });
      setTimeRemaining(null);
   }, [timeRemaining]);

   return (
      <TimerBar
         timeRemainingSecs={timeRemaining || 0}
         timeGivenSecs={GameHelper.CONSTANTS.TURN_TIME_LIMIT_SECONDS}
      />
   );
}
