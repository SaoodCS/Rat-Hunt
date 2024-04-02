import * as admin from 'firebase-admin';
import type { Reference } from 'firebase-admin/database';
import type { DocumentReference } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import type AppTypes from '../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../shared/lib/helpers/miscHelper/MiscHelper';

export interface IChangeDetails {
   fullPath: string;
   roomId: AppTypes.Room['roomId'];
   userId: AppTypes.UserState['userId'];
   userStatus: AppTypes.UserState['userStatus'];
}

interface PathAndChangedVal {
   path: string;
   changedVal: string;
}

type Obj = { [key: string]: Obj | string };

export namespace FBConnect {
   // eslint-disable-next-line unused-imports/no-unused-vars
   export function compare(
      beforeObj: Obj | null | undefined,
      afterObj: Obj | null | undefined,
   ): PathAndChangedVal[] | null {
      log('BEFORE: ', beforeObj);
      log('AFTER: ', afterObj);
      const beforeObjCopy = !MiscHelper.isNotFalsyOrEmpty(beforeObj) ? {} : beforeObj;
      if (!MiscHelper.isNotFalsyOrEmpty(afterObj)) return null;
      const changes: PathAndChangedVal[] = [];
      function findChanges(before: Obj, after: Obj, path: string): void {
         for (const key in after) {
            if (typeof after[key] === 'object' && after[key] !== null) {
               const nextPath = path ? `${path}.${key}` : key;
               if (!(key in before)) {
                  findChanges({}, after[key] as Obj, nextPath);
               } else if (typeof before[key] === 'object' && before[key] !== null) {
                  findChanges(before[key] as Obj, after[key] as Obj, nextPath);
               } else if (before[key] !== after[key]) {
                  changes.push({
                     path: nextPath.replace(/\./g, '/'),
                     changedVal: after[key] as string,
                  });
               }
            } else if (!(key in before) || before[key] !== after[key]) {
               const nextPath = path ? `${path}.${key}` : key;
               changes.push({
                  path: nextPath.replace(/\./g, '/'),
                  changedVal: after[key] as string,
               });
            }
         }
      }
      findChanges(beforeObjCopy, afterObj, '');
      const isChangesEmpty = !MiscHelper.isNotFalsyOrEmpty(changes);
      log('CHANGES: ', isChangesEmpty ? null : changes);
      return isChangesEmpty ? null : changes;
   }

   export function getChangeDetails(changes: PathAndChangedVal): IChangeDetails {
      const path = changes.path.split('/');
      const roomId = path[1];
      const userId = path[2];
      const changeDetails = {
         fullPath: changes.path,
         roomId,
         userId,
         userStatus: changes.changedVal as AppTypes.UserState['userStatus'],
      };
      log('CHANGE DETAILS: ', changeDetails);
      return changeDetails;
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

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   export function log(...args: any[]): void {
      functions.logger.log(...args);
   }
}

export default FBConnect;
