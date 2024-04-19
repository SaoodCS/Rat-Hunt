import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import GameHelper from '../../../../../../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../../../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';
import Scroller from '../../../../../../../global/components/lib/scroller/Scroller';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import { CSS_Helper } from '../../../../../../../global/css/utils/helper';
import DBConnect from '../../../../../../../global/database/DBConnect/DBConnect';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from './style/Style';
import { CSS_Media } from '../../../../../../../global/css/utils/media';

export default function GameStateTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<AppTypes.UserState[]>();
   const [disconnectedUsers, setDisconnectedUsers] = useState<string[]>([]);
   const [gamePhase, setGamePhase] = useState<ReturnType<typeof GameHelper.Get.gamePhase>>();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const disconnectedUsers = GameHelper.Get.disconnectedUserIds(roomData?.gameState?.userStates);
      setDisconnectedUsers(disconnectedUsers);
   }, [roomData?.gameState?.userStates]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, turnQueue } = gameState;
      setSortedUserStates(GameHelper.Get.sortedUserStates(userStates, turnQueue));
      setGamePhase(GameHelper.Get.gamePhase(gameState));
   }, [roomData?.gameState?.userStates, localDbUser]);

   return (
      <TableContainer noOfColumns={3} localStyles={screenStyles(3)}>
         <TableHead>
            <TableCell>User</TableCell>
            <TableCell>Clue</TableCell>
            <TableCell>Voted For</TableCell>
         </TableHead>
         <TableBody>
            <Scroller withFader scrollbarWidth={8} dependencies={[roomData?.gameState?.userStates]}>
               {sortedUserStates?.map((user) => (
                  <TableRow
                     key={user.userId}
                     thisUser={localDbUser === user.userId}
                     currentTurn={(roomData?.gameState.currentTurn || '') === user.userId}
                     disconnected={disconnectedUsers.includes(user.userId)}
                     spectating={user.spectate}
                     gamePhase={gamePhase}
                  >
                     <TableCell>{user.userId}</TableCell>
                     <TableCell>{user.clue}</TableCell>
                     <TableCell>{user.votedFor}</TableCell>
                  </TableRow>
               ))}
            </Scroller>
         </TableBody>
      </TableContainer>
   );
}

const screenStyles = (noOfColumns: number): FlattenSimpleInterpolation => {
   const forDesktop = CSS_Media.Query.desktop(css`
      font-size: 1em;
   `);
   const forTablet = CSS_Media.Query.tablet(css``);
   const medium = css`
      @media (min-width: 544px) {
         ${TableHead} {
            justify-content: center;
         }
         ${TableRow} {
            justify-content: center;
         }
         ${TableCell} {
            max-width: calc(40em / ${noOfColumns});
         }
      }
   `;
   return CSS_Helper.concatStyles(forDesktop, forTablet, medium);
};
