import { useContext, useEffect, useState } from 'react';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import ArrayHelper from '../../../../../../../../../shared/lib/helpers/arrayHelper/ArrayHelper';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import NumberHelper from '../../../../../../../../../shared/lib/helpers/number/NumberHelper';
import { TextColourizer } from '../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { FlexRowWrapper } from '../../../../../../../global/components/lib/positionModifiers/flexRowWrapper/Style';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/colors';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';

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
            // TODO: then, improve the UI of the gameplay (the form and current turn part where the countdown is) for different screen sizes
            // TODO: after that is done, clean up the file / folder structure of the front-end project (esp in the pages folder) so that it's neatly organized
            // This logic handles the case of skipping the current turn if the current user takes too long to make a move (i.e. the countdown expires)
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
