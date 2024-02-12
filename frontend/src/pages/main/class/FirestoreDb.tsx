import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import {
   arrayRemove,
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
         lastOnline: string;
         score: number;
         userId: string;
      }

      export interface IRoom {
         activeTopic: string;
         gameStarted: boolean;
         roomId: string;
         users: IUser[];
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
         user: IUser | undefined;
      }

      export function deleteUserMutation(
         options: UseMutationOptions<void, unknown, IDeleteUserParam>,
      ): UseMutationResult<void, unknown, IDeleteUserParam, void> {
         return useCustomMutation(
            async (userData: IDeleteUserParam) => {
               try {
                  const docRef = doc(firestore, key.collection, `room-${userData.roomData.roomId}`);
                  await updateDoc(docRef, {
                     users: arrayRemove(userData.user),
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
