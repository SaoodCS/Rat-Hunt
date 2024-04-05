/* eslint-disable @typescript-eslint/naming-convention */
import ArrayHelper from '../../lib/helpers/arrayHelper/ArrayHelper';
import ArrOfObj from '../../lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../lib/helpers/miscHelper/MiscHelper';
import NumberHelper from '../../lib/helpers/number/NumberHelper';
import type AppTypes from '../types/AppTypes';

export namespace GameHelper {
   export namespace I {
      export interface WordCell {
         cellId: string;
         word: string;
      }
   }

   export namespace CONSTANTS {
      export const TURN_TIME_LIMIT_SECONDS = 30;
      export const TURN_TIME_LIMIT_MS = NumberHelper.secsToMs(TURN_TIME_LIMIT_SECONDS);
      export const MIN_PLAYERS_TO_START_GAME = 1;
      export const MAX_PLAYERS_IN_ROOM = 20;
   }

   export namespace New {
      export function word(topicsData: AppTypes.Topic[], activeTopic: string): string {
         const topic = Get.topic(activeTopic, topicsData);
         if (!MiscHelper.isNotFalsyOrEmpty(topic)) {
            throw new Error('Topic does not exist in topicsData.');
         }
         const words = topic.values;
         return ArrOfObj.getRandItem(words);
      }

      export function roomUID(existingRoomUIDs: string[]): string {
         let newId = '';
         let idExists = true;
         while (idExists) {
            newId = Math.random().toString(36).substring(2, 7).toUpperCase();
            idExists = ArrayHelper.toCapitalize(existingRoomUIDs).includes(newId);
         }
         return newId;
      }
   }

   export namespace Check {
      export function hasRatGuessed(gameState: AppTypes.GameState): boolean {
         const ratsGuess = Get.ratGuess(gameState);
         return ratsGuess !== '';
      }

      export function isRatGuessCorrect(gameState: AppTypes.GameState): boolean {
         const { activeWord } = gameState;
         const ratGuess = Get.ratGuess(gameState);
         return ratGuess === activeWord;
      }

      export function userVotedForRat(gameState: AppTypes.GameState, userId: string): boolean {
         const ratVoters = Get.ratVoters(gameState);
         return ratVoters.includes(userId);
      }

      export function ratGotCaught(gameState: AppTypes.GameState): boolean {
         const { userStates, currentRat } = gameState;
         const userVotes: string[] = ArrOfObj.getArrOfValuesFromKey(userStates, 'votedFor');
         const mostRepeatedItems = ArrayHelper.mostRepeated(userVotes);
         return mostRepeatedItems.length === 1 && mostRepeatedItems.includes(currentRat);
      }

      export function isUserInRoom(userId: string, userStates: AppTypes.UserState[]): boolean {
         return ArrOfObj.hasKeyVal(userStates, 'userId', userId);
      }

      export function shouldSkipTurn(gameState: AppTypes.GameState): boolean {
         const { currentTurn, userStates } = gameState;
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const disconnectedUsers = GameHelper.Get.disconnectedUserIds(userStates);
         const spectatingUsers = GameHelper.Get.spectatingUserIds(userStates);
         const gamePhase = GameHelper.Get.gamePhase(gameState);
         const currentTurnUserIsDisconnected = disconnectedUsers.includes(currentTurnUserId);
         const currentTurnUserIsSpectating = spectatingUsers.includes(currentTurnUserId);
         const gamePhaseIsRoundSummary = gamePhase === 'roundSummary';
         if (
            !gamePhaseIsRoundSummary &&
            (currentTurnUserIsDisconnected || currentTurnUserIsSpectating)
         ) {
            return true;
         }
         return false;
      }
   }

   export namespace Get {
      export function topic(topicKey: string, topicsData: AppTypes.Topic[]): AppTypes.Topic {
         const topic = ArrOfObj.getObj(topicsData, 'key', topicKey);
         if (!MiscHelper.isNotFalsyOrEmpty(topic)) {
            throw new Error('Topic does not exist in topicsData.');
         }
         return topic;
      }

