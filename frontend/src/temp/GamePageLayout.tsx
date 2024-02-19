import { useContext, useEffect } from 'react';
import FirestoreDB from '../pages/main/class/FirestoreDb';
import { GameContext } from '../pages/main/context/GameContext';
import { GameHeaderWrapper, GamePageWrapper, GameplayWrapper, TopicBoardWrapper } from './Style';
import GameHeader from './header/GameHeader';
import TopicBoard from './topicBoard/TopicBoard';

export default function GamePageLayout(): JSX.Element {
   const { allUsers, setAllUsers, localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const { data: topicsData } = FirestoreDB.Topics.getTopicsQuery();

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
