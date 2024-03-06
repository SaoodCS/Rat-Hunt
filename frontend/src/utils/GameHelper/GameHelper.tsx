import ArrayHelper from '../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
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
         const newTopic = topicData[Math.floor(Math.random() * topicData.length)].key;
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
         const topicObj = ArrayOfObjects.getObjWithKeyValuePair(topics, 'key', activeTopic);
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

      export function nextTurnUserId(
         userStates: DBConnect.FSDB.I.UserState[],
         currentTurnUser: string,
         type: 'votedFor' | 'clue' | 'guess' | 'leaveRoom',
         currentRat: string,
         disconnectedUsersIds: string[],
      ): string {
         // const connectedUsersStates = ArrayOfObjects.filterOutValues(
         //    userStates,
         //    'userId',
         //    disconnectedUsersIds,
         // );
         const sortedUserStates = ArrayOfObjects.sort(
            userStates, // connectedUsersStates,
            'userId',
         );
         const thisUserIndex = sortedUserStates.findIndex((u) => u.userId === currentTurnUser);
         const userStatesWithoutThisUser = ArrayOfObjects.filterOut(
            userStates, // connectedUsersStates,
            'userId',
            currentTurnUser,
         );
         const finalVoteSubmission = ArrayOfObjects.isKeyInAllObjsNotValuedAs(
            userStatesWithoutThisUser,
            'votedFor',
            '',
         );
         const finalClueSubmission = ArrayOfObjects.isKeyInAllObjsNotValuedAs(
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
         const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(
            userStates,
            'userId',
            currentRat,
         );
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
         const disconnectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'connected');
         return ArrayOfObjects.getArrOfValuesFromKey(disconnectedUsers, 'userId');
      }

      export function connectedUserIds(users: DBConnect.FSDB.I.User[]): string[] {
         const connectedUsers = ArrayOfObjects.filterOut(users, 'userStatus', 'disconnected');
         return ArrayOfObjects.getArrOfValuesFromKey(connectedUsers, 'userId');
      }

      export function gamePhase(
         gameState: DBConnect.FSDB.I.GameState,
      ): 'votedFor' | 'clue' | 'guess' {
         const { currentTurn, userStates } = gameState;
         const currentTurnUserState = ArrayOfObjects.getObjWithKeyValuePair(
            userStates,
            'userId',
            currentTurn,
         );
         if (currentTurnUserState.clue === '') return 'clue';
         if (currentTurnUserState.votedFor === '') return 'votedFor';
         return 'guess';
      }
   }

   export namespace SetGameState {
      export function userPoints(
         gameState: DBConnect.FSDB.I.GameState,
      ): DBConnect.FSDB.I.GameState {
         const { userStates, currentRat, activeWord } = gameState;
         const {
            getObjWithKeyValuePair,
            getObjectsWithKeyValuePair,
            filterOut,
            getArrOfValuesFromKey,
         } = ArrayOfObjects;
         const rat = getObjWithKeyValuePair(userStates, 'userId', currentRat);
         const correctGuess = rat.guess === activeWord;
         const ratVoters = getObjectsWithKeyValuePair(userStates, 'votedFor', currentRat);
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
         disconnectedUsersIds: string[];
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
            disconnectedUsersIds,
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

         const userStatesWithoutDelUser = ArrayOfObjects.filterOut(
            userStates,
            'userId',
            delUserFromUserStateId || '',
         );
         const newRat = ArrayOfObjects.getRandItem(userStatesWithoutDelUser).userId;
         const { currentRound, numberOfRoundsSet } = gameState;
         const newWords = Get.topicWordsAndCells(topicsData, newTopic);
         const newWord = newWords[Math.floor(Math.random() * newWords.length)].word;
         const updatedUserStates = ArrayOfObjects.setAllValuesOfKeys(
            userStatesWithoutDelUser,
            resetScoresIsTrue
               ? [
                    { key: 'clue', value: '' },
                    { key: 'guess', value: '' },
                    { key: 'votedFor', value: '' },
                    { key: 'roundScores', value: [] },
                    { key: 'totalScore', value: 0 },
                 ]
               : [
                    { key: 'clue', value: '' },
                    { key: 'guess', value: '' },
                    { key: 'votedFor', value: '' },
                 ],
         );
         const sortedUserStates = ArrayOfObjects.sort(userStatesWithoutDelUser, 'userId');
         const updatedCurrentTurn = sortedUserStates[0].userId;
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
   }

   export namespace SetUserState {
      export function userKeyVal(
         userStates: DBConnect.FSDB.I.UserState[],
         userId: string,
         key: keyof DBConnect.FSDB.I.UserState,
         newValue: string,
      ): DBConnect.FSDB.I.UserState[] {
         const userState = ArrayOfObjects.getObjWithKeyValuePair(userStates, 'userId', userId);
         const userStatesWithoutUser = ArrayOfObjects.filterOut(userStates, 'userId', userId);
         const updatedUserState: typeof userState = { ...userState, [key]: newValue };
         return [...userStatesWithoutUser, updatedUserState];
      }
   }
}

export default GameHelper;