      export function topicWordsAndCells(
         topics: AppTypes.Topic[],
         activeTopic: string,
      ): GameHelper.I.WordCell[] {
         const topicObj = Get.topic(activeTopic, topics);
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

      export function sortedUserQueue(roundNo: number, userStates: AppTypes.UserState[]): string[] {
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
         userStates: AppTypes.UserState[],
      ): AppTypes.UserState[] {
         const sortedUserIdQueue = Get.sortedUserQueue(roundNo, userStates);
         return ArrOfObj.orderByArrOfVals(userStates, 'userId', sortedUserIdQueue);
      }

      export function firstUser(roundNo: number, userStates: AppTypes.UserState[]): string {
         const sortedUsers = Get.sortedUserQueue(roundNo, userStates);
         return sortedUsers[0];
      }

      export function userState(
         userId: string,
         userStates: AppTypes.UserState[],
      ): AppTypes.UserState {
         const userState = ArrOfObj.getObj(userStates, 'userId', userId);
         if (!MiscHelper.isNotFalsyOrEmpty(userState)) {
            throw new Error('User does not exist in userStates.');
         }
         return userState;
      }

      export function currentTurnUserId(currentTurn: string): string {
         return currentTurn.replace('.wordGuess', '');
      }

      export function nextTurnUserId(
         gameState: AppTypes.GameState,
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
         const finalVoteSubmission = !ArrOfObj.hasKeyVal(userStatesWithoutThisUser, 'votedFor', '');
         const finalClueSubmission = !ArrOfObj.hasKeyVal(userStatesWithoutThisUser, 'clue', '');
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
         const ratSubmittedGuess = Check.hasRatGuessed(gameState);
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

      export function allUserIds(userStates: AppTypes.UserState[]): string[] {
         return ArrOfObj.getArrOfValuesFromKey(userStates, 'userId');
      }

      export function disconnectedUserIds(userStates: AppTypes.UserState[]): string[] {
         const disconnectedUsers = ArrOfObj.filterOut(userStates, 'userStatus', 'connected');
         return ArrOfObj.getArrOfValuesFromKey(disconnectedUsers, 'userId');
      }

      export function connectedUserIds(userStates: AppTypes.UserState[]): string[] {
         const connectedUsers = ArrOfObj.filterOut(userStates, 'userStatus', 'disconnected');
         return ArrOfObj.getArrOfValuesFromKey(connectedUsers, 'userId');
      }

      export function spectatingUserIds(userStates: AppTypes.UserState[]): string[] {
         const spectatingUsers = ArrOfObj.filterOut(userStates, 'spectate', false);
         return ArrOfObj.getArrOfValuesFromKey(spectatingUsers, 'userId');
      }

      export function gamePhase(
         gameState: AppTypes.GameState,
      ): 'votedFor' | 'clue' | 'guess' | 'roundSummary' {
         const { currentTurn, userStates } = gameState;
         if (currentTurn === '') return 'roundSummary';
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const currentTurnUserState = Get.userState(currentTurnUserId, userStates);
         const hasRatGuessed = GameHelper.Check.hasRatGuessed(gameState);
         if (currentTurnUserState.spectate) {
            // Spectating user's clue and votedFor values are already set to 'SKIP' for the round
            const allCluesExist = !ArrOfObj.hasKeyVal(userStates, 'clue', '');
            const allVotedForValuesExist = !ArrOfObj.hasKeyVal(userStates, 'votedFor', '');
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

      export function ratGuess(gameState: AppTypes.GameState): string {
         const { currentRat, userStates } = gameState;
         const ratUserState = Get.userState(currentRat, userStates);
         return ratUserState.guess;
      }

      export function ratVoters(gameState: AppTypes.GameState): string[] {
         const { currentRat, userStates } = gameState;
         const usersWhoVotedForRat = ArrOfObj.getObjects(userStates, 'votedFor', currentRat);
         return ArrOfObj.getArrOfValuesFromKey(usersWhoVotedForRat, 'userId');
      }
   }

   export namespace SetRoomState {
      export function keysVals<T extends keyof AppTypes.Room>(
         roomData: AppTypes.Room,
         keyVals: { key: T; value: AppTypes.Room[T] }[],
      ): AppTypes.Room {
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
      ): AppTypes.Room {
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
               currentTurnChangedAt: '',
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

      export function newUser(roomData: AppTypes.Room, userId: string): AppTypes.Room {
         const { gameStarted, gameState } = roomData;
         const { userStates } = gameState;
         const newUserState: AppTypes.UserState = {
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

      export function removeUser(roomData: AppTypes.Room, userId: string): AppTypes.Room {
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
      export function userPoints(gameState: AppTypes.GameState): AppTypes.GameState {
         const { userStates, currentRat, activeWord } = gameState;
         const rat = Get.userState(currentRat, userStates);
         const ratVoters = Get.ratVoters(gameState);
         const noUserVotedForRat = ratVoters.length === 0;
         const ratGuessedCorrectly = rat.guess === activeWord;
         const ratGotMostVotes = Check.ratGotCaught(gameState);
         const updatedUserStates: AppTypes.UserState[] = userStates.map((userState) => {
            let userPoints: number = 0;
            if (userState.userId === currentRat) {
               if (ratGuessedCorrectly) userPoints = userPoints + 1;
               if (!ratGotMostVotes) userPoints = userPoints + 1;
               if (noUserVotedForRat) userPoints = userPoints + 1;
            } else {
               if (ratGotMostVotes) userPoints = userPoints + 1;
               if (userState.votedFor === currentRat) userPoints = userPoints + 1;
               if (!ratGuessedCorrectly) userPoints = userPoints + 1;
            }
            return {
               ...userState,
               totalScore: userState.totalScore + userPoints,
               roundScores: [...userState.roundScores, userPoints],
            };
         });
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export function resetGame(
         gameState: AppTypes.GameState,
         noOfRounds: number,
         topicsData: AppTypes.Topic[],
         topic: string,
      ): AppTypes.GameState {
         const { userStates } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(topicsData, topic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'roundScores', value: [] },
            { key: 'totalScore', value: 0 },
            { key: 'spectate', value: false },
         ]);
         const updatedCurrentTurn = GameHelper.Get.firstUser(1, userStates);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            activeTopic: topic,
            activeWord: newWord,
            currentRat: newRat,
            currentRound: 1,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: new Date().getTime() + 3000, // 3 seconds as this is how long the user role splash screen is displayed,
            userStates: updatedUserStates,
            numberOfRoundsSet: noOfRounds,
         };
         return updatedGameState;
      }

      export function resetCurrentRound(
         gameState: AppTypes.GameState,
         topicsData: AppTypes.Topic[],
      ): AppTypes.GameState {
         const { userStates, activeTopic, currentRound } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(topicsData, activeTopic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const updatedCurrentTurn = GameHelper.Get.firstUser(currentRound, userStates);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            activeWord: newWord,
            currentRat: newRat,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: new Date().getTime(),
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export function nextRound(
         gameState: AppTypes.GameState,
         topicsData: AppTypes.Topic[],
         newTopic: string,
      ): AppTypes.GameState {
         const { userStates } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const { currentRound } = gameState;
         const newWord = GameHelper.New.word(topicsData, newTopic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'guess', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const newRoundNo = currentRound + 1;
         const updatedCurrentTurn = GameHelper.Get.firstUser(newRoundNo, userStates);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            activeTopic: newTopic,
            activeWord: newWord,
            currentRat: newRat,
            currentRound: newRoundNo,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: new Date().getTime() + 3000, // 3 seconds as this is how long the user role splash screen is displayed
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export function skipCurrentTurn(gameState: AppTypes.GameState): AppTypes.GameState {
         const { currentTurn, userStates, currentRat } = gameState;
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const currentGamePhase = GameHelper.Get.gamePhase(gameState);
         if (currentGamePhase === 'roundSummary') {
            throw new Error('Cannot skip turn during round summary');
         }
         const isNextPhaseRoundSummary = currentGamePhase === 'guess';
         const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(
            gameState,
            currentTurnUserId,
            currentGamePhase,
            currentRat,
         );
         const updatedUserStates = GameHelper.SetUserStates.updateUser(
            userStates,
            currentTurnUserId,
            [{ key: currentGamePhase, value: 'SKIP' }],
         );
         const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
            { key: 'currentTurn', value: updatedCurrentTurn },
            {
               key: 'currentTurnChangedAt',
               value: isNextPhaseRoundSummary ? '' : new Date().getTime(),
            },
            { key: 'userStates', value: updatedUserStates },
         ]);

         if (isNextPhaseRoundSummary) {
            return GameHelper.SetGameState.userPoints(updatedGameState);
         }
         return updatedGameState;
      }

      export function keysVals<T extends keyof AppTypes.GameState>(
         gameState: AppTypes.GameState,
         keyVals: { key: T; value: AppTypes.GameState[T] }[],
      ): AppTypes.GameState {
         const updatedGameState: typeof gameState = JSON.parse(JSON.stringify(gameState));
         keyVals.forEach((keyVal) => {
            updatedGameState[keyVal.key] = keyVal.value;
         });
         return updatedGameState;
      }
   }

   export namespace SetUserStates {
      export function updateUser<T extends keyof AppTypes.UserState>(
         userStates: AppTypes.UserState[],
         userId: string,
         keyVals: { key: T; value: AppTypes.UserState[T] }[],
      ): AppTypes.UserState[] {
         const userState = Get.userState(userId, userStates);
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
