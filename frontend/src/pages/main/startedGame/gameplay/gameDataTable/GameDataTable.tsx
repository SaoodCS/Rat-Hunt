import { LogoText } from '../../../../../global/components/app/logo/LogoText';
import { Cell, DataTableWrapper, HeaderRowContainer, RowContainer, UserRowsWrapper } from './Style';

export default function GameDataTable(): JSX.Element {
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
            <RowContainer>
               <Cell>
                  <LogoText size="1em"> Saood</LogoText>
               </Cell>
               <Cell>
                  <LogoText size="1em"> Food</LogoText>
               </Cell>
               <Cell>
                  <LogoText size="1em"> Joe</LogoText>
               </Cell>
            </RowContainer>
            <RowContainer isThisUser>
               <Cell>
                  <LogoText size="1em"> Saood</LogoText>
               </Cell>
               <Cell>
                  <LogoText size="1em"> Food</LogoText>
               </Cell>
               <Cell>
                  <LogoText size="1em"> Joe</LogoText>
               </Cell>
            </RowContainer>
         </UserRowsWrapper>
      </DataTableWrapper>
   );
}
