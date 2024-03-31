import * as admin from 'firebase-admin';
import type { Reference } from 'firebase-admin/database';
import type { DocumentReference } from 'firebase-admin/firestore';
import { ArrayHelp } from './ArrayHelp';
import { MiscHelp } from './MiscHelp';

export interface IUserStates {
   userId: string;
   totalScore: number;
   roundScores: number[];
   clue: string;
   guess: string;
   votedFor: string;
   spectate: boolean;
   userStatus: 'connected' | 'disconnected';
   statusUpdatedAt: string;
}

export interface IGameState {
   activeTopic: string;
   activeWord: string;
   currentRat: string;
   currentRound: number;
   currentTurn: string;
   numberOfRoundsSet: number;
   userStates: IUserStates[];
}
export interface IRoom {
   gameStarted: boolean;
   roomId: string;
   gameState: IGameState;
}

export default interface ITopic {
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

export interface IActiveTopicWords {
   cellId: string;
   word: string;
}

interface IChangeDetails {
   fullPath: string;
   roomId: IRoom['roomId'];
   userId: IGameState['userStates'][0]['userId'];
   userStatus: IGameState['userStates'][0]['userStatus'];
}
interface NestedObject {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   [key: string]: NestedObject | any;
}

export class FBHelp {
   public static getChangedStatus<T extends NestedObject>(
      originalValue: T,
      newValue: T,
      path = '',
   ): IChangeDetails {
      for (const key in newValue) {
         if (typeof newValue[key] === 'object') {
            const currentPath = path ? `${path}/${key}` : key;
            const result = FBHelp.getChangedStatus(originalValue[key], newValue[key], currentPath);
            if (result) return result;
         } else {
            if (originalValue[key] !== newValue[key]) {
               const changedPath = path ? `${path}/${key}` : key;
               const roomId = changedPath.split('/')[1];
               const userId = changedPath.split('/')[2];

               return {
                  fullPath: changedPath,
                  roomId,
                  userId,
                  userStatus: newValue[key],
               };
            }
         }
      }
      return null as unknown as IChangeDetails;
   }

   public static async getRoomFromFS(roomRefFS: DocumentReference): Promise<IRoom | undefined> {
      const roomSnapshot = await roomRefFS.get();
      return roomSnapshot.data() as IRoom | undefined;
   }

   public static async getTopics(): Promise<ITopic[]> {
      const topicsSnapshot = await admin.firestore().collection('topics').doc('topics').get();
      return topicsSnapshot.data()?.topics as ITopic[];
   }

