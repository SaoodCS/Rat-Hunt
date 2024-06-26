/* eslint-disable @typescript-eslint/naming-convention */
import type { AxiosStatic } from 'axios';
import ArrayHelper from '../../lib/helpers/arrayHelper/ArrayHelper';
import ArrOfObj from '../../lib/helpers/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../lib/helpers/date/DateHelper';
import MiscHelper from '../../lib/helpers/miscHelper/MiscHelper';
import NumberHelper from '../../lib/helpers/number/NumberHelper';
import type AppTypes from '../types/AppTypes';
import { topics } from '../utils/topics/topics';

export namespace GameHelper {
   export namespace I {
      export interface WordCell {
         cellId: string;
         word: string;
      }
   }

   export namespace CONSTANTS {
      export const TURN_TIME_LIMIT_SECONDS = 30;
      export const DISCONNECTED_USER_TIME_LIMIT_MS = NumberHelper.minsToMs(5);
      export const MIN_PLAYERS_TO_START_GAME = 3;
      export const MAX_PLAYERS_IN_ROOM = 20;
   }

   export namespace New {
      export function word(activeTopic: string): string {
         const topic = Get.topic(activeTopic);
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
         const { ratGuess } = gameState;
         return ratGuess !== '';
      }

      export function isRatGuessCorrect(gameState: AppTypes.GameState): boolean {
         const { activeWord, ratGuess } = gameState;
         return ratGuess === activeWord;
      }

      export function userVotedForRat(gameState: AppTypes.GameState, userId: string): boolean {
         const ratVoters = Get.ratVoters(gameState);
         return ratVoters.includes(userId);
      }

