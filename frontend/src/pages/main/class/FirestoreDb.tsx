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
import ArrayOfObjects from '../../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { useCustomMutation } from '../../../global/hooks/useCustomMutation';

export namespace FirestoreDB {
   export namespace Topics {
      interface ITopics {
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
         roundScore: number; // set based on the score system + reset to 0 at start of each round
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
                  console.log('Get Room Query Is Running: ', roomId);
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
   }

   export namespace Game {
      export const key = {
         collection: 'games',
         getAllRoomIds: 'getAllRoomIds',
      };

      // get the document id's of all the documents in the collection and return them as an array of strings:
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