   public static getActiveTopicWords(topics: ITopic[], activeTopic: string): IActiveTopicWords[] {
      const topicObj = ArrayHelp.getObj(topics, 'key', activeTopic);
      const words = topicObj.values;
      const sortedWords = ArrayHelp.sort(words);
      const words16 = sortedWords.slice(0, 16);
      const wordsWithCellIds: IActiveTopicWords[] = [];
      const letters = ['A', 'B', 'C'];
      for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 4; j++) {
            wordsWithCellIds.push({
               cellId: letters[i] + (j + 1),
               word: words16[i * 4 + j],
            });
         }
      }
      return wordsWithCellIds;
   }

   public static getRefs(
      roomId: string,
      userId: string,
   ): {
      roomRefRT: Reference;
      userRefRT: Reference;
      roomRefFS: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
   } {
      const roomRefFS = admin.firestore().collection('games').doc(`room-${roomId}`);
      const roomRefRT = admin.database().ref(`/rooms/${roomId}`);
      const userRefRT = admin.database().ref(`/rooms/${roomId}/${userId}`);
      return { roomRefRT, userRefRT, roomRefFS };
   }

   public static getUserState(
      userStatesArr: IUserStates[],
      userId: string,
   ):
      | {
           userIndex: number;
           user: IUserStates;
        }
      | undefined {
      const userIndex = userStatesArr.findIndex((user) => user.userId === userId);
      if (userIndex === -1) return undefined;
      return {
         userIndex,
         user: userStatesArr[userIndex],
      };
   }

   static sortedUserQueue(roundNo: number, userStates: IUserStates[]): string[] {
      const usersQueued: string[] = [];
      const usersLength = userStates.length;
      const users = ArrayHelp.getArrOfValuesFromKey(userStates, 'userId');
      const sortedUsers = ArrayHelp.sort(users);
      for (let i = 0; i < usersLength; i++) {
         const index = (roundNo - 1 + i) % usersLength;
         usersQueued.push(sortedUsers[index]);
      }
      return usersQueued;
   }

   static resetRoundGameState(
      gameState: IGameState,
      userStatesWithoutLeavingUser: IUserStates[],
      topics: ITopic[],
   ): IGameState {
      const { currentRound, activeTopic } = gameState;
      const newRat = ArrayHelp.getRandItem(userStatesWithoutLeavingUser).userId;
      const newWords = FBHelp.getActiveTopicWords(topics, activeTopic);
      const newWord = newWords[Math.floor(Math.random() * newWords.length)].word;
      const updatedUserStates = ArrayHelp.setAllValuesOfKeys(userStatesWithoutLeavingUser, [
         { key: 'clue', value: '' },
         { key: 'guess', value: '' },
         { key: 'votedFor', value: '' },
         { key: 'spectate', value: false },
      ]);
      const sortedUserQueue = FBHelp.sortedUserQueue(currentRound, userStatesWithoutLeavingUser);
      const updatedCurrentTurn = sortedUserQueue[0];
      const updatedGameState: IGameState = {
         ...gameState,
         activeWord: newWord,
         currentRat: newRat,
         currentTurn: updatedCurrentTurn,
         userStates: updatedUserStates,
      };
      return updatedGameState;
   }

   public static isRoundSummaryPhase(gameState: IGameState): boolean {
      const { currentRat, userStates } = gameState;
      const ratUserState = ArrayHelp.getObj(userStates, 'userId', currentRat);
      return ratUserState.guess !== '';
   }

   public static hasRatGuessed(gameState: IGameState): boolean {
      const { currentRat, userStates } = gameState;
      const ratUserState = ArrayHelp.getObj(userStates, 'userId', currentRat);
      return ratUserState.guess !== '';
   }
   public static gamePhase(gameState: IGameState): 'votedFor' | 'clue' | 'guess' | 'roundSummary' {
      const { currentTurn, userStates } = gameState;
      if (currentTurn === '') return 'roundSummary';
      const currentTurnUserId = currentTurn.replace('.wordGuess', '');
      const currentTurnUserState = ArrayHelp.getObj(userStates, 'userId', currentTurnUserId);
      if (!MiscHelp.isNotFalsyOrEmpty(currentTurnUserState)) {
         throw new Error('Current turn is set to a user that does not exist in userStates.');
      }
      const hasRatGuessed = FBHelp.hasRatGuessed(gameState);
      if (currentTurnUserState.spectate) {
         // Spectating user's clue and votedFor values are already set to 'SKIP' for the round
         const allCluesExist = ArrayHelp.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
         const allVotedForValuesExist = ArrayHelp.isKeyInAllObjsNotValuedAs(
            userStates,
            'votedFor',
            '',
         );
         if (hasRatGuessed) return 'roundSummary';
         if (allCluesExist && allVotedForValuesExist) return 'guess';
         if (allCluesExist) return 'votedFor';
         return 'clue';
      }
      if (currentTurnUserState.clue === '') return 'clue';
      if (currentTurnUserState.votedFor === '') return 'votedFor';
      if (hasRatGuessed) return 'roundSummary';
      return 'guess';
   }

   public static updateUser<T extends keyof IUserStates>(
      userStates: IUserStates[],
      userId: string,
      keyVals: { key: T; value: IUserStates[T] }[],
   ): IUserStates[] {
      const userState = ArrayHelp.getObj(userStates, 'userId', userId);
      const userStatesWithoutUser = ArrayHelp.filterOut(userStates, 'userId', userId);
      const updatedUserState: typeof userState = JSON.parse(JSON.stringify(userState));
      keyVals.forEach((keyVal) => {
         updatedUserState[keyVal.key] = keyVal.value;
      });
      return [...userStatesWithoutUser, updatedUserState];
   }

   public static updateGameState<T extends keyof IGameState>(
      gameState: IGameState,
      keyVals: { key: T; value: IGameState[T] }[],
   ): IGameState {
      const updatedGameState: typeof gameState = JSON.parse(JSON.stringify(gameState));
      keyVals.forEach((keyVal) => {
         updatedGameState[keyVal.key] = keyVal.value;
      });
      return updatedGameState;
   }
}
