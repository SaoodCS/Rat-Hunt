import { useContext } from 'react';
import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import FirestoreDB from '../../../class/FirestoreDb';
import { Cell, DataTableWrapper, HeaderRowContainer, RowContainer, UserRowsWrapper } from './Style';
import { GameContext } from '../../../context/GameContext';

export default function GameDataTable(): JSX.Element {
   const { localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);

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
            {roomData?.gameState.userStates.map((user) => (
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
