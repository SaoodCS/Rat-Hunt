import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import DateHelper from '../../../../../../../../../shared/lib/helpers/date/DateHelper';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { TimerBar } from './style/Style';
import axios from 'axios';

// CurrentTurnTimerFiller
export default function CurrentTurnCountdown(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
   const [countdownExpiry, setCountdownExpiry] = useState<number>(0);
   const updateGameStateMutation = DBConnect.FSDB.Set.gameState({}, false);

   useEffect(() => {
      const interval = setInterval(async () => {
         const currentTime = await DateHelper.getCurrentTime(axios);
         const newTimeRemaining = countdownExpiry - currentTime;
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
      setCountdownExpiry(currentTurnChangedAt + GameHelper.CONSTANTS.TURN_TIME_LIMIT_SECONDS);
   }, [roomData?.gameState?.currentTurnChangedAt]);

   useEffect(() => {
      if (timeRemaining === null) return;
      if (timeRemaining > 0) return;
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const connectedUsers = GameHelper.Get.connectedUserIds(roomData.gameState.userStates);
      if (localDbUser !== connectedUsers[0]) return;
      const { gameState } = roomData;
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
      setTimeRemaining(null);
   }, [timeRemaining]);

   return (
      <TimerBar
         timeRemainingSecs={timeRemaining || 0}
         timeGivenSecs={GameHelper.CONSTANTS.TURN_TIME_LIMIT_SECONDS}
      />
   );
}
