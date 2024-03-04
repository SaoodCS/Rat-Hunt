import { useContext, useEffect, useState } from 'react';
import { LogoText } from '../../../../../../global/components/app/logo/LogoText';
import ArrayOfObjects from '../../../../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../../../../class/FirestoreDb';
import { GameContext } from '../../../../context/GameContext';
import { DataTableWrapper, HeaderRowContainer, Cell, UserRowsWrapper, RowContainer } from './Style';

export default function GameDataTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const [sortedUserStates, setSortedUserStates] = useState<FirestoreDB.Room.IUserStates[]>();

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
