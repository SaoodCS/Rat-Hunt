/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import GameHelper from '../../../shared/app/GameHelper/GameHelper';
import ArrOfObj from '../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../shared/lib/helpers/date/DateHelper';
import MiscHelper from '../../../shared/lib/helpers/miscHelper/MiscHelper';
import StringHelper from '../../../shared/lib/helpers/string/StringHelper';
import FBConnect from './helpers/FirebaseConnect';

if (!admin.apps.length) {
   admin.initializeApp();
}

// -- Realtime Database onWrite Listener -- //
export const onDataChange = functions.database.ref('/').onWrite(async (change) => {
   const instanceId = `${StringHelper.generateRandUID(6).toUpperCase()} :::: `;
   const { before, after } = change;
   FBConnect.log('New Instance of onDataChange Executed: ', instanceId);
   FBConnect.log(`${instanceId} BEFORE: `, before.val());
   FBConnect.log(`${instanceId} AFTER: `, after.val());
   const comparison = FBConnect.compare(before.val(), after.val());
   FBConnect.log(`${instanceId} COMAPARISON: `, comparison);
   if (!MiscHelper.isNotFalsyOrEmpty(comparison)) {
      FBConnect.log(`${instanceId} No changes detected in RTDB, so no action taken`);
      return;
   }
   const objectsInTimeout: {
      roomId: string;
      userId: string;
      functionExecutedAt: number;
      instanceId: string;
   }[] = [];
   // topics is only needed if there are deleted users in the comparison, so only fetch topics if deleted users exist
   const deletedUsersExist = ArrOfObj.hasKeyVal(comparison, 'type', 'userDeleted');
   let topics = deletedUsersExist ? await FBConnect.getTopics() : null;

   for (let i = 0; i < comparison.length; i++) {
      const { roomId, userId, userStatus, type } = comparison[i];
      const msgSuffix = type === 'userDeleted' ? 'deletion of user' : 'updating userStatus of user';
      const logMsgs = FBConnect.getLogMsgs(instanceId, roomId, userId, userStatus, msgSuffix);

      // If a room is not in the before snapshot, but is in the after snapshot, then the room was added to RTDB
      if (type === 'roomAdded') {
         // Skip making any changes if the room was added to RTDB from the client-side (meaning it was also added to Firestore from the client side)
         FBConnect.log(logMsgs.roomAddedType);
         continue;
      }
      // If a user is not in the before snapshot, but is in the after snapshot, then the user was added to RTDB
      if (type === 'userAdded') {
         // Skip making any changes if the user was added to RTDB from the client-side (meaning they were also added to Firestore from the client side)
         FBConnect.log(logMsgs.userAddedType);
         continue;
      }

      const { roomRefFS } = FBConnect.getRefs(roomId, userId);
      const roomData = await FBConnect.getRoomFromFS(roomRefFS);
      // Skip making any changes if the room does not exist in Firestore
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) {
         FBConnect.log(logMsgs.roomDoesNotExistInFS);
         continue;
      }

      const { userStates } = roomData.gameState;
      const thisUserInFS = ArrOfObj.getObj(userStates, 'userId', userId);
      if (!MiscHelper.isNotFalsyOrEmpty(thisUserInFS)) {
         FBConnect.log(logMsgs.userDoesNotExistInFS);
         continue;
      }
      // If user was in the before snapshot, but not in the after snapshot, then the user was deleted from RTDB
      if (type === 'userDeleted') {
         FBConnect.log(logMsgs.initializingUserDeletionInFS);
         if (!MiscHelper.isNotFalsyOrEmpty(topics)) topics = await FBConnect.getTopics();
         const updatedRoomState = await GameHelper.SetRoomState.removeUser(
            roomData,
            topics,
            userId,
            axios,
         );
         await roomRefFS.update({ gameState: updatedRoomState.gameState });
         FBConnect.log(logMsgs.postDeletingUserInFS);
         continue;
      }

      if (type === 'roomDeleted') {
         FBConnect.log(logMsgs.initializingRoomDeletionInFS);
         await roomRefFS.delete();
         FBConnect.log(logMsgs.postDeletingRoomInFS);
         continue;
      }

      // If user was in the before snapshot and after snapshot, but their userStatus changed, then their status was updated in RTDB
      if (type === 'changedStatus') {
         FBConnect.log(logMsgs.initializingStatusChangeInFS);
         const functionExecutedAt = await DateHelper.getCurrentTime(axios);
         const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, userId, [
            { key: 'userStatus', value: userStatus },
            { key: 'statusUpdatedAt', value: functionExecutedAt },
         ]);
         const updatedGameState = { ...roomData.gameState, userStates: updatedUserStates };
         await roomRefFS.update({ gameState: updatedGameState });
         FBConnect.log(logMsgs.postStatusChangeInFS);
         // If the userStatus was changed to "disconnected" in RTDB, then set a timeout to see if they reconnect within the time limit
         if (userStatus === 'disconnected') {
            FBConnect.log(logMsgs.initializeObjsInTimeout);
            objectsInTimeout.push({
               roomId,
               userId,
               functionExecutedAt,
               instanceId,
            });
         }
         continue;
      }
   }
   // If no users userStatus changed to "disconnected", then do not set a Timeout and end the function here
   if (!MiscHelper.isNotFalsyOrEmpty(objectsInTimeout)) {
      FBConnect.log(`${instanceId} No userStatus changed to "disconnected" so no Timeout set`);
      return;
   }

   // Set a timeout to check if the users who's statuses changed to disconnected haven't reconnected and are still "disconnected" after the time limit
   setTimeout(async () => {
      for (let i = 0; i < objectsInTimeout.length; i++) {
         const { roomId, userId, functionExecutedAt, instanceId } = objectsInTimeout[i];
         const timeoutId = `${instanceId} :: SETTIMEOUT for user ${userId} ::`;
         const msgSuffix = 'status check of user';
         const logMsgs = FBConnect.getLogMsgs(timeoutId, roomId, userId, 'disconnected', msgSuffix);
         FBConnect.log(logMsgs.beginRunTimeoutForUser);
         const { roomRefFS, roomRefRT, userRefRT } = FBConnect.getRefs(roomId, userId);
         const roomDataFS = await FBConnect.getRoomFromFS(roomRefFS);
         const roomDataRT = await FBConnect.getRoomFromRT(roomRefRT);

         if (!MiscHelper.isNotFalsyOrEmpty(roomDataRT)) {
            FBConnect.log(logMsgs.roomDoesNotExistInRTDB);
            continue;
         }
         if (!MiscHelper.isNotFalsyOrEmpty(roomDataFS)) {
            FBConnect.log(logMsgs.roomDoesNotExistInFS);
            continue;
         }
         const { userStates } = roomDataFS.gameState;
         const thisUserInFS = ArrOfObj.getObj(userStates, 'userId', userId);
         if (!MiscHelper.isNotFalsyOrEmpty(thisUserInFS)) {
            FBConnect.log(logMsgs.userDoesNotExistInFS);
            continue;
         }
         const { statusUpdatedAt, userStatus: currentUserStatus } = thisUserInFS;
         if (statusUpdatedAt !== functionExecutedAt) {
            FBConnect.log(logMsgs.statusChangedBeforeTimeoutEnd);
            continue;
         }
         if (currentUserStatus !== 'disconnected') {
            FBConnect.log(logMsgs.noLongerDisconnected);
            continue;
         }
         // If the user is still disconnected after the time limit, then delete the user from the room in RealtimeDB (This then triggers a new instance of onDataChange which updates Firestore accordingly)
         FBConnect.log(logMsgs.preDeletingUserInRTDB);
         await userRefRT.remove();
         FBConnect.log(logMsgs.postDeletingUserInRTDB);
      }
   }, GameHelper.CONSTANTS.DISCONNECTED_USER_TIME_LIMIT_MS);
});

// -- Testing Cases -- //

// Case 1: User ceates a room on the front-end

// Case 1: User joins a room on the front-end

// Case 2: User leaves a room on the front-end

// Case 2: User disconnects from the room

// Case 3: User disconnects from the room then reconnects within the time limit

// Case 4: User disconnects from the room and does not reconnect within the time limit

// Case 5: Two users leave the room at the same time

// Case 6: Two users disconnect from the room at the same time
