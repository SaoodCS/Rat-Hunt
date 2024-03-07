import ArrayHelper from '../../helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import type DBConnect from '../DBConnect/DBConnect';

export namespace GameHelper {
   export namespace I {
      export interface WordCell {
         cellId: string;
         word: string;
      }
   }

   export namespace New {
      export function topic(activeTopic: string, topicData: DBConnect.FSDB.I.Topics[]): string {
         const newTopic = ArrOfObj.getRandItem(topicData).key;
         return newTopic === activeTopic ? topic(activeTopic, topicData) : newTopic;
      }

      export function roomUID(existingRoomUIDs: string[]): string {
         let newId = '';
         let idExists = true;
         while (idExists) {
            newId = Math.random().toString(36).substring(2, 7);
            idExists = existingRoomUIDs.includes(newId);
         }
         return newId;
      }
   }

   export namespace Get {
      export function topicWordsAndCells(
         topics: DBConnect.FSDB.I.Topics[],
         activeTopic: string,
      ): GameHelper.I.WordCell[] {
         const topicObj = ArrOfObj.findObj(topics, 'key', activeTopic);
         const words = topicObj.values;
         const sortedWords = ArrayHelper.sort(words);
         const words16 = sortedWords.slice(0, 16);
         const wordsWithCellIds: GameHelper.I.WordCell[] = [];
         const letters = ['A', 'B', 'C', 'D'];
         for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
               wordsWithCellIds.push({
                  cellId: letters[i] + (j + 1),
                  word: words16[i * 4 + j],
               });
            }
         }
         return wordsWithCellIds;
      }

      export function firstUser(userStates: DBConnect.FSDB.I.UserState[]): string {
         const sortedUserStates = ArrOfObj.sort(userStates, 'userId');
         return sortedUserStates[0].userId;
      }

      export function nextTurnUserId(
         userStates: DBConnect.FSDB.I.UserState[],
         currentTurnUser: string,
         type: 'votedFor' | 'clue' | 'guess' | 'leaveRoom',
         currentRat: string,
      ): string {
         const sortedUserStates = ArrOfObj.sort(userStates, 'userId');
         const thisUserIndex = sortedUserStates.findIndex((u) => u.userId === currentTurnUser);
         const userStatesWithoutThisUser = ArrOfObj.filterOut(
            userStates,
            'userId',
            currentTurnUser,
         );
         const finalVoteSubmission = ArrOfObj.isKeyInAllObjsNotValuedAs(
            userStatesWithoutThisUser,
            'votedFor',
            '',
         );
         const finalClueSubmission = ArrOfObj.isKeyInAllObjsNotValuedAs(
            userStatesWithoutThisUser,
            'clue',
            '',
         );
         if (type === 'votedFor') {
            const nextUser = sortedUserStates[thisUserIndex + 1]?.userId || currentRat;
            const updatedCurrentTurn = finalVoteSubmission ? `${currentRat}.wordGuess` : nextUser;
            return updatedCurrentTurn;
         }
         if (type === 'clue') {
            const firstUser = sortedUserStates[0].userId;
            const nextUser = sortedUserStates[thisUserIndex + 1]?.userId || firstUser;
            const updatedCurrentTurn = finalClueSubmission ? firstUser : nextUser;
            return updatedCurrentTurn;
         }
         if (type === 'guess') {
            return '';
         }
         // if type is 'leaveRoom':
         const allVotesSubmitted = finalVoteSubmission;
         const allCluesSubmitted = finalClueSubmission;
         const thisUserIsRat = currentRat === currentTurnUser;
         const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
         const ratSubmittedGuess = ratUserState.guess !== '';
         if (ratSubmittedGuess) return '';
         if (thisUserIsRat) return sortedUserStates[0].userId;
         if (allVotesSubmitted) return `${currentRat}.wordGuess`;
         if (allCluesSubmitted) return sortedUserStates[0].userId;
         // If not all clues are submitted:
         const firstUser = sortedUserStates[0].userId;
         const nextUser = sortedUserStates[thisUserIndex + 1]?.userId || firstUser;
         const updatedCurrentTurn = nextUser;
         return updatedCurrentTurn;
      }

      export function disconnectedUserIds(users: DBConnect.FSDB.I.User[]): string[] {
         const disconnectedUsers = ArrOfObj.filterOut(users, 'userStatus', 'connected');
         return ArrOfObj.getArrOfValuesFromKey(disconnectedUsers, 'userId');
      }

      export function connectedUserIds(users: DBConnect.FSDB.I.User[]): string[] {
         const connectedUsers = ArrOfObj.filterOut(users, 'userStatus', 'disconnected');
         return ArrOfObj.getArrOfValuesFromKey(connectedUsers, 'userId');
      }

      export function gamePhase(
         gameState: DBConnect.FSDB.I.GameState,
      ): 'votedFor' | 'clue' | 'guess' {
         const { currentTurn, userStates } = gameState;
         const currentTurnUserState = ArrOfObj.findObj(userStates, 'userId', currentTurn);
         if (currentTurnUserState.clue === '') return 'clue';
         if (currentTurnUserState.votedFor === '') return 'votedFor';
         return 'guess';
      }
   }

   export namespace SetRoomState {
      export function keysVals<T extends keyof DBConnect.FSDB.I.Room>(
         roomData: DBConnect.FSDB.I.Room,
         keyVals: { key: T; value: DBConnect.FSDB.I.Room[T] }[],
      ): DBConnect.FSDB.I.Room {
         const updatedRoomData: typeof roomData = JSON.parse(JSON.stringify(roomData));
         keyVals.forEach((keyVal) => {
            updatedRoomData[keyVal.key] = keyVal.value;
         });
         return updatedRoomData;
      }
   }

   export namespace SetGameState {
      export function userPoints(
         gameState: DBConnect.FSDB.I.GameState,
      ): DBConnect.FSDB.I.GameState {
         const { userStates, currentRat, activeWord } = gameState;
         const { findObj, filterIn, filterOut, getArrOfValuesFromKey } = ArrOfObj;
         const rat = findObj(userStates, 'userId', currentRat);
         const correctGuess = rat.guess === activeWord;
         const ratVoters = filterIn(userStates, 'votedFor', currentRat);
         const correctVotes = ratVoters.length > userStates.length / 2;
         const ratGets2Points = correctGuess && !correctVotes;
         const ratGets1Point = (correctGuess && correctVotes) || (!correctGuess && !correctVotes);
         const othersGet1Point = correctVotes;
         const ratVotersWithoutRat = filterOut(ratVoters, 'userId', currentRat);
         const ratVotersIds = getArrOfValuesFromKey(ratVotersWithoutRat, 'userId');
         const updatedRatUserState: DBConnect.FSDB.I.UserState = {
            ...rat,
            totalScore: rat.totalScore + (ratGets2Points ? 2 : ratGets1Point ? 1 : 0),
            roundScores: [...rat.roundScores, ratGets2Points ? 2 : ratGets1Point ? 1 : 0],
         };
         const userStatesWithoutRat: DBConnect.FSDB.I.UserState[] = filterOut(
            userStates,
            'userId',
            currentRat,
         );
         const updatedUserStates: DBConnect.FSDB.I.UserState[] = userStatesWithoutRat.map(
            (userState) => {
               const othersGetAnotherPoint = ratVotersIds.includes(userState.userId);
               return {
                  ...userState,
                  totalScore:
                     userState.totalScore +
                     (othersGet1Point ? 1 : 0) +
                     (othersGetAnotherPoint ? 1 : 0),
                  roundScores: [
                     ...userState.roundScores,
                     (othersGet1Point ? 1 : 0) + (othersGetAnotherPoint ? 1 : 0),
                  ],
               };
            },
         );

         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            userStates: [...updatedUserStates, updatedRatUserState],
         };
         return updatedGameState;
      }

      export function newRound(options: {
         gameState: DBConnect.FSDB.I.GameState;
         topicsData: DBConnect.FSDB.I.Topics[];
         newTopic: string;
         resetRoundToOne?: boolean;
         resetScores?: boolean;
         newNoOfRounds?: number;
         resetCurrentRound?: boolean;
         delUserFromUserStateId?: string;
      }): DBConnect.FSDB.I.GameState {
         const {
            gameState,
            topicsData,
            newTopic,
            resetRoundToOne,
            resetScores,
            newNoOfRounds,
            resetCurrentRound,
            delUserFromUserStateId,
         } = options;
         const { userStates } = gameState;
         const resetRoundToOneIsTrue = resetRoundToOne === true;
         const resetScoresIsTrue = resetScores === true;
         const newNoOfRoundsExists = newNoOfRounds !== undefined;
         const resetCurrentRoundIsTrue = resetCurrentRound === true;

         const userStatesWithoutDelUser = ArrOfObj.filterOut(
            userStates,
            'userId',
            delUserFromUserStateId || '',
         );
         const newRat = ArrOfObj.getRandItem(userStatesWithoutDelUser).userId;
         const { currentRound, numberOfRoundsSet } = gameState;
         const newWords = Get.topicWordsAndCells(topicsData, newTopic);
         const newWord = newWords[Math.floor(Math.random() * newWords.length)].word;
         const updatedUserStates = ArrOfObj.setAllValuesOfKeys(
            userStatesWithoutDelUser,
            resetScoresIsTrue
               ? [
                    { key: 'clue', value: '' },
                    { key: 'guess', value: '' },
                    { key: 'votedFor', value: '' },
                    { key: 'roundScores', value: [] },
                    { key: 'totalScore', value: 0 },
                    { key: 'spectate', value: false },
                 ]
               : [
                    { key: 'clue', value: '' },
                    { key: 'guess', value: '' },
                    { key: 'votedFor', value: '' },
                    { key: 'spectate', value: false },
                 ],
         );
         const updatedCurrentTurn = GameHelper.Get.firstUser(userStatesWithoutDelUser);
         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            activeTopic: newTopic,
            activeWord: newWord,
            currentRat: newRat,
            currentRound: resetRoundToOneIsTrue
               ? 1
               : resetCurrentRoundIsTrue
                 ? currentRound
                 : currentRound + 1,
            currentTurn: updatedCurrentTurn,
            userStates: updatedUserStates,
            numberOfRoundsSet: newNoOfRoundsExists ? newNoOfRounds : numberOfRoundsSet,
         };
         return updatedGameState;
      }

      export function keysVals<T extends keyof DBConnect.FSDB.I.GameState>(
         gameState: DBConnect.FSDB.I.GameState,
         keyVals: { key: T; value: DBConnect.FSDB.I.GameState[T] }[],
      ): DBConnect.FSDB.I.GameState {
         const updatedGameState: typeof gameState = JSON.parse(JSON.stringify(gameState));
         keyVals.forEach((keyVal) => {
            updatedGameState[keyVal.key] = keyVal.value;
         });
         return updatedGameState;
      }
   }

   export namespace SetUserStates {
      export function updateUser<T extends keyof DBConnect.FSDB.I.UserState>(
         userStates: DBConnect.FSDB.I.UserState[],
         userId: string,
         keyVals: { key: T; value: DBConnect.FSDB.I.UserState[T] }[],
      ): DBConnect.FSDB.I.UserState[] {
         const userState = ArrOfObj.findObj(userStates, 'userId', userId);
         const userStatesWithoutUser = ArrOfObj.filterOut(userStates, 'userId', userId);
         const updatedUserState: typeof userState = JSON.parse(JSON.stringify(userState));
         keyVals.forEach((keyVal) => {
            updatedUserState[keyVal.key] = keyVal.value;
         });
         return [...userStatesWithoutUser, updatedUserState];
      }
   }
}

export default GameHelper;
