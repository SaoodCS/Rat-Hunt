import * as admin from 'firebase-admin';
import type { Reference } from 'firebase-admin/database';
import type { DocumentReference } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import GameHelper from '../../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../../shared/app/types/AppTypes';
import MiscHelper from '../../../../shared/lib/helpers/miscHelper/MiscHelper';

interface BeforeAfter {
   rooms: {
      [roomId: string]: {
         [userId: string]: {
            userStatus: 'connected' | 'disconnected';
         };
      };
   };
}

type RoomBeforeAfter = BeforeAfter['rooms'][0];
type UserBeforeAfter = BeforeAfter['rooms'][0][0];

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
                  const userStatus = after.rooms[roomId][userId].userStatus;
                  const type = 'roomAdded';
                  changes.push({ roomId, userId, userStatus, type });
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
                  const userStatus = before.rooms[roomId][userId].userStatus;
                  const type = 'roomDeleted';
                  changes.push({ roomId, userId, userStatus, type });
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
                     const userStatus = before.rooms[roomId][userId].userStatus;
                     const type = 'roomDeleted';
                     changes.push({ roomId, userId, userStatus, type });
                  }
               } else if (!after.rooms[roomId][userId]) {
                  const userStatus = before.rooms[roomId][userId].userStatus;
                  const type = 'userDeleted';
                  changes.push({ roomId, userId, userStatus, type });
               } else if (
                  before.rooms[roomId][userId].userStatus !== after.rooms[roomId][userId].userStatus
               ) {
                  const userStatus = after.rooms[roomId][userId].userStatus;
                  const type = 'changedStatus';
                  changes.push({ roomId, userId, userStatus, type });
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
                     const userStatus = after.rooms[roomId][userId].userStatus;
                     const type = 'roomAdded';
                     changes.push({ roomId, userId, userStatus, type });
                  }
               } else if (!before.rooms[roomId][userId]) {
                  const userStatus = after.rooms[roomId][userId].userStatus;
                  const type = 'userAdded';
                  changes.push({ roomId, userId, userStatus, type });
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

   export async function getRoomFromRT(roomRefRT: Reference): Promise<RoomBeforeAfter | null> {
      const roomSnapshot = await roomRefRT.once('value');
      if (!roomSnapshot.exists()) return null;
      return (await roomRefRT.once('value')).val() as RoomBeforeAfter | null;
   }

   export async function getUserFromRT(userRefRT: Reference): Promise<UserBeforeAfter | null> {
      const userSnapshot = await userRefRT.once('value');
      if (!userSnapshot.exists()) return null;
      return (await userRefRT.once('value')).val() as UserBeforeAfter | null;
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
      const timerInMins = GameHelper.CONSTANTS.DISCONNECTED_USER_TIME_LIMIT_MS / 1000 / 60;
      return {
         roomAddedType: `${instanceId} Room ${roomId} and host ${userId} were added to RTDB and Firestore from the client-side, so skipping...`,
         userAddedType: `${instanceId} User ${userId} was added to the room ${roomId} in RTDB and Firestore from the client-side, so skipping...`,
         roomDoesNotExistInFS: `${instanceId} Room ${roomId} does not exist in Firestore, so skipping ${msgSuffix} ${userId} in Firestore...`,
         userDoesNotExistInFS: `${instanceId} User ${userId} does not exist in room ${roomId} in Firestore, so skipping ${msgSuffix} in Firestore`,
         initializingUserDeletionInFS: `${instanceId} User ${userId} was deleted in RTDB, so initializing deletion in Firestore...`,
         initializingRoomDeletionInFS: `${instanceId} Room ${roomId} was deleted in RTDB, so initializing deletion in Firestore...`,
         postDeletingRoomInFS: `${instanceId} -- FBMUTATION -- Room ${roomId} has been deleted in Firestore successfully`,
         postDeletingUserInFS: `${instanceId} -- FBMUTATION -- User ${userId} has been deleted from room ${roomId} in Firestore successfully`,
         postAddingUserInFS: `${instanceId} -- FBMUTATION -- User ${userId} has been added to room ${roomId} in Firestore successfully`,
         initializingStatusChangeInFS: `${instanceId} User ${userId} had a status change in RTDB to ${userStatus}, so initializing the changing of userStatus in Firestore...`,
         postStatusChangeInFS: `${instanceId} -- FBMUTATION -- User ${userId} has had their status updated in room ${roomId} to "${userStatus}" in Firestore successfully`,
         initializeObjsInTimeout: `${instanceId} Timeout set for user ${userId} after changing their userStatus in Firestore to ${userStatus}, to see if they're still disconnected after ${timerInMins} minutes...`,
         noTimeoutSet: `${instanceId} No users userStatus changed to "disconnected" therefore no Timeout set`,
         beginRunTimeoutForUser: `${instanceId} ${timerInMins} minutes have passed so beginning timeout for user ${userId} to check if they have reconnected...`,
         currentRoomDataInFS: `${instanceId} Current room data in Firestore for room ${roomId} is: `,
         currentUserDataInRTDB: `${instanceId} Current user data in RTDB for user ${userId} in ${roomId} is: `,
         currentUserDataInFS: `${instanceId} Current user data in Firestore for user ${userId} in ${roomId} is: `,
         userDoesNotExistInRTDB: `${instanceId} User ${userId} does not exist in room ${roomId} in RTDB, so skipping setTimeout for ${userId}`,
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
