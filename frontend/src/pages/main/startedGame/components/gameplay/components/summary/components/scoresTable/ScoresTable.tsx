import { useContext, useEffect, useRef, useState } from 'react';
import { LogoText } from '../../../../../../../../../global/components/app/logo/LogoText';
import { FlexColumnWrapper } from '../../../../../../../../../global/components/lib/positionModifiers/flexColumnWrapper/FlexColumnWrapper';
import { GameContext } from '../../../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import HTMLEntities from '../../../../../../../../../global/helpers/dataTypes/htmlEntities/HTMLEntities';
import MiscHelper from '../../../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../../../global/utils/DBConnect/DBConnect';
import {
   HeaderRowContainer,
   RowContainer,
   UserRowsWrapper,
} from '../../../gameStateTable/style/Style';
import { ScoreTableCell, ScoreTableWrapper } from './style/Style';

export default function ScoresTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();
   const userRowsWrapperRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
         const userRowsWrapperDiv = entries[0].target as HTMLDivElement;
         const maskImage =
            userRowsWrapperDiv.scrollHeight <= userRowsWrapperDiv.clientHeight + 1
               ? 'none'
               : 'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
         userRowsWrapperDiv.style.maskImage = maskImage;
      });
      if (userRowsWrapperRef.current) {
         resizeObserver.observe(userRowsWrapperRef.current);
      }
      return () => {
         resizeObserver.disconnect();
      };
   }, [roomData]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      const sortedUserStates = ArrOfObj.sort(userStates, 'totalScore', true);
      setSortedUserStates(sortedUserStates);
   }, [roomData?.gameState.userStates]);

   function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>): void {
      const userRowsWrapperDiv = e.target as HTMLDivElement;
      const scrollTop = userRowsWrapperDiv.scrollTop;
      if (scrollTop + userRowsWrapperDiv.clientHeight >= userRowsWrapperDiv.scrollHeight - 1) {
         userRowsWrapperDiv.style.maskImage = 'none';
      } else {
         userRowsWrapperDiv.style.maskImage =
            'linear-gradient(to bottom, black calc(100% - 48px), transparent 100%)';
      }
   }

   return (
      <FlexColumnWrapper width="50%" height="100%" boxSizing="border-box" position="relative">
         <ScoreTableWrapper>
            <HeaderRowContainer height="1.75em">
               <ScoreTableCell leftcell noOfTableRows={2}>
                  <LogoText size="0.9em">User</LogoText>
               </ScoreTableCell>
               <ScoreTableCell rightcell noOfTableRows={2}>
                  <LogoText size="0.9em">Score</LogoText>
               </ScoreTableCell>
            </HeaderRowContainer>
            <UserRowsWrapper
               headerRowHeight="2.25em"
               ref={userRowsWrapperRef}
               onScroll={handleScroll}
            >
               {sortedUserStates?.map((user) => (
                  <RowContainer key={user.userId} isThisUser={user.userId === localDbUser}>
                     <ScoreTableCell leftcell noOfTableRows={2}>
                        <LogoText
                           size="0.9em"
                           style={{
                              wordWrap: 'break-word',
                              textOverflow: 'ellipsis',
                              hyphens: 'auto',
                           }}
                        >
                           {user.userId}
                        </LogoText>
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
