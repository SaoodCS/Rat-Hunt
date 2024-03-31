import ArrayHelper from '../../helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrOfObj from '../../helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../helpers/dataTypes/miscHelper/MiscHelper';
import type DBConnect from '../DBConnect/DBConnect';

export namespace GameHelper {
   export namespace I {
      export interface WordCell {
         cellId: string;
         word: string;
      }
   }

   export namespace New {
      export function word(topicsData: DBConnect.FSDB.I.Topic[], activeTopic: string): string {
         const words = ArrOfObj.findObj(topicsData, 'key', activeTopic).values;
         return ArrOfObj.getRandItem(words);
      }

      export function roomUID(existingRoomUIDs: string[]): string {
         let newId = '';
         let idExists = true;
         while (idExists) {
            newId = Math.random().toString(36).substring(2, 7).toUpperCase();
            idExists = ArrayHelper.toUpperCase(existingRoomUIDs).includes(newId);
         }
         return newId;
      }
   }

   export namespace Check {
      export function hasRatGuessed(gameState: DBConnect.FSDB.I.GameState): boolean {
         const { currentRat, userStates } = gameState;
         const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
         return ratUserState.guess !== '';
      }

      export function isRatGuessCorrect(gameState: DBConnect.FSDB.I.GameState): boolean {
         const { activeWord, currentRat, userStates } = gameState;
         const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
         return ratUserState.guess === activeWord;
      }

      export function ratGotCaught(gameState: DBConnect.FSDB.I.GameState): boolean {
         const { userStates, currentRat } = gameState;
         const userVotes: string[] = ArrOfObj.getArrOfValuesFromKey(userStates, 'votedFor');
         const mostRepeatedItems = ArrayHelper.findMostRepeatedItems(userVotes);
         return mostRepeatedItems.length === 1 && mostRepeatedItems.includes(currentRat);
      }

      export function isUserInRoom(
         userId: string,
         userStates: DBConnect.FSDB.I.UserState[],
      ): boolean {
         return ArrOfObj.hasKeyVal(userStates, 'userId', userId);
      }
   }

