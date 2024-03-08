import { useContext, useEffect, useRef, useState } from 'react';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import Color from '../../../../../../../global/css/colors';
import ArrOfObj from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import {
   Cell,
   DataTableWrapper,
   HeaderRowContainer,
   RowContainer,
   UserRowsWrapper,
} from './style/Style';

export default function GameStateTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();
   const contentWrapperDiv = useRef<HTMLDivElement>(null);
   const userRowsWrapperDiv = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!contentWrapperDiv.current || !userRowsWrapperDiv.current) return;
      const contentWrapperHeight = contentWrapperDiv.current.clientHeight;
      const userRowsWrapperHeight = userRowsWrapperDiv.current.clientHeight;
      const borderStyle = `1px solid ${Color.darkThm.accent}`;
      userRowsWrapperDiv.current.style.borderBottom =
         contentWrapperHeight >= userRowsWrapperHeight ? borderStyle : 'none';
   }, [contentWrapperDiv.current, userRowsWrapperDiv.current]);

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      setSortedUserStates(ArrOfObj.sort(userStates, 'userId'));
   }, [roomData?.gameState?.userStates, localDbUser]);

   function valueCol(userState: DBConnect.FSDB.I.UserState): string {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return 'disconnected';
      if (!MiscHelper.isNotFalsyOrEmpty(userState)) return 'disconnected';
      const { users } = roomData;
      const thisUser = ArrOfObj.findObj(users, 'userId', userState.userId);
      const isSpectating = userState.spectate;
      const isDisconnected = thisUser?.userStatus === 'disconnected';
      if (isDisconnected || isSpectating) return Color.setRgbOpacity(Color.darkThm.txt, 0.35);
      return '';
   }

   return (
      <DataTableWrapper style={{ marginBottom: '1em' }}>
         <HeaderRowContainer height="2.5em">
            <Cell>
               <LogoText size="1em"> User</LogoText>
            </Cell>
            <Cell>
               <LogoText size="1em"> Clue</LogoText>
            </Cell>
            <Cell>
               <LogoText size="1em"> Voted For</LogoText>
            </Cell>
         </HeaderRowContainer>
         <UserRowsWrapper headerRowHeight="3em" ref={userRowsWrapperDiv}>
            <div ref={contentWrapperDiv}>
               {sortedUserStates?.map((user) => (
                  <RowContainer
                     key={user.userId}
                     isThisUser={user.userId === localDbUser}
                     currentTurn={user.userId === roomData?.gameState.currentTurn}
                  >
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.userId}
                        </LogoText>
                     </Cell>
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.clue}
                        </LogoText>
                     </Cell>
                     <Cell>
                        <LogoText size="1em" color={valueCol(user)}>
                           {user.votedFor}
                        </LogoText>
                     </Cell>
                  </RowContainer>
               ))}
            </div>
         </UserRowsWrapper>
      </DataTableWrapper>
   );
}
