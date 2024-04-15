import type {
   UseMutationOptions,
   UseMutationResult,
   UseQueryOptions,
   UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { DatabaseReference } from 'firebase/database';
import { get, onDisconnect, ref, remove, set } from 'firebase/database';
import type { DocumentReference } from 'firebase/firestore';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import type AppTypes from '../../../../../shared/app/types/AppTypes';
import ArrOfObj from '../../../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
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
         export function roomRef(roomId: string): DocumentReference {
            return doc(firestore, CONSTS.GAME_COLLECTION, `${CONSTS.ROOM_DOC_PREFIX}${roomId}`);
         }

         export function room(
            roomId: string,
            options: UseQueryOptions<AppTypes.Room> = {},
         ): UseQueryResult<AppTypes.Room, unknown> {
            return useQuery({
               queryKey: [CONSTS.QUERY_KEYS.GET_ROOM],
               queryFn: async (): Promise<AppTypes.Room> => {
                  try {
                     if (roomId === '') return {} as AppTypes.Room;
                     const docRef = roomRef(roomId);
                     const docSnap = await getDoc(docRef);
                     if (docSnap.exists()) {
                        return docSnap.data() as AppTypes.Room;
                     }
                     throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
                  } catch (e) {
                     throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
                  }
               },
               enabled: false, // NOTE: May be useful to do this and let the onSnapshot listener handle the updates
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
                     const docRef = Get.roomRef(roomData.roomId);
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
                     const docRef = Get.roomRef(roomId);
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
                     const docRef = Get.roomRef(roomData.roomId);
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
                     const docRef = Get.roomRef(params.roomId);
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
      // -- GET QUERIES -- //
      export namespace Get {
         export function userRef(roomId: string, userId: string): DatabaseReference {
            return ref(firebaseRTDB, `/rooms/${roomId}/${userId}`);
         }

         export function roomRef(roomId: string): DatabaseReference {
            return ref(firebaseRTDB, `/rooms/${roomId}`);
         }

         export async function userStatus(
            userId: string,
            roomId: string,
         ): Promise<AppTypes.UserState['userStatus'] | null> {
            const userStatusRef = userRef(roomId, userId);
            const userSnap = await get(userStatusRef);
            if (!userSnap.exists()) return null;
            const userData = userSnap.val();
            return userData.userStatus;
         }
      }

      // -- SET MUTATIONS -- //
      export namespace Set {
         export async function userStatus(userId: string, roomId: string): Promise<void> {
            const userStatusRef = Get.userRef(roomId, userId);
            const connectedStatus = { userStatus: 'connected' };
            await set(userStatusRef, connectedStatus);
            await onDisconnect(userStatusRef).set({ userStatus: 'disconnected' });
         }
      }

      // -- DELETE MUTATIONS -- //
      export namespace Delete {
         export async function user(userId: string, roomId: string): Promise<void> {
            const userStatusRef = Get.userRef(roomId, userId);
            await onDisconnect(userStatusRef).cancel();
            await remove(userStatusRef);
         }

         export async function room(roomId: string): Promise<void> {
            const roomRef = Get.roomRef(roomId);
            await onDisconnect(roomRef).cancel();
            await remove(roomRef);
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
