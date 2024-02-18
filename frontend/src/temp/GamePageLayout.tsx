import { GameHeaderWrapper, GamePageWrapper, GameplayWrapper, TopicBoardWrapper } from './Style';
import GameHeader from './header/GameHeader';
import TopicBoard from './topicBoard/TopicBoard';

export default function GamePageLayout(): JSX.Element {
   return (
      <GamePageWrapper>
         <GameHeaderWrapper>
            <GameHeader />
         </GameHeaderWrapper>
         <GameplayWrapper></GameplayWrapper>
         <TopicBoardWrapper>
            <TopicBoard />
         </TopicBoardWrapper>
      </GamePageWrapper>
   );
}
