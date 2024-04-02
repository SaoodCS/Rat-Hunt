import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import GameHelper from '../../../shared/GameHelper/GameHelper';
import ArrOfObj from '../../../shared/helpers/arrayOfObjects/arrayOfObjects';
import MiscHelper from '../../../shared/helpers/miscHelper/MiscHelper';
import FBConnect from './helpers/FirebaseConnect';

const test = false;
const thirtySeconds = 30000;
const fiveMinutes = 300000;
// eslint-disable-next-line @typescript-eslint/naming-convention
const TIMER = test ? thirtySeconds : fiveMinutes;

if (!admin.apps.length) {
   admin.initializeApp();
}

export const onDataChange = functions.database.ref('/').onWrite(async (change) => {
   const { before, after } = change;
   const changedStatus = FBConnect.getChangedStatus(before.val(), after.val());
   if (!MiscHelper.isNotFalsyOrEmpty(changedStatus)) return;
   const { roomId, userId, userStatus } = changedStatus;
   const { roomRefFS, roomRefRT, userRefRT } = FBConnect.getRefs(roomId, userId);
   const roomData = await FBConnect.getRoomFromFS(roomRefFS);
   if (!MiscHelper.isNotFalsyOrEmpty(roomData)) return;
   const userStates = roomData.gameState.userStates;
   const functionExecutedAt = new Date().toUTCString();
   const updatedUserStates = GameHelper.SetUserStates.updateUser(userStates, userId, [
      { key: 'userStatus', value: userStatus },
      { key: 'statusUpdatedAt', value: functionExecutedAt },
   ]);
   const updatedGameState = { ...roomData.gameState, userStates: updatedUserStates };
   await roomRefFS.update({ gameState: updatedGameState });
   // if userStatus is disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
   if (userStatus !== 'disconnected') return;
   setTimeout(async () => {
      const roomDataFS = await FBConnect.getRoomFromFS(roomRefFS);
      if (!MiscHelper.isNotFalsyOrEmpty(roomDataFS)) return;
      const { gameState: gameStateFS } = roomDataFS;
      const { userStates: userStatesFS, currentRat: currentRatFS } = gameStateFS;
      const thisUserInFS = ArrOfObj.findObj(userStatesFS, 'userId', userId);
      if (!MiscHelper.isNotFalsyOrEmpty(thisUserInFS)) return;
      const { statusUpdatedAt, userStatus: currentUserStatus } = thisUserInFS;
      if (statusUpdatedAt !== functionExecutedAt) return;
      if (currentUserStatus !== 'disconnected') return;
      if (userStatesFS.length <= 1) {
         await roomRefFS.delete();
         await roomRefRT.remove();
         return;
      }
      const gameStateWithoutUser = GameHelper.SetGameState.keysVals(gameStateFS, [
         { key: 'userStates', value: ArrOfObj.filterOut(userStatesFS, 'userId', userId) },
      ]);
      const isRat = currentRatFS === userId;
      const isRoundSummaryPhase = GameHelper.Get.gamePhase(gameStateFS) === 'roundSummary';
      let updatedGameState: typeof gameStateFS;
      if (isRat && !isRoundSummaryPhase) {
         const topics = await FBConnect.getTopics();
         updatedGameState = GameHelper.SetGameState.resetCurrentRound(gameStateWithoutUser, topics);
      } else {
         updatedGameState = gameStateWithoutUser;
      }
      await roomRefFS.update({ gameState: updatedGameState });
      await userRefRT.remove();
   }, TIMER);
});
