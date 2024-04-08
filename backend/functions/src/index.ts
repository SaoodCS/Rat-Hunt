/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import GameHelper from '../../../shared/app/GameHelper/GameHelper';
import type AppTypes from '../../../shared/app/types/AppTypes';
import ArrOfObj from '../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../../shared/lib/helpers/date/DateHelper';
import MiscHelper from '../../../shared/lib/helpers/miscHelper/MiscHelper';
import type { IChangeDetails } from './helpers/FirebaseConnect';
import FBConnect from './helpers/FirebaseConnect';

if (!admin.apps.length) {
   admin.initializeApp();
}

export const onDataChange = functions.database.ref('/').onWrite(async (change) => {
   FBConnect.log('New Instance of onDataChange Executed...');
   const { before, after } = change;
   const allChanges = FBConnect.compare(before.val(), after.val());
   if (!MiscHelper.isNotFalsyOrEmpty(allChanges)) return;
   const objectsInTimeout: (IChangeDetails & {
      functionExecutedAt: AppTypes.UserState['statusUpdatedAt'];
      instanceId: string;
   })[] = [];
   for (let i = 0; i < allChanges.length; i++) {
      const functionExecutedAt = await DateHelper.getCurrentTime(axios);
      const instanceId = DateHelper.unixTimeToReadable(functionExecutedAt);
      const { roomId, userId, userStatus, fullPath } = FBConnect.getChangeDetails(allChanges[i]);
      const { roomRefFS } = FBConnect.getRefs(roomId, userId);
      const roomData = await FBConnect.getRoomFromFS(roomRefFS);
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) {
         FBConnect.log(`${instanceId}: Room Data Not Found in Firestore: `, roomId);
         continue;
      }
      const userStates = roomData.gameState.userStates;
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, userId, [
         { key: 'userStatus', value: userStatus },
         { key: 'statusUpdatedAt', value: functionExecutedAt },
      ]);
      const updatedGameState = { ...roomData.gameState, userStates: updatedUserStates };
      await roomRefFS.update({ gameState: updatedGameState });
      if (userStatus === 'disconnected') {
         objectsInTimeout.push({
            roomId,
            userId,
            userStatus,
            fullPath,
            functionExecutedAt,
            instanceId,
         });
      }
   }
   if (!MiscHelper.isNotFalsyOrEmpty(objectsInTimeout)) return;
   // if userStatus is disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
   setTimeout(async () => {
      for (let i = 0; i < objectsInTimeout.length; i++) {
         const { roomId, userId, functionExecutedAt, instanceId } = objectsInTimeout[i];
         const { roomRefFS, roomRefRT, userRefRT } = FBConnect.getRefs(roomId, userId);
         const roomDataFS = await FBConnect.getRoomFromFS(roomRefFS);
         if (!MiscHelper.isNotFalsyOrEmpty(roomDataFS)) {
            FBConnect.log(`${instanceId}: setTimeout: Room Data Not Found in Firestore: `, roomId);
            continue;
         }
         const { gameState: gameStateFS } = roomDataFS;
         const { userStates: userStatesFS } = gameStateFS;
         const thisUserInFS = ArrOfObj.getObj(userStatesFS, 'userId', userId);
         if (!MiscHelper.isNotFalsyOrEmpty(thisUserInFS)) {
            FBConnect.log(`${instanceId}: setTimeout: User Not Found in Firestore: `, userId);
            continue;
         }
         const { statusUpdatedAt: statusUpdatedAtFS, userStatus: currentUserStatus } = thisUserInFS;
         if (statusUpdatedAtFS !== functionExecutedAt) {
            FBConnect.log(
               `${instanceId}: setTimeout: User changed status again so a new instance of onWrite is running and this one is terminated: `,
               userId,
            );
            continue;
         }
         if (currentUserStatus !== 'disconnected') {
            FBConnect.log(
               `${instanceId}: setTimeout: User Status is no longer disconnected so they will not be removed from room: `,
               userId,
            );
            continue;
         }
         if (userStatesFS.length <= 1) {
            FBConnect.log(
               `${instanceId}: setTimeout: Only 1 User with disconnected status Left in Room so Room will be deleted: `,
               roomId,
            );
            await roomRefFS.delete();
            await roomRefRT.remove();
            continue;
         }
         const topics = await FBConnect.getTopics();
         const updatedGameState = (
            await GameHelper.SetRoomState.removeUser(roomDataFS, topics, userId, axios)
         ).gameState;
         await roomRefFS.update({ gameState: updatedGameState });
         await userRefRT.remove();
         FBConnect.log(
            `${instanceId}: setTimeout: User still disconnected after 5 minutes so removed: `,
            userId,
         );
      }
   }, GameHelper.CONSTANTS.DISCONNECTED_USER_TIME_LIMIT_MS);
});
