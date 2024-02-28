import GameplayForm from './form/GameplayForm';
import GameDataTable from './gameDataTable/GameDataTable';
import { GameplayWrapper } from './style/Style';

export default function Gameplay(): JSX.Element {
   return (
      <GameplayWrapper>
         <GameplayForm />
         <GameDataTable />
      </GameplayWrapper>
   );
}
