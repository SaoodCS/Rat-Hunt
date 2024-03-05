import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import {
   arrayRemove,
   arrayUnion,
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   setDoc,
   updateDoc,
} from 'firebase/firestore';
import APIHelper from '../../../global/firebase/apis/helper/NApiHelper';
import { firestore } from '../../../global/firebase/config/config';
import ArrayHelper from '../../../global/helpers/dataTypes/arrayHelper/ArrayHelper';
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { useCustomMutation } from '../../../global/hooks/useCustomMutation';

export namespace FirestoreDB {
   export namespace Topics {
      export interface ITopics {
         key: string;
         values: string[];
      }

      export const key = {
         getTopics: 'getTopics',
      };

      export function getTopicsQuery(
         options: UseQueryOptions<ITopics[]> = {},
      ): UseQueryResult<ITopics[], unknown> {
         return useQuery({
            queryKey: [key.getTopics],
            queryFn: async (): Promise<ITopics[]> => {
               try {
                  const docRef = doc(firestore, 'topics', 'topics');
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                     return docSnap.data().topics;
                  }
                  throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            ...options,
         });
      }
   }

   export namespace Room {
      export interface IUser {
         userStatus: 'connected' | 'disconnected';
         statusUpdatedAt: string;
         //score: number;
         userId: string;
      }
      export interface IUserStates {
         userId: string;
         totalScore: number; // totalScore = totalScore + roundScore at the end of each round (not reset)
         roundScores: number[]; // roundScores[0] = score for round 1, roundScores[1] = score for round 2, etc.
         clue: string; // set when user's turn + reset to empty string at start of each round
         guess: string; // only the rat guesses the word at the end of the round + then reset at the start of each round
         votedFor: string; // set when user votes for who they think the rat is at the end of the round + reset to empty string at start of each round
      }
      export interface IGameState {
         activeTopic: string; // set randomly at the start of each round
         activeWord: string; // set randomly at the start of each round
         currentRat: string; // set randomly at the start of each round
         currentRound: number; // starts at 1 when game starts and increments by 1 at the start of each round
         numberOfRoundsSet: number; // default value of 5. Can implement logic for the room creator to set this value later
         currentTurn: string; // when implementing this, ensure that no user has more than one turn (e.g. by using a queue system or checking which user's clue field is an empty string)
         userStates: IUserStates[];
      }
      export interface IRoom {
         //activeTopic: string;
         gameStarted: boolean;
         roomId: string;
         users: IUser[];
         gameState: IGameState;
      }

      export const key = {
         getRoom: 'getRoom',
         collection: 'games',
      };