      export function isFinalUserToVote(gameState: AppTypes.GameState, userId: string): boolean {
         const { userStates } = gameState;
         const thisUserState = Get.userState(userId, userStates);
         const thisUserHasNotVoted = thisUserState.votedFor === '';
         const userStatesWithoutUser = ArrOfObj.filterOut(userStates, 'userId', userId);
         const allVotedForValuesExist = !ArrOfObj.hasKeyVal(userStatesWithoutUser, 'votedFor', '');
         return allVotedForValuesExist && thisUserHasNotVoted;
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
      export function topic(topicKey: string): AppTypes.Topic {
         const topic = ArrOfObj.getObj(topics, 'key', topicKey);
         if (!MiscHelper.isNotFalsyOrEmpty(topic)) {
            throw new Error('Topic does not exist in topicsData.');
         }
         return topic;
      }

      export function topicWordsAndCells(activeTopic: string): GameHelper.I.WordCell[] {
         const topicObj = Get.topic(activeTopic);
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

      export function sortedUserStates(
         userStates: AppTypes.UserState[],
         turnQueue: AppTypes.GameState['turnQueue'],
      ): AppTypes.UserState[] {
         return ArrOfObj.orderByArrOfVals(userStates, 'userId', turnQueue);
      }

      export function firstUser(turnQueue: string[]): string {
         return turnQueue[0];
      }

      export function lastUser(turnQueue: string[]): string {
         return turnQueue[turnQueue.length - 1];
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

      export function nextTurnUserId(gameState: AppTypes.GameState): string {
         const { currentTurn, currentRat, turnQueue, userStates } = gameState;
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const areAllCluesSubmitted = !ArrOfObj.hasKeyVal(userStates, 'clue', '');
         const areAllVotesSubmitted = !ArrOfObj.hasKeyVal(userStates, 'votedFor', '');
         const firstUserInQueue = Get.firstUser(turnQueue);
         const lastUserInQueue = Get.lastUser(turnQueue);
         const isLastUserInQueue = currentTurnUserId === lastUserInQueue;
         const queuePosition = turnQueue.indexOf(currentTurnUserId);
         const isFinalUserToVote = Check.isFinalUserToVote(gameState, currentTurnUserId);
         const isCurrentTurnUserRat = currentTurnUserId === currentRat;
         if (!areAllCluesSubmitted) {
            if (isLastUserInQueue) return firstUserInQueue;
            return turnQueue[queuePosition + 1];
         }
         if (!areAllVotesSubmitted) {
            if (isFinalUserToVote) return `${currentRat}.wordGuess`;
            if (isLastUserInQueue) return firstUserInQueue;
            return turnQueue[queuePosition + 1];
         }
         if (isCurrentTurnUserRat) return '';
         return `${currentRat}.wordGuess`;
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
         const { userStates } = gameState;
         const hasRatGuessed = GameHelper.Check.hasRatGuessed(gameState);
         const allCluesExist = !ArrOfObj.hasKeyVal(userStates, 'clue', '');
         const allVotedForValuesExist = !ArrOfObj.hasKeyVal(userStates, 'votedFor', '');
         if (!allCluesExist) return 'clue';
         if (!allVotedForValuesExist) return 'votedFor';
         if (!hasRatGuessed) return 'guess';
         return 'roundSummary';
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

      export async function newRoom(
         generatedRoomId: string,
         hostUserId: string,
         topic: string,
         noOfRounds: number,
         axios: AxiosStatic,
      ): Promise<AppTypes.Room> {
         const currentTime = await DateHelper.getCurrentTime(axios);
         return {
            gameStarted: false,
            roomId: generatedRoomId,
            gameState: {
               activeTopic: topic,
               activeWord: '',
               currentRat: '',
               ratGuess: '',
               currentRound: 0,
               numberOfRoundsSet: noOfRounds,
               currentTurn: '',
               currentTurnChangedAt: '',
               turnQueue: [hostUserId],
               userStates: [
                  {
                     userId: hostUserId,
                     totalScore: 0,
                     roundScores: [],
                     clue: '',
                     votedFor: '',
                     spectate: false,
                     userStatus: 'connected',
                     statusUpdatedAt: currentTime,
                  },
               ],
            },
         };
      }

      export async function newUser(
         roomData: AppTypes.Room,
         userId: string,
         axios: AxiosStatic,
      ): Promise<AppTypes.Room> {
         const { gameStarted, gameState } = roomData;
         const { userStates, turnQueue } = gameState;
         const currentTime = await DateHelper.getCurrentTime(axios);
         const newUserState: AppTypes.UserState = {
            userId,
            totalScore: 0,
            roundScores: [],
            clue: gameStarted ? 'SKIP' : '',
            votedFor: gameStarted ? 'SKIP' : '',
            spectate: gameStarted,
            userStatus: 'connected',
            statusUpdatedAt: currentTime,
         };
         const updatedQueue = ArrayHelper.push(turnQueue, userId);
         const updatedUserStates = [...userStates, newUserState];
         const updatedGameState = {
            ...gameState,
            userStates: updatedUserStates,
            turnQueue: updatedQueue,
         };
         return { ...roomData, gameState: updatedGameState };
      }

      export async function removeUser(
         roomData: AppTypes.Room,
         userId: string,
         axios: AxiosStatic,
      ): Promise<AppTypes.Room> {
         const { gameState } = roomData;
         const { currentRat, userStates, turnQueue, currentTurn } = gameState;
         const gamePhase = GameHelper.Get.gamePhase(gameState);
         const gameStateWithoutUser = GameHelper.SetGameState.keysVals(gameState, [
            { key: 'userStates', value: ArrOfObj.filterOut(userStates, 'userId', userId) },
            { key: 'turnQueue', value: ArrayHelper.filterOut(turnQueue, userId) },
         ]);

         if (currentRat === userId && gamePhase !== 'roundSummary') {
            const updatedGameState = await GameHelper.SetGameState.resetCurrentRound(
               gameStateWithoutUser,
               axios,
            );
            return GameHelper.SetRoomState.keysVals(roomData, [
               { key: 'gameState', value: updatedGameState },
            ]);
         }

         if (GameHelper.Get.currentTurnUserId(currentTurn) === userId) {
            const nextUser = GameHelper.Get.nextTurnUserId(gameState);
            const updatedGameState = GameHelper.SetGameState.keysVals(gameStateWithoutUser, [
               { key: 'currentTurn', value: nextUser },
            ]);
            return GameHelper.SetRoomState.keysVals(roomData, [
               { key: 'gameState', value: updatedGameState },
            ]);
         }

         return GameHelper.SetRoomState.keysVals(roomData, [
            { key: 'gameState', value: gameStateWithoutUser },
         ]);
      }
   }

   export namespace SetGameState {
      export function userPoints(gameState: AppTypes.GameState): AppTypes.GameState {
         const { userStates, currentRat, activeWord, ratGuess } = gameState;
         const ratVoters = Get.ratVoters(gameState);
         const noUserVotedForRat = ratVoters.length === 0;
         const ratGuessedCorrectly = ratGuess === activeWord;
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

      export async function resetGame(
         gameState: AppTypes.GameState,
         noOfRounds: number,
         topic: string,
         axios: AxiosStatic,
      ): Promise<AppTypes.GameState> {
         const { userStates, turnQueue } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(topic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'roundScores', value: [] },
            { key: 'totalScore', value: 0 },
            { key: 'spectate', value: false },
         ]);
         const updatedCurrentTurn = GameHelper.Get.firstUser(turnQueue);
         const currentTime = await DateHelper.getCurrentTime(axios);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            activeTopic: topic,
            activeWord: newWord,
            currentRat: newRat,
            ratGuess: '',
            currentRound: 1,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: currentTime + 3, // 3 seconds as this is how long the user role splash screen is displayed,
            userStates: updatedUserStates,
            numberOfRoundsSet: noOfRounds,
         };
         return updatedGameState;
      }

      export async function resetCurrentRound(
         gameState: AppTypes.GameState,
         axios: AxiosStatic,
      ): Promise<AppTypes.GameState> {
         const { userStates, activeTopic, turnQueue } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const newWord = GameHelper.New.word(activeTopic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const currentTime = await DateHelper.getCurrentTime(axios);
         const updatedCurrentTurn = GameHelper.Get.firstUser(turnQueue);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            ratGuess: '',
            activeWord: newWord,
            currentRat: newRat,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: currentTime,
            userStates: updatedUserStates,
         };
         return updatedGameState;
      }

      export async function nextRound(
         gameState: AppTypes.GameState,
         newTopic: string,
         axios: AxiosStatic,
      ): Promise<AppTypes.GameState> {
         const { userStates, turnQueue } = gameState;
         const newRat = ArrOfObj.getRandItem(userStates).userId;
         const { currentRound } = gameState;
         const newWord = GameHelper.New.word(newTopic);
         const updatedUserStates = ArrOfObj.setKeyValsInAllObjects(userStates, [
            { key: 'clue', value: '' },
            { key: 'votedFor', value: '' },
            { key: 'spectate', value: false },
         ]);
         const newRoundNo = currentRound + 1;
         const updatedTurnQueue = ArrayHelper.shiftLeftByOne(turnQueue);
         const updatedCurrentTurn = GameHelper.Get.firstUser(updatedTurnQueue);
         const currentTime = await DateHelper.getCurrentTime(axios);
         const updatedGameState: AppTypes.GameState = {
            ...gameState,
            activeTopic: newTopic,
            ratGuess: '',
            activeWord: newWord,
            currentRat: newRat,
            currentRound: newRoundNo,
            currentTurn: updatedCurrentTurn,
            currentTurnChangedAt: currentTime + 3, // 3 seconds as this is how long the user role splash screen is displayed
            userStates: updatedUserStates,
            turnQueue: updatedTurnQueue,
         };
         return updatedGameState;
      }

      export async function skipCurrentTurn(
         gameState: AppTypes.GameState,
         axios: AxiosStatic,
      ): Promise<AppTypes.GameState> {
         const { currentTurn, userStates } = gameState;
         const currentTurnUserId = GameHelper.Get.currentTurnUserId(currentTurn);
         const currentGamePhase = GameHelper.Get.gamePhase(gameState);
         if (currentGamePhase === 'roundSummary') {
            throw new Error('Cannot skip turn during round summary');
         }
         const isNextPhaseRoundSummary = currentGamePhase === 'guess';
         const updatedCurrentTurn = GameHelper.Get.nextTurnUserId(gameState);
         let updatedUserStates: AppTypes.UserState[] = [];
         if (currentGamePhase === 'guess') updatedUserStates = userStates;
         else {
            updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, currentTurnUserId, [
               { key: currentGamePhase, value: 'SKIP' },
            ]);
         }
         const currentTime = await DateHelper.getCurrentTime(axios);
         const updatedGameState = GameHelper.SetGameState.keysVals(gameState, [
            { key: 'currentTurn', value: updatedCurrentTurn },
            {
               key: 'currentTurnChangedAt',
               value: isNextPhaseRoundSummary ? '' : currentTime,
            },
            { key: 'ratGuess', value: currentGamePhase === 'guess' ? 'SKIP' : '' },
            {
               key: 'userStates',
               value: updatedUserStates,
            },
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
