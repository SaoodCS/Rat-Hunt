import InputHeader from './inputHeader/InputHeader';
import GameDataTable from './gameDataTable/GameDataTable';
import { GameplayWrapper } from './style/Style';

export default function Gameplay(): JSX.Element {
   return (
      <GameplayWrapper>
         <InputHeader />
         <GameDataTable />
      </GameplayWrapper>
   );
}
