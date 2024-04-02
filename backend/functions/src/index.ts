/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import GameHelper from '../../../shared/app/GameHelper/GameHelper';
import ArrOfObj from '../../../shared/lib/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../shared/lib/helpers/miscHelper/MiscHelper';
import type { IChangeDetails } from './helpers/FirebaseConnect';
import FBConnect from './helpers/FirebaseConnect';

const test = true;
const thirtySeconds = 30000;
const fiveMinutes = 300000;
const TIMER = test ? thirtySeconds : fiveMinutes;

if (!admin.apps.length) {
   admin.initializeApp();
}

export const onDataChange = functions.database.ref('/').onWrite(async (change) => {
   const { before, after } = change;
   const allChanges = FBConnect.compare(before.val(), after.val());
   if (!MiscHelper.isNotFalsyOrEmpty(allChanges)) return;
   const objectsInTimeout: (IChangeDetails & { functionExecutedAt: string })[] = [];
   for (let i = 0; i < allChanges.length; i++) {
      const { roomId, userId, userStatus, fullPath } = FBConnect.getChangeDetails(allChanges[i]);
      const { roomRefFS } = FBConnect.getRefs(roomId, userId);
      const roomData = await FBConnect.getRoomFromFS(roomRefFS);
      if (!MiscHelper.isNotFalsyOrEmpty(roomData)) {
         FBConnect.log('Room Data Not Found in Firestore: ', roomId);
         continue;
      }
      const userStates = roomData.gameState.userStates;
      const functionExecutedAt = new Date().toUTCString();
      const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, userId, [
         { key: 'userStatus', value: userStatus },
         { key: 'statusUpdatedAt', value: functionExecutedAt },
      ]);
      const updatedGameState = { ...roomData.gameState, userStates: updatedUserStates };
      await roomRefFS.update({ gameState: updatedGameState });
      if (userStatus === 'disconnected') {
         objectsInTimeout.push({ roomId, userId, userStatus, fullPath, functionExecutedAt });
      }
   }
   if (!MiscHelper.isNotFalsyOrEmpty(objectsInTimeout)) return;
   // if userStatus is disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
   setTimeout(async () => {
      for (let i = 0; i < objectsInTimeout.length; i++) {
         const { roomId, userId, functionExecutedAt } = objectsInTimeout[i];
         const { roomRefFS, roomRefRT, userRefRT } = FBConnect.getRefs(roomId, userId);
         const roomDataFS = await FBConnect.getRoomFromFS(roomRefFS);
         if (!MiscHelper.isNotFalsyOrEmpty(roomDataFS)) {
            FBConnect.log('setTimeout: Room Data Not Found in Firestore: ', roomId);
            continue;
         }
         const { gameState: gameStateFS } = roomDataFS;
         const { userStates: userStatesFS, currentRat: currentRatFS } = gameStateFS;
         const thisUserInFS = ArrOfObj.getObj(userStatesFS, 'userId', userId);
         if (!MiscHelper.isNotFalsyOrEmpty(thisUserInFS)) {
            FBConnect.log('setTimeout: User Not Found in Firestore: ', userId);
            continue;
         }
         const { statusUpdatedAt: statusUpdatedAtFS, userStatus: currentUserStatus } = thisUserInFS;
         if (statusUpdatedAtFS !== functionExecutedAt) {
            FBConnect.log(
               'setTimeout: User changed status again so a new instance of onWrite is running and this one is terminated: ',
               userId,
            );
            continue;
         }
         if (currentUserStatus !== 'disconnected') {
            FBConnect.log(
               'setTimeout: User Status is no longer disconnected so they will not be removed from room: ',
               userId,
            );
            continue;
         }
         if (userStatesFS.length <= 1) {
            FBConnect.log(
               'setTimeout: Only 1 User with disconnected status Left in Room so Room will be deleted: ',
               roomId,
            );
            await roomRefFS.delete();
            await roomRefRT.remove();
            continue;
         }
         const gameStateWithoutUser = GameHelper.SetGameState.keysVals(gameStateFS, [
            { key: 'userStates', value: ArrOfObj.filterOut(userStatesFS, 'userId', userId) },
         ]);
         const isRat = currentRatFS === userId;
         const isRoundSummaryPhase = GameHelper.Get.gamePhase(gameStateFS) === 'roundSummary';
         let updatedGameState: typeof gameStateFS;
         if (isRat && !isRoundSummaryPhase) {
            FBConnect.log(
               'setTimeout: Rat User still disconnected during game for over 5 mins so setting new rat',
            );
            const topics = await FBConnect.getTopics();
            updatedGameState = GameHelper.SetGameState.resetCurrentRound(
               gameStateWithoutUser,
               topics,
            );
         } else {
            updatedGameState = gameStateWithoutUser;
         }
         await roomRefFS.update({ gameState: updatedGameState });
         await userRefRT.remove();
         FBConnect.log('setTimeout: User still disconnected after 5 minutes so removed: ', userId);
      }
   }, TIMER);
});
