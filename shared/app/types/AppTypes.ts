export namespace AppTypes {
   export interface Topic {
      key: string;
      values: [
         string,
         string,
         string,
         string,
         string,
         string,
         string,
         string,
         string,
         string,
         string,
         string,
      ];
   }

   export interface WordCell {
      cellId: string;
      word: string;
   }

   export interface Room {
      gameStarted: boolean;
      roomId: string;
      gameState: {
         activeTopic: string;
         activeWord: string;
         currentRat: string;
         currentRound: number;
         currentTurn: string;
         numberOfRoundsSet: number;
         userStates: {
            userId: string;
            totalScore: number;
            roundScores: number[];
            clue: string;
            guess: string;
            votedFor: string;
            spectate: boolean;
            userStatus: 'connected' | 'disconnected';
            statusUpdatedAt: string;
         }[];
      };
   }
   export type UserState = Room['gameState']['userStates'][0];
   export type GameState = Room['gameState'];
}

export default AppTypes;