      export function getRoomQuery(
         roomId: string,
         options: UseQueryOptions<IRoom> = {},
      ): UseQueryResult<IRoom, unknown> {
         return useQuery({
            queryKey: [key.getRoom],
            queryFn: async (): Promise<IRoom> => {
               try {
                  if (roomId === '') return {} as IRoom;
                  const docRef = doc(firestore, key.collection, `room-${roomId}`);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                     return docSnap.data() as IRoom;
                  }
                  throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            ...options,
         });
      }

      export function setRoomMutation(
         options: UseMutationOptions<void, unknown, IRoom>,
         showLoader = true,
      ): UseMutationResult<void, unknown, IRoom, void> {
         return useCustomMutation(
            async (roomData: IRoom) => {
               try {
                  const docRef = doc(firestore, key.collection, `room-${roomData.roomId}`);
                  await setDoc(docRef, { ...roomData });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
            showLoader,
         );
      }

      interface IAddUserToRoomMutation {
         roomId: string;
         userObjForUsers: IUser;
         userObjForUserState: IUserStates;
         gameStateObj: IGameState;
      }

      export function addUserToRoomMutation(
         options: UseMutationOptions<void, unknown, IAddUserToRoomMutation>,
      ): UseMutationResult<void, unknown, IAddUserToRoomMutation, void> {
         return useCustomMutation(
            async (params: IAddUserToRoomMutation) => {
               try {
                  const { roomId, userObjForUsers, userObjForUserState, gameStateObj } = params;
                  const docRef = doc(firestore, key.collection, `room-${roomId}`);
                  await updateDoc(docRef, {
                     users: arrayUnion(userObjForUsers),
                     gameState: {
                        ...gameStateObj,
                        userStates: [...gameStateObj.userStates, userObjForUserState],
                     },
                  });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
         );
      }

      interface IUpdateGameStartedParam {
         gameStarted: boolean;
         roomId: string;
      }

      export function updateGameStartedMutation(
         options: UseMutationOptions<void, unknown, IUpdateGameStartedParam>,
      ): UseMutationResult<void, unknown, IUpdateGameStartedParam, void> {
         return useCustomMutation(
            async (params: IUpdateGameStartedParam) => {
               const { gameStarted, roomId } = params;
               try {
                  const docRef = doc(firestore, key.collection, `room-${roomId}`);
                  await updateDoc(docRef, { gameStarted });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
         );
      }

      interface IUpdateRoomStateMutation {
         roomState: IRoom;
         roomId: string;
      }

      export function updateRoomStateMutation(
         options: UseMutationOptions<void, unknown, IUpdateRoomStateMutation>,
         showLoader = true,
      ): UseMutationResult<void, unknown, IUpdateRoomStateMutation, void> {
         return useCustomMutation(
            async (params: IUpdateRoomStateMutation) => {
               const { roomState, roomId } = params;
               try {
                  const docRef = doc(firestore, key.collection, `room-${roomId}`);
                  await updateDoc(docRef, { ...roomState });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
            showLoader,
         );
      }

      interface IUpdateGameStateMutation {
         gameState: IGameState;
         roomId: string;
      }

      export function updateGameStateMutation(
         options: UseMutationOptions<void, unknown, IUpdateGameStateMutation>,
         showLoader = true,
      ): UseMutationResult<void, unknown, IUpdateGameStateMutation, void> {
         return useCustomMutation(
            async (params: IUpdateGameStateMutation) => {
               const { gameState, roomId } = params;
               try {
                  const docRef = doc(firestore, key.collection, `room-${roomId}`);
                  await updateDoc(docRef, { gameState });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
            showLoader,
         );
      }

      interface IDeleteUserParam {
         roomData: FirestoreDB.Room.IRoom;
         userId: string;
      }

      export function deleteUserMutation(
         options: UseMutationOptions<void, unknown, IDeleteUserParam>,
      ): UseMutationResult<void, unknown, IDeleteUserParam, void> {
         return useCustomMutation(
            async (userData: IDeleteUserParam) => {
               try {
                  const { roomData, userId } = userData;
                  const docRef = doc(firestore, key.collection, `room-${roomData.roomId}`);
                  if (!userId) return;
                  const userInUsers = ArrayOfObjects.getObjWithKeyValuePair(
                     roomData.users,
                     'userId',
                     userId,
                  );
                  const updatedUserStates = ArrayOfObjects.filterOut(
                     roomData.gameState.userStates,
                     'userId',
                     userId,
                  );

                  await updateDoc(docRef, {
                     users: arrayRemove(userInUsers),
                     gameState: {
                        ...roomData.gameState,
                        userStates: updatedUserStates,
                     },
                  });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
         );
      }

      interface IDeleteRoomParam {
         roomId: string;
      }

      export function deleteRoomMutation(
         options: UseMutationOptions<void, unknown, IDeleteRoomParam>,
      ): UseMutationResult<void, unknown, IDeleteRoomParam, void> {
         return useCustomMutation(
            async (params: IDeleteRoomParam) => {
               try {
                  const docRef = doc(firestore, key.collection, `room-${params.roomId}`);
                  await deleteDoc(docRef);
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
         );
      }

      export function generateUniqueId(existingRoomIds: string[]): string {
         let newId = '';
         let idExists = true;
         while (idExists) {
            newId = Math.random().toString(36).substring(2, 7);
            idExists = existingRoomIds.includes(newId);
         }
         return newId;
      }

      export function randNewTopicKey(
         activeTopic: string,
         topicData: FirestoreDB.Topics.ITopics[],
      ): string {
         const newTopic = topicData[Math.floor(Math.random() * topicData.length)].key;
         return newTopic === activeTopic ? randNewTopicKey(activeTopic, topicData) : newTopic;
      }

      export interface IActiveTopicWords {
         cellId: string;
         word: string;
      }

      export function getActiveTopicWords(
         topics: Topics.ITopics[],
         activeTopic: string,
      ): IActiveTopicWords[] {
         const topicObj = ArrayOfObjects.getObjWithKeyValuePair(topics, 'key', activeTopic);
         const words = topicObj.values;
         const sortedWords = ArrayHelper.sort(words);
         const words16 = sortedWords.slice(0, 16);
         const wordsWithCellIds: IActiveTopicWords[] = [];
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

      export function calculatePoints(gameState: IGameState): IGameState {
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

         const updatedRatUserState: IUserStates = {
            ...rat,
            totalScore: rat.totalScore + (ratGets2Points ? 2 : ratGets1Point ? 1 : 0),
            roundScores: [...rat.roundScores, ratGets2Points ? 2 : ratGets1Point ? 1 : 0],
         };
         const userStatesWithoutRat: IUserStates[] = filterOut(userStates, 'userId', currentRat);
         const updatedUserStates: IUserStates[] = userStatesWithoutRat.map((userState) => {
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
         });

         const updatedGameState: IGameState = {
            ...gameState,
            userStates: [...updatedUserStates, updatedRatUserState],
         };
         return updatedGameState;
      }

      export function updateGameStateForNextRound(options: {
         disconnectedUsersIds: string[];
         gameState: IGameState;
         topicsData: FirestoreDB.Topics.ITopics[];
         newTopic: string;
         resetRoundToOne?: boolean;
         resetScores?: boolean;
         newNoOfRounds?: number;
         resetCurrentRound?: boolean;
         delUserFromUserStateId?: string;
      }): IGameState {
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
         // NOTE: this function now only sets the next turn and current rat to a user who is connected
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
         const connectedUsersStates = ArrayOfObjects.filterOutValues(
            userStatesWithoutDelUser,
            'userId',
            disconnectedUsersIds,
         );
         const connectedUsersIds = ArrayOfObjects.getArrOfValuesFromKey(
            connectedUsersStates,
            'userId',
         );
         const newRat = connectedUsersIds[Math.floor(Math.random() * connectedUsersIds.length)];
         const { currentRound, numberOfRoundsSet } = gameState;
         const newWords = getActiveTopicWords(topicsData, newTopic);
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
         const sortedUserStates = ArrayOfObjects.sort(connectedUsersStates, 'userId');
         const updatedCurrentTurn = sortedUserStates[0].userId;
         const updatedGameState: IGameState = {
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

      export function getNextTurnUser(
         userStates: IUserStates[],
         localDbUser: string,
         type: 'ratVote' | 'clue' | 'guess' | 'leaveRoom',
         currentRat: string,
         disconnectedUsersIds: string[],
      ): string {
         // NOTE: this function now only sets the next turn to a user who is connected
         const connectedUsersStates = ArrayOfObjects.filterOutValues(
            userStates,
            'userId',
            disconnectedUsersIds,
         );
         const sortedUserStates = ArrayOfObjects.sort(connectedUsersStates, 'userId');
         const thisUserIndex = sortedUserStates.findIndex((u) => u.userId === localDbUser);
         const userStatesWithoutThisUser = ArrayOfObjects.filterOut(
            connectedUsersStates,
            'userId',
            localDbUser,
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
         if (type === 'ratVote') {
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
         const thisUserIsRat = currentRat === localDbUser;
         const ratUserState = ArrayOfObjects.getObjWithKeyValuePair(
            userStates,
            'userId',
            currentRat,
         );
         const ratSubmittedGuess = ratUserState.guess !== '';
         if (ratSubmittedGuess) return '';
         if (thisUserIsRat) return sortedUserStates[0].userId; // if it is the rat user's go and they leave the room, the current turn will be reset to the first user
         if (allVotesSubmitted) return `${currentRat}.wordGuess`;
         if (allCluesSubmitted) return sortedUserStates[0].userId;
         // If not all clues are submitted:
         const firstUser = sortedUserStates[0].userId;
         const nextUser = sortedUserStates[thisUserIndex + 1]?.userId || firstUser;
         const updatedCurrentTurn = nextUser;
         return updatedCurrentTurn;
      }
   }

   export namespace Game {
      export const key = {
         collection: 'games',
         getAllRoomIds: 'getAllRoomIds',
      };

      export function getAllRoomIdsQuery(
         options: UseQueryOptions<string[]> = {},
      ): UseQueryResult<string[], unknown> {
         return useQuery({
            queryKey: [key.getAllRoomIds],
            queryFn: async (): Promise<string[]> => {
               try {
                  const roomIds: string[] = [];
                  const querySnapshot = await getDocs(collection(firestore, key.collection));
                  querySnapshot.forEach((doc) => {
                     roomIds.push(doc.id);
                  });
                  return roomIds;
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            ...options,
         });
      }
   }
}

export default FirestoreDB;
