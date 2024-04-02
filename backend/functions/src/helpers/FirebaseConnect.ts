import * as admin from 'firebase-admin';
import type { Reference } from 'firebase-admin/database';
import type { DocumentReference } from 'firebase-admin/firestore';
import type AppTypes from '../../../../shared/app/types/AppTypes';

interface IChangeDetails {
   fullPath: string;
   roomId: AppTypes.Room['roomId'];
   userId: AppTypes.UserState['userId'];
   userStatus: AppTypes.UserState['userStatus'];
}

interface NestedObject {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   [key: string]: NestedObject | any;
}

export namespace FBConnect {
   export function getChangedStatus<T extends NestedObject>(
      originalValue: T,
      newValue: T,
      path = '',
   ): IChangeDetails {
      for (const key in newValue) {
         if (typeof newValue[key] === 'object') {
            const currentPath = path ? `${path}/${key}` : key;
            const result = FBConnect.getChangedStatus(
               originalValue[key],
               newValue[key],
               currentPath,
            );
            if (result) return result;
         } else {
            if (originalValue[key] !== newValue[key]) {
               const changedPath = path ? `${path}/${key}` : key;
               const roomId = changedPath.split('/')[1];
               const userId = changedPath.split('/')[2];
               return {
                  fullPath: changedPath,
                  roomId,
                  userId,
                  userStatus: newValue[key],
               };
            }
         }
      }
      return null as unknown as IChangeDetails;
   }

   export function getRefs(
      roomId: string,
      userId: string,
   ): {
      roomRefRT: Reference;
      userRefRT: Reference;
      roomRefFS: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
   } {
      const roomRefFS = admin.firestore().collection('games').doc(`room-${roomId}`);
      const roomRefRT = admin.database().ref(`/rooms/${roomId}`);
      const userRefRT = admin.database().ref(`/rooms/${roomId}/${userId}`);
      return { roomRefRT, userRefRT, roomRefFS };
   }

   export async function getRoomFromFS(
      roomRefFS: DocumentReference,
   ): Promise<AppTypes.Room | undefined> {
      const roomSnapshot = await roomRefFS.get();
      return roomSnapshot.data() as AppTypes.Room | undefined;
   }

   export async function getTopics(): Promise<AppTypes.Topic[]> {
      const topicsSnapshot = await admin.firestore().collection('topics').doc('topics').get();
      return topicsSnapshot.data()?.topics as AppTypes.Topic[];
   }
}

export default FBConnect;
