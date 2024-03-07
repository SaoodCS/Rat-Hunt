import { useContext, useEffect, useState } from 'react';
import { Cell, DataTableWrapper, HeaderRowContainer, RowContainer, UserRowsWrapper } from './Style';
import { GameContext } from '../../../../../../../global/context/game/GameContext';
import DBConnect from '../../../../../../../global/utils/DBConnect/DBConnect';
import MiscHelper from '../../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import ArrayOfObjects from '../../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { LogoText } from '../../../../../../../global/components/app/logo/LogoText';

export default function GameStateTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = DBConnect.FSDB.Get.room(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<DBConnect.FSDB.I.UserState[]>();

   useEffect(() => {
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
      const { gameState } = roomData;
      const { userStates } = gameState;
      setSortedUserStates(ArrayOfObjects.sort(userStates, 'userId'));
   }, [roomData?.gameState.userStates, localDbUser]);

   return (
      <DataTableWrapper>
         <HeaderRowContainer style={{ borderRadius: '0.5em' }}>
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
         <UserRowsWrapper>
            {sortedUserStates?.map((user) => (
               <RowContainer
                  key={user.userId}
                  isThisUser={user.userId === localDbUser}
                  currentTurn={user.userId === roomData?.gameState.currentTurn}
               >
                  <Cell>
                     <LogoText size="1em">{user.userId}</LogoText>
                  </Cell>
                  <Cell>
                     <LogoText size="1em">{user.clue}</LogoText>
                  </Cell>
                  <Cell>
                     <LogoText size="1em">{user.votedFor}</LogoText>
                  </Cell>
               </RowContainer>
            ))}
         </UserRowsWrapper>
      </DataTableWrapper>
   );
}
