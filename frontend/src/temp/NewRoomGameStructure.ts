export interface IRoom {
   // activeTopic: string;
   gameStarted: boolean;
   roomId: string;
   users: {
      userStatus: 'connected' | 'disconnected';
      // score: number;
      statusUpdatedAt: string;
      userId: string;
   }[];
   gameState: {
      activeTopic: string; // set randomly at the start of each round
      activeWord: string; // set randomly at the start of each round
      currentRat: string; // set randomly at the start of each round
      currentRound: number; // starts at 1 when game starts and increments by 1 at the start of each round
      numberOfRoundsSet: number; // default value of 5. Can implement logic for the room creator to set this value later
      currentTurn: string; // when implementing this, ensure that no user has more than one turn (e.g. by using a queue system or checking which user's clue field is an empty string)
      userStates: {
         userId: string;
         totalScore: number; // totalScore = totalScore + roundScore at the end of each round (not reset)
         roundScore: number; // set based on the score system + reset to 0 at start of each round
         clue: string; // set when user's turn + reset to empty string at start of each round
         guess?: string; // only the rat guesses the word at the end of the round + then reset at the start of each round
         votedFor: string; // set when user votes for who they think the rat is at the end of the round + reset to empty string at start of each round
      }[];
   };
}