   export namespace Get {
      export function topicWordsAndCells(
         topics: DBConnect.FSDB.I.Topic[],
         activeTopic: string,
      ): GameHelper.I.WordCell[] {
         const topicObj = ArrOfObj.findObj(topics, 'key', activeTopic);
         const words = topicObj.values;
         const sortedWords = ArrayHelper.sort(words);
         const words16 = sortedWords.slice(0, 16);
         const wordsWithCellIds: GameHelper.I.WordCell[] = [];
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

      export function sortedUserQueue(
         roundNo: number,
         userStates: DBConnect.FSDB.I.UserState[],
      ): string[] {
         const usersQueued: string[] = [];
         const usersLength = userStates.length;
         const users = ArrOfObj.getArrOfValuesFromKey(userStates, 'userId');
         const sortedUsers = ArrayHelper.sort(users);
         for (let i = 0; i < usersLength; i++) {
            const index = (roundNo - 1 + i) % usersLength;
            usersQueued.push(sortedUsers[index]);
         }
         return usersQueued;
      }

      export function sortedUserStates(
         roundNo: number,
         userStates: DBConnect.FSDB.I.UserState[],
      ): DBConnect.FSDB.I.UserState[] {
         const sortedUserIdQueue = Get.sortedUserQueue(roundNo, userStates);
         return ArrOfObj.orderByArrOfVals(userStates, 'userId', sortedUserIdQueue);
      }

      export function firstUser(roundNo: number, userStates: DBConnect.FSDB.I.UserState[]): string {
         const sortedUsers = Get.sortedUserQueue(roundNo, userStates);
         return sortedUsers[0];
      }

      export function currentTurnUserId(currentTurn: string): string {
         return currentTurn.replace('.wordGuess', '');
      }

      export function nextTurnUserId(
         gameState: DBConnect.FSDB.I.GameState,
         currentTurnUser: string,
         type: 'votedFor' | 'clue' | 'guess' | 'leaveRoom',
         currentRat: string,
      ): string {
         const { userStates, currentRound } = gameState;
         const sortedUserQueue = Get.sortedUserQueue(currentRound, userStates);
         const thisUserIndex = sortedUserQueue.indexOf(currentTurnUser);
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
            const nextUser = sortedUserQueue[thisUserIndex + 1] || currentRat;
            const updatedCurrentTurn = finalVoteSubmission ? `${currentRat}.wordGuess` : nextUser;
            return updatedCurrentTurn;
         }
         if (type === 'clue') {
            const firstUser = sortedUserQueue[0];
            const nextUser = sortedUserQueue[thisUserIndex + 1] || firstUser;
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
         if (thisUserIsRat) return sortedUserQueue[0];
         if (allVotesSubmitted) return `${currentRat}.wordGuess`;
         if (allCluesSubmitted) return sortedUserQueue[0];
         // If not all clues are submitted:
         const firstUser = sortedUserQueue[0];
         const nextUser = sortedUserQueue[thisUserIndex + 1] || firstUser;
         const updatedCurrentTurn = nextUser;
         return updatedCurrentTurn;
      }

      export function allUserIds(userStates: DBConnect.FSDB.I.UserState[]): string[] {
         return ArrOfObj.getArrOfValuesFromKey(userStates, 'userId');
      }

      export function disconnectedUserIds(userStates: DBConnect.FSDB.I.UserState[]): string[] {
         const disconnectedUsers = ArrOfObj.filterOut(userStates, 'userStatus', 'connected');
         return ArrOfObj.getArrOfValuesFromKey(disconnectedUsers, 'userId');
      }

      export function connectedUserIds(userStates: DBConnect.FSDB.I.UserState[]): string[] {
         const connectedUsers = ArrOfObj.filterOut(userStates, 'userStatus', 'disconnected');
         return ArrOfObj.getArrOfValuesFromKey(connectedUsers, 'userId');
      }

      export function spectatingUserIds(userStates: DBConnect.FSDB.I.UserState[]): string[] {
         const spectatingUsers = ArrOfObj.filterOut(userStates, 'spectate', false);
         return ArrOfObj.getArrOfValuesFromKey(spectatingUsers, 'userId');
      }

      export function gamePhase(
         gameState: DBConnect.FSDB.I.GameState,
      ): 'votedFor' | 'clue' | 'guess' | 'roundSummary' {
         const { currentTurn, userStates } = gameState;
         if (currentTurn === '') return 'roundSummary';
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const currentTurnUserState = ArrOfObj.findObj(userStates, 'userId', currentTurnUserId);
         if (!MiscHelper.isNotFalsyOrEmpty(currentTurnUserState)) {
            throw new Error('Current turn is set to a user that does not exist in userStates.');
         }
         const hasRatGuessed = GameHelper.Check.hasRatGuessed(gameState);
         if (currentTurnUserState.spectate) {
            // Spectating user's clue and votedFor values are already set to 'SKIP' for the round
            const allCluesExist = ArrOfObj.isKeyInAllObjsNotValuedAs(userStates, 'clue', '');
            const allVotedForValuesExist = ArrOfObj.isKeyInAllObjsNotValuedAs(
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

      export function ratGuess(gameState: DBConnect.FSDB.I.GameState): string {
         const { currentRat, userStates } = gameState;
         const ratUserState = ArrOfObj.findObj(userStates, 'userId', currentRat);
         return ratUserState.guess;
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

      export function newRoom(
         generatedRoomId: string,
         hostUserId: string,
         topic: string,
         noOfRounds: number,
      ): DBConnect.FSDB.I.Room {
         return {
            gameStarted: false,
            roomId: generatedRoomId,
            gameState: {
               activeTopic: topic,
               activeWord: '',
               currentRat: '',
               currentRound: 0,
               numberOfRoundsSet: noOfRounds,
               currentTurn: '',
               userStates: [
                  {
                     userId: hostUserId,
                     totalScore: 0,
                     roundScores: [],
                     clue: '',
                     guess: '',
                     votedFor: '',
                     spectate: false,
                     userStatus: 'connected',
                     statusUpdatedAt: new Date().toUTCString(),
                  },
               ],
            },
         };
      }

      export function newUser(
         roomData: DBConnect.FSDB.I.Room,
         userId: string,
      ): DBConnect.FSDB.I.Room {
         const { gameStarted, gameState } = roomData;
         const { userStates } = gameState;
         const newUserState: DBConnect.FSDB.I.UserState = {
            userId,
            totalScore: 0,
            roundScores: [],
            clue: gameStarted ? 'SKIP' : '',
            guess: '',
            votedFor: gameStarted ? 'SKIP' : '',
            spectate: gameStarted,
            userStatus: 'connected',
            statusUpdatedAt: new Date().toUTCString(),
         };
         const updatedUserStates = [...userStates, newUserState];
         const updatedGameState = { ...gameState, userStates: updatedUserStates };
         return { ...roomData, gameState: updatedGameState };
      }

      export function removeUser(
         roomData: DBConnect.FSDB.I.Room,
         userId: string,
      ): DBConnect.FSDB.I.Room {
         const { gameState } = roomData;
         const { userStates } = gameState;
         const gameStateWithoutUser = GameHelper.SetGameState.keysVals(gameState, [
            { key: 'userStates', value: ArrOfObj.filterOut(userStates, 'userId', userId) },
         ]);
         return GameHelper.SetRoomState.keysVals(roomData, [
            { key: 'gameState', value: gameStateWithoutUser },
         ]);
      }
   }

   export namespace SetGameState {
      export function userPoints(
         gameState: DBConnect.FSDB.I.GameState,
      ): DBConnect.FSDB.I.GameState {
         const { userStates, currentRat, activeWord } = gameState;
         const rat = ArrOfObj.findObj(userStates, 'userId', currentRat);
         const ratVoters = ArrOfObj.filterIn(userStates, 'votedFor', currentRat);
         const ratGuessedCorrectly = rat.guess === activeWord;
         const ratGotMostVotes = ratVoters.length > userStates.length / 2;
         const updatedUserStates: DBConnect.FSDB.I.UserState[] = userStates.map((userState) => {
            let userPoints: number = 0;
            if (userState.userId === currentRat) {
               if (ratGuessedCorrectly) userPoints = userPoints + 1;
               if (!ratGotMostVotes) userPoints = userPoints + 1;
            } else {
               if (ratGotMostVotes) userPoints = userPoints + 1;
               if (userState.votedFor === currentRat) userPoints = userPoints + 1;
            }
            return {
               ...userState,
               totalScore: userState.totalScore + userPoints,
               roundScores: [...userState.roundScores, userPoints],
            };
         });
         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export function resetGame(
         gameState: DBConnect.FSDB.I.GameState,
         noOfRounds: number,
         topicsData: DBConnect.FSDB.I.Topic[],
         topic: string,
      ): DBConnect.FSDB.I.GameState {
         const { userStates } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(topicsData, topic);
         const updatedUserStates = ArrOfObj.setAllValuesOfKeys(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'roundScores', value: [] },
            { key: 'totalScore', value: 0 },
            { key: 'spectate', value: false },
         ]);
         const updatedCurrentTurn = GameHelper.Get.firstUser(1, userStates);
         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            activeTopic: topic,
            activeWord: newWord,
            currentRat: newRat,
            currentRound: 1,
            currentTurn: updatedCurrentTurn,
            userStates: updatedUserStates,
            numberOfRoundsSet: noOfRounds,
         };
         return updatedGameState;
      }

      export function resetCurrentRound(
         gameState: DBConnect.FSDB.I.GameState,
         topicsData: DBConnect.FSDB.I.Topic[],
      ): DBConnect.FSDB.I.GameState {
         const { userStates, activeTopic, currentRound } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(topicsData, activeTopic);
         const updatedUserStates = ArrOfObj.setAllValuesOfKeys(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const updatedCurrentTurn = GameHelper.Get.firstUser(currentRound, userStates);
         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            activeWord: newWord,
            currentRat: newRat,
            currentTurn: updatedCurrentTurn,
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export function nextRound(
         gameState: DBConnect.FSDB.I.GameState,
         topicsData: DBConnect.FSDB.I.Topic[],
         newTopic: string,
      ): DBConnect.FSDB.I.GameState {
         const { userStates } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const { currentRound } = gameState;
         const newWord = GameHelper.New.word(topicsData, newTopic);
         const updatedUserStates = ArrOfObj.setAllValuesOfKeys(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const newRoundNo = currentRound + 1;
         const updatedCurrentTurn = GameHelper.Get.firstUser(newRoundNo, userStates);
         const updatedGameState: DBConnect.FSDB.I.GameState = {
            ...gameState,
            activeTopic: newTopic,
            activeWord: newWord,
            currentRat: newRat,
            currentRound: newRoundNo,
            currentTurn: updatedCurrentTurn,
            userStates: updatedUserStates,
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
