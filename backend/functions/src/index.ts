import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ArrayHelp } from './helpers/ArrayHelp';
import { FBHelp } from './helpers/FirebaseHelp';
import { MiscHelp } from './helpers/MiscHelp';

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
   const changedStatus = FBHelp.getChangedStatus(before.val(), after.val());
   if (!MiscHelp.isNotFalsyOrEmpty(changedStatus)) return;
   const { roomId, userId, userStatus } = changedStatus;
   const { roomRefFS, roomRefRT, userRefRT } = FBHelp.getRefs(roomId, userId);
   const roomData = await FBHelp.getRoomFromFS(roomRefFS);
   if (!MiscHelp.isNotFalsyOrEmpty(roomData)) return;
   const userStates = roomData.gameState.userStates;
   const functionExecutedAt = new Date().toUTCString();
   const updatedUserStates = FBHelp.updateUser(userStates, userId, [
      { key: 'userStatus', value: userStatus },
      { key: 'statusUpdatedAt', value: functionExecutedAt },
   ]);
   const updatedGameState = { ...roomData.gameState, userStates: updatedUserStates };
   await roomRefFS.update({ gameState: updatedGameState });
   // if userStatus is disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
   if (userStatus !== 'disconnected') return;
   setTimeout(async () => {
      const roomDataFS = await FBHelp.getRoomFromFS(roomRefFS);
      if (!MiscHelp.isNotFalsyOrEmpty(roomDataFS)) return;
      const thisUserInFS = ArrayHelp.getObj(roomDataFS.gameState.userStates, 'userId', userId);
      if (!MiscHelp.isNotFalsyOrEmpty(thisUserInFS)) return;
      const { statusUpdatedAt, userStatus: currentUserStatus } = thisUserInFS;
      if (statusUpdatedAt !== functionExecutedAt) return;
      if (currentUserStatus !== 'disconnected') return;
      if (roomDataFS.gameState.userStates.length <= 1) {
         await roomRefFS.delete();
         await roomRefRT.remove();
         return;
      }
      const userStatesFS = roomDataFS.gameState.userStates;
      const userStatesWithoutLeavingUser = ArrayHelp.filterOut(userStatesFS, 'userId', userId);
      const { currentRat } = roomDataFS.gameState;
      const topics = await FBHelp.getTopics();
      const isRat = currentRat === userId;
      const isRoundSummaryPhase = FBHelp.gamePhase(roomDataFS.gameState) === 'roundSummary';
      let updatedGameState: typeof roomDataFS.gameState;
      if (isRat && !isRoundSummaryPhase) {
         updatedGameState = FBHelp.resetRoundGameState(
            roomDataFS.gameState,
            userStatesWithoutLeavingUser,
            topics,
         );
      } else {
         updatedGameState = { ...roomDataFS.gameState, userStates: userStatesWithoutLeavingUser };
      }
      await roomRefFS.update({ gameState: updatedGameState });
      await userRefRT.remove();
   }, TIMER);
});
