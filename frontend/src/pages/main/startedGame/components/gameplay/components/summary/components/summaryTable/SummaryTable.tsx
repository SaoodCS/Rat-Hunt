import { useContext, useEffect, useState } from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';
import type AppTypes from '../../../../../../../../../../../shared/app/types/AppTypes';
import { TextColourizer } from '../../../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import MyCSS from '../../../../../../../../../global/css/MyCSS';
import DBConnect from '../../../../../../../../../global/database/DBConnect/DBConnect';
import HTMLEntities from '../../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import useScrollFader from '../../../../../../../../../global/hooks/useScrollFader';
import {
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
} from '../../../gameStateTable/style/Style';
import ArrOfObj from '../../../../../../../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../../../../../shared/lib/helpers/miscHelper/MiscHelper';

export default function SummaryTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const { faderElRef, handleScroll } = useScrollFader([roomData], 1);
   const [sortedUserStates, setSortedUserStates] = useState<AppTypes.UserState[]>();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const sortedUserStates = ArrOfObj.sort(userStates, 'totalScore', true);
      setSortedUserStates(sortedUserStates);
   }, [roomData?.gameState?.userStates]);

   return (
      <TableContainer noOfColumns={2} fontSize="1em" innerBorders localStyles={screenStyles(2)}>
         <TableHead>
            <TableCell>User</TableCell>
            <TableCell>Score</TableCell>
         </TableHead>
         <TableBody ref={faderElRef} onScroll={(e) => handleScroll(e)}>
            {sortedUserStates?.map(({ userId, totalScore, roundScores }) => (
               <TableRow key={userId} thisUser={userId === localDbUser}>
                  <TableCell>{userId}</TableCell>
                  <TableCell>
                     {totalScore}
                     {HTMLEntities.space} {HTMLEntities.space}
                     <TextColourizer>
                        {`+ (${roundScores[(roomData?.gameState.currentRound || 0) - 1] || 0})`}
                     </TextColourizer>
                  </TableCell>
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
