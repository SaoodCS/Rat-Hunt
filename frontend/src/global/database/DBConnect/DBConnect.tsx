import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref, remove, set } from 'firebase/database';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import type AppTypes from '../../../../../shared/app/types/AppTypes';
import ArrOfObj from '../../../../../shared/helpers/arrayOfObjects/arrayOfObjects';
import { useCustomMutation } from '../../hooks/useCustomMutation';
import APIHelper from '../ApiHelper/NApiHelper';
import { firebaseRTDB, firestore } from '../config/config';

export namespace DBConnect {
   /* -- FIRESTORE DB -- */
   export namespace FSDB {
      // -- CONSTANTS -- //
      export const CONSTS = {
         ROOM_DOC_PREFIX: 'room-',
         GAME_COLLECTION: 'games',
         TOPICS_COLLECTION: 'topics',
         TOPICS_DOC: 'topics',
         QUERY_KEYS: {
            GET_TOPICS: 'getTopics',
            GET_ROOM: 'getRoom',
            GET_ALL_ROOM_IDS: 'getAllRoomIds',
         },
      };
      // -- GET QUERIES -- //
      export namespace Get {
         export function room(
            roomId: string,
            options: UseQueryOptions<AppTypes.Room> = {},
         ): UseQueryResult<AppTypes.Room, unknown> {
            return useQuery({
               queryKey: [CONSTS.QUERY_KEYS.GET_ROOM],
               queryFn: async (): Promise<AppTypes.Room> => {
                  try {
                     if (roomId === '') return {} as AppTypes.Room;
                     const docRef = doc(
                        firestore,
                        CONSTS.GAME_COLLECTION,
                        `${CONSTS.ROOM_DOC_PREFIX}${roomId}`,
                     );
                     const docSnap = await getDoc(docRef);
                     if (docSnap.exists()) {
                        return docSnap.data() as AppTypes.Room;
                     }
                     throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
                  } catch (e) {
                     throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
                  }
               },
               ...options,
            });
         }

         export function topics(
            options: UseQueryOptions<AppTypes.Topic[]> = {},
         ): UseQueryResult<AppTypes.Topic[], unknown> {
            return useQuery({
               queryKey: [CONSTS.QUERY_KEYS.GET_TOPICS],
               queryFn: async (): Promise<AppTypes.Topic[]> => {
                  try {
                     const docRef = doc(firestore, CONSTS.TOPICS_COLLECTION, CONSTS.TOPICS_DOC);
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

         export function allRoomIds(
            options: UseQueryOptions<string[]> = {},
         ): UseQueryResult<string[], unknown> {
            return useQuery({
               queryKey: [CONSTS.QUERY_KEYS.GET_ALL_ROOM_IDS],
               queryFn: async (): Promise<string[]> => {
                  try {
                     const roomIds: string[] = [];
                     const querySnapshot = await getDocs(
                        collection(firestore, CONSTS.GAME_COLLECTION),
                     );
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

      // -- SET MUTATIONS -- //
      export namespace Set {
         export function room(
            options: UseMutationOptions<void, unknown, AppTypes.Room>,
            showLoader = true,
         ): UseMutationResult<void, unknown, AppTypes.Room, void> {
            // NOTE: I got rid of the updateDoc version of this and just replaced it's calls with this one (when debugging, check if this causes any issues)
            return useCustomMutation(
               async (roomData: AppTypes.Room) => {
                  try {
                     const docRef = doc(
                        firestore,
                        CONSTS.GAME_COLLECTION,
                        `${CONSTS.ROOM_DOC_PREFIX}${roomData.roomId}`,
                     );
                     await setDoc(docRef, { ...roomData });
                  } catch (e) {
                     throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
                  }
               },
               { ...options },
               showLoader,
            );
         }

         interface ISetGameState {
            gameState: AppTypes.GameState;
            roomId: string;
         }
         export function gameState(
            options: UseMutationOptions<void, unknown, ISetGameState>,
            showLoader = true,
         ): UseMutationResult<void, unknown, ISetGameState, void> {
            return useCustomMutation(
               async (params: ISetGameState) => {
                  const { gameState, roomId } = params;
                  try {
                     const docRef = doc(
                        firestore,
                        CONSTS.GAME_COLLECTION,
                        `${CONSTS.ROOM_DOC_PREFIX}${roomId}`,
                     );
                     await updateDoc(docRef, { gameState });
                  } catch (e) {
                     throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
                  }
               },
               { ...options },
               showLoader,
            );
         }
      }

      export namespace Delete {
         interface IDeleteUser {
            roomData: AppTypes.Room;
            userId: string;
         }
         export function user(
            options: UseMutationOptions<void, unknown, IDeleteUser>,
         ): UseMutationResult<void, unknown, IDeleteUser, void> {
            return useCustomMutation(
               async (userData: IDeleteUser) => {
                  try {
                     const { roomData, userId } = userData;
                     const docRef = doc(
                        firestore,
                        CONSTS.GAME_COLLECTION,
                        `${CONSTS.ROOM_DOC_PREFIX}${roomData.roomId}`,
                     );
                     if (!userId) return;
                     const updatedUserStates = ArrOfObj.filterOut(
                        roomData.gameState.userStates,
                        'userId',
                        userId,
                     );

                     await updateDoc(docRef, {
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

         interface IDeleteRoom {
            roomId: string;
         }
         export function room(
            options: UseMutationOptions<void, unknown, IDeleteRoom>,
         ): UseMutationResult<void, unknown, IDeleteRoom, void> {
            return useCustomMutation(
               async (params: IDeleteRoom) => {
                  try {
                     const docRef = doc(
                        firestore,
                        CONSTS.GAME_COLLECTION,
                        `${CONSTS.ROOM_DOC_PREFIX}${params.roomId}`,
                     );
                     await deleteDoc(docRef);
                  } catch (e) {
                     throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
                  }
               },
               { ...options },
            );
         }
      }
   }

   /* -- REALTIME DB -- */
   export namespace RTDB {
      // -- SET MUTATIONS -- //
      export namespace Set {
         export async function userStatus(userId: string, roomId: string): Promise<void> {
            if (!userId || !roomId) {
               console.error('User ID or Room not available.');
               return;
            }
            const userStatusRef: DatabaseReference = ref(
               firebaseRTDB,
               `/rooms/${roomId}/${userId}`,
            );
            const connectedStatus = { userStatus: 'connected' };
            await set(userStatusRef, connectedStatus);
            await onDisconnect(userStatusRef).set({
               userStatus: 'disconnected',
            });
         }
      }

      export namespace Delete {
         export async function user(userId: string, roomId: string): Promise<void> {
            if (!userId || !roomId) {
               console.error('User ID or Room not available.');
               return;
            }
            const userStatusRef: DatabaseReference = ref(
               firebaseRTDB,
               `/rooms/${roomId}/${userId}`,
            );
            await remove(userStatusRef);
         }

         export async function room(roomId: string): Promise<void> {
            if (!roomId) {
               console.error('Room not available. Room cannot be deleted.');
               return;
            }
            const roomRef: DatabaseReference = ref(firebaseRTDB, `/rooms/${roomId}`);
            await set(roomRef, null);
         }
      }
   }

   /* -- LOCAL DB -- */
   export namespace Local {
      export const STORAGE_KEYS = {
         USER: 'localUsername',
         ROOM: 'localRoom',
      };
   }
}

export default DBConnect;