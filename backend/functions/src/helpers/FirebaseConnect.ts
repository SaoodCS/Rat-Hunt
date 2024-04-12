import * as admin from 'firebase-admin';
import type { Reference } from 'firebase-admin/database';
import type { DocumentReference } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import GameHelper from '../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../shared/lib/helpers/miscHelper/MiscHelper';

interface UserStatusRTDB {
   userStatus: string;
}

interface RoomRTDB {
   [userId: string]: UserStatusRTDB;
}

interface RoomsRTDB {
   [roomId: string]: RoomRTDB;
}

interface BeforeAfter {
   rooms: RoomsRTDB;
}

export interface UserRTDB {
   roomId: string;
   userId: string;
   userStatus: 'connected' | 'disconnected';
   type: 'userDeleted' | 'userAdded' | 'changedStatus' | 'roomDeleted' | 'roomAdded';
}

export namespace FBConnect {
   export function compare(
      before: BeforeAfter | null | undefined,
      after: BeforeAfter | null | undefined,
   ): UserRTDB[] | null {
      const changes: UserRTDB[] = [];
      const isBeforeEmpty = !MiscHelper.isNotFalsyOrEmpty(before);
      const isAfterEmpty = !MiscHelper.isNotFalsyOrEmpty(after);
      if (isBeforeEmpty) {
         if (isAfterEmpty) return null;
         Object.keys(after.rooms).forEach((roomId) => {
            Object.keys(after.rooms[roomId]).forEach((userId) => {
               const existingObj = changes.find(
                  (change) => change.roomId === roomId && change.type === 'roomAdded',
               );
               if (!existingObj) {
                  changes.push({
                     roomId,
                     userId,
                     userStatus: after.rooms[roomId][userId].userStatus as
                        | 'connected'
                        | 'disconnected',
                     type: 'roomAdded',
                  });
               }
            });
         });
      } else if (isAfterEmpty) {
         Object.keys(before.rooms).forEach((roomId) => {
            Object.keys(before.rooms[roomId]).forEach((userId) => {
               const existingObj = changes.find(
                  (change) => change.roomId === roomId && change.type === 'roomDeleted',
               );
               if (!existingObj) {
                  changes.push({
                     roomId,
                     userId,
                     userStatus: before.rooms[roomId][userId].userStatus as
                        | 'connected'
                        | 'disconnected',
                     type: 'roomDeleted',
                  });
               }
            });
         });
      } else {
         Object.keys(before.rooms).forEach((roomId) => {
            Object.keys(before.rooms[roomId]).forEach((userId) => {
               if (!after.rooms[roomId]) {
                  const existingObj = changes.find(
                     (change) => change.roomId === roomId && change.type === 'roomDeleted',
                  );
                  if (!existingObj) {
                     changes.push({
                        roomId,
                        userId,
                        userStatus: before.rooms[roomId][userId].userStatus as
                           | 'connected'
                           | 'disconnected',
                        type: 'roomDeleted',
                     });
                  }
               } else if (!after.rooms[roomId][userId]) {
                  changes.push({
                     roomId,
                     userId,
                     userStatus: before.rooms[roomId][userId].userStatus as
                        | 'connected'
                        | 'disconnected',
                     type: 'userDeleted',
                  });
               } else if (
                  before.rooms[roomId][userId].userStatus !== after.rooms[roomId][userId].userStatus
               ) {
                  changes.push({
                     roomId,
                     userId,
                     userStatus: after.rooms[roomId][userId].userStatus as
                        | 'connected'
                        | 'disconnected',
                     type: 'changedStatus',
                  });
               }
            });
         });
         Object.keys(after.rooms).forEach((roomId) => {
            Object.keys(after.rooms[roomId]).forEach((userId) => {
               if (!before.rooms[roomId]) {
                  const existingObj = changes.find(
                     (change) => change.roomId === roomId && change.type === 'roomAdded',
                  );
                  if (!existingObj) {
                     changes.push({
                        roomId,
                        userId,
                        userStatus: after.rooms[roomId][userId].userStatus as
                           | 'connected'
                           | 'disconnected',
                        type: 'roomAdded',
                     });
                  }
               } else if (!before.rooms[roomId][userId]) {
                  changes.push({
                     roomId,
                     userId,
                     userStatus: after.rooms[roomId][userId].userStatus as
                        | 'connected'
                        | 'disconnected',
                     type: 'userAdded',
                  });
               }
            });
         });
      }
      return changes;
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
      if (!roomSnapshot.exists) return undefined;
      return roomSnapshot.data() as AppTypes.Room | undefined;
   }

   export async function getRoomFromRT(roomRefRT: Reference): Promise<RoomRTDB | null> {
      const roomSnapshot = await roomRefRT.once('value');
      if (!roomSnapshot.exists()) return null;
      return (await roomRefRT.once('value')).val() as RoomRTDB | null;
   }

   export async function getTopics(): Promise<AppTypes.Topic[]> {
      const topicsSnapshot = await admin.firestore().collection('topics').doc('topics').get();
      if (!topicsSnapshot.exists) throw new Error('Topics document does not exist in Firestore');
      return topicsSnapshot.data()?.topics as AppTypes.Topic[];
   }

   export const getLogMsgs = (
      instanceId: string,
      roomId: string,
      userId: string,
      userStatus: string,
      msgSuffix: string,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
   ) => {
      return {
         roomAddedType: `${instanceId} Room ${roomId} and host ${userId} were added to RTDB and Firestore from the client-side, so skipping...`,
         roomDoesNotExistInFS: `${instanceId} Room ${roomId} does not exist in Firestore, so skipping ${msgSuffix} ${userId} in Firestore...`,
         initializingAddUserInFS: `${instanceId} User ${userId} was added to room ${roomId} in RTDB, so initializing adding in Firestore...`,
         userDoesNotExistInFS: `${instanceId} User ${userId} does not exist in room ${roomId} in Firestore, so skipping ${msgSuffix} in Firestore`,
         initializingUserDeletionInFS: `${instanceId} User ${userId} was deleted in RTDB, so initializing deletion in Firestore...`,
         initializingRoomDeletionInFS: `${instanceId} Room ${roomId} was deleted in RTDB, so initializing deletion in Firestore...`,
         postDeletingRoomInFS: `${instanceId} -- FBMUTATION -- Room ${roomId} has been deleted in Firestore successfully`,
         postDeletingUserInFS: `${instanceId} -- FBMUTATION -- User ${userId} has been deleted from room ${roomId} in Firestore successfully`,
         postAddingUserInFS: `${instanceId} -- FBMUTATION -- User ${userId} has been added to room ${roomId} in Firestore successfully`,
         initializingStatusChangeInFS: `${instanceId} User ${userId} had a status change in RTDB to ${userStatus}, so initializing the changing of userStatus in Firestore...`,
         postStatusChangeInFS: `${instanceId} -- FBMUTATION -- User ${userId} has had their status updated in room ${roomId} to "${userStatus}" in Firestore successfully`,
         initializeObjsInTimeout: `${instanceId} Timeout set for user ${userId} after changing their userStatus in Firestore to ${userStatus}, to see if they're still disconnected after ${
            GameHelper.CONSTANTS.DISCONNECTED_USER_TIME_LIMIT_MS / 1000 / 60
         } minutes...`,
         noTimeoutSet: `${instanceId} No users userStatus changed to "disconnected" therefore no Timeout set`,
         roomDoesNotExistInRTDB: `${instanceId} Room ${roomId} does not exist in RTDB, so skipping setTimeout for ${userId}`,
         statusChangedBeforeTimeoutEnd: `${instanceId} User ${userId} changed status again so a new instance of onDataChange is running, so skipping this setTimeout for ${userId}`,
         noLongerDisconnected: `${instanceId} User ${userId} is no longer disconnected so they will not be removed from room ${roomId}...`,
         preDeletingUserInRTDB: `${instanceId} User ${userId} is still disconnected after 5 minutes, so deleting ${userId} from the room ${roomId} in RTDB...`,
         postDeletingUserInRTDB: `${instanceId} -- RTDB-MUTATION -- User ${userId} has been deleted from room ${roomId} in RTDB successfully`,
      };
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   export function log(...args: any[]): void {
      functions.logger.log(...args);
   }
}

export default FBConnect;
