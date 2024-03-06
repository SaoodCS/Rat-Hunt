import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import Color from '../../../../../../../../global/css/colors';
import ArrayOfObjects from '../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../../utils/DBConnect/DBConnect';
import { GameContext } from '../../../../../../context/GameContext';
import { HeaderRowContainer, RowContainer, UserRowsWrapper } from '../../../gameDataTable/Style';
import { ScoreTableCell, ScoreTableWrapper } from '../../style/Style';

export default function ScoresTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const sortedUserStates = ArrayOfObjects.sort(userStates, 'totalScore', true);
      setSortedUserStates(sortedUserStates);
   }, [roomData?.gameState.userStates]);

   return (
      <FlexColumnWrapper width="50%" height="100%" boxSizing="border-box" position="relative">
         <ScoreTableWrapper>
            <HeaderRowContainer height="1.5em">
               <ScoreTableCell leftcell noOfTableRows={2}>
                  <LogoText size="0.9em">User</LogoText>
               </ScoreTableCell>
               <ScoreTableCell rightcell noOfTableRows={2}>
                  <LogoText size="0.9em">Score</LogoText>
               </ScoreTableCell>
            </HeaderRowContainer>
            <UserRowsWrapper headerRowHeight="1.5em">
               {sortedUserStates?.map((user) => (
                  <RowContainer key={user.userId} isThisUser={user.userId === localDbUser}>
                     <ScoreTableCell leftcell noOfTableRows={2}>
                        <LogoText size="0.9em">{user.userId}</LogoText>
                     </ScoreTableCell>
                     <ScoreTableCell rightcell noOfTableRows={2}>
                        <LogoText size="0.9em">
                           {user.totalScore}
                           {HTMLEntities.space} {HTMLEntities.space}
                        </LogoText>
                        <LogoText size="0.9em" style={{ color: Color.darkThm.success }}>
                           (+{user.roundScores[(roomData?.gameState.currentRound || 0) - 1]})
                        </LogoText>
                     </ScoreTableCell>
                  </RowContainer>
               ))}
            </UserRowsWrapper>
         </ScoreTableWrapper>
      </FlexColumnWrapper>
   );
}
