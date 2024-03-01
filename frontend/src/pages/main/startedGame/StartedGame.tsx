import { useContext, useEffect } from 'react';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../global/helpers/dataTypes/miscHelper/MiscHelper';
import FirestoreDB from '../class/FirestoreDb';
import { GameContext } from '../context/GameContext';
import GameHeader from './header/GameHeader';
import {
   GameHeaderWrapper,
   GamePageWrapper,
   GameplayWrapper,
   TopicBoardWrapper,
} from './style/Style';
import TopicBoard from './topicBoard/TopicBoard';
import Gameplay from './gameplay/Gameplay';

export default function StartedGame(): JSX.Element {
   const { allUsers, localDbRoom, localDbUser } = useContext(GameContext);
   const { data: roomData } = FirestoreDB.Room.getRoomQuery(localDbRoom);
   const { data: topicsData } = FirestoreDB.Topics.getTopicsQuery();
   const updateGameStateMutation = FirestoreDB.Room.updateGameStateMutation({});

   useEffect(() => {
      // This useEffect is responsible for updating the game state when the ROUND changes.
      if (MiscHelper.isNotFalsyOrEmpty(roomData)) {
         const { users } = roomData;
         const connectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'disconnected');
         const connectedUser = connectedUsers[0];
         if (connectedUser?.userId !== localDbUser) return;
         if (!MiscHelper.isNotFalsyOrEmpty(allUsers)) return;
         const newRat = allUsers[Math.floor(Math.random() * allUsers.length)];
         const { activeTopic, currentRound, userStates } = roomData.gameState;
         const { randNewTopicKey, getActiveTopicWords } = FirestoreDB.Room;
         if (!MiscHelper.isNotFalsyOrEmpty(topicsData)) return;
         const isRoundOne = currentRound === 1;
         const newTopic = !isRoundOne ? randNewTopicKey(activeTopic, topicsData) : activeTopic;
         const newWords = getActiveTopicWords(topicsData, newTopic);
         const newWord = newWords[Math.floor(Math.random() * newWords.length)].word;
         const sortedUserStates = ArrayOfObjects.sort(userStates, 'userId');
         const updatedCurrentTurn = sortedUserStates[0].userId;
         const updatedGameState: FirestoreDB.Room.IGameState = {
            ...roomData.gameState,
            activeTopic: newTopic,
            activeWord: newWord,
            currentRat: newRat,
            currentTurn: updatedCurrentTurn,
         };
         updateGameStateMutation.mutate({
            roomId: localDbRoom,
            gameState: updatedGameState,
         });
      }
   }, [roomData?.gameState?.currentRound]);

   return (
      <GamePageWrapper>
         <GameHeaderWrapper>
            <GameHeader />
         </GameHeaderWrapper>
         <GameplayWrapper>
            <Gameplay />
         </GameplayWrapper>
         <TopicBoardWrapper>
            <TopicBoard />
         </TopicBoardWrapper>
      </GamePageWrapper>
   );
}
