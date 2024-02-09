import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../global/firebase/config/config';
import APIHelper from '../../../global/firebase/apis/helper/NApiHelper';
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
         deliberateExit: boolean;
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
                  const docRef = doc(firestore, key.collection, roomId);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                     return docSnap.data().room;
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
                  const docRef = doc(firestore, key.collection, roomData.roomId);
                  await setDoc(docRef, { room: roomData });
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            { ...options },
         );
      }
   }
}

export default FirestoreDB;
