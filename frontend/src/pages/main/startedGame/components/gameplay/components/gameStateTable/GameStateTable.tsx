import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../global/css/MyCSS';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import useScrollFader from '../../../../../../../global/hooks/useScrollFader';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import GameHelper from '../../../../../../../global/utils/GameHelper/GameHelper';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from './style/Style';

export default function GameStateTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();
   const { faderElRef, handleScroll } = useScrollFader([roomData], 1);
   const [disconnectedUsers, setDisconnectedUsers] = useState<string[]>([]);
   const [gamePhase, setGamePhase] = useState<ReturnType<typeof GameHelper.Get.gamePhase>>();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { users } = roomData;
      const disconnectedUsers = GameHelper.Get.disconnectedUserIds(users);
      setDisconnectedUsers(disconnectedUsers);
   }, [roomData?.users]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates, currentRound } = gameState;
      setSortedUserStates(GameHelper.Get.sortedUserStates(currentRound, userStates));
      setGamePhase(GameHelper.Get.gamePhase(gameState));
   }, [roomData?.gameState?.userStates, localDbUser]);

   return (
      <TableContainer noOfColumns={3} localStyles={screenStyles(3)}>
         <TableHead>
            <TableCell>User</TableCell>
            <TableCell>Clue</TableCell>
            <TableCell>Voted For</TableCell>
         </TableHead>
         <TableBody ref={faderElRef} onScroll={(e) => handleScroll(e)}>
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
         </TableBody>
      </TableContainer>
   );
}

const screenStyles = (noOfColumns: number): FlattenSimpleInterpolation => {
   const forDesktop = MyCSS.Media.desktop(css`
      font-size: 1em;
   `);
   const forTablet = MyCSS.Media.tablet(css``);
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
   return MyCSS.Helper.concatStyles(forDesktop, forTablet, medium);
};
