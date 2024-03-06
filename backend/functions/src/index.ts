import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { FBHelp } from "./helpers/FirebaseHelp";
import { MiscHelp } from "./helpers/MiscHelp";

const test = false;
const thirtySeconds = 30000;
const fiveMinutes = 300000;
const TIMER = test ? thirtySeconds : fiveMinutes;

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("/")
  .onWrite(async (change) => {
    const { before, after } = change;
    const changedStatus = FBHelp.getChangedStatus(before.val(), after.val());
    if (!MiscHelp.isNotFalsyOrEmpty(changedStatus)) return;
    const { roomId, userId, userStatus } = changedStatus;
    const { roomRefFS, roomRefRT, userRefRT } = FBHelp.getRefs(roomId, userId);
    const roomData = await FBHelp.getRoomFromFS(roomRefFS);
    if (!MiscHelp.isNotFalsyOrEmpty(roomData)) return;
    const users = roomData.users;
    const thisUser = FBHelp.getUserInUsers(users, userId);
    if (!MiscHelp.isNotFalsyOrEmpty(thisUser)) return;
    const { userIndex, user } = thisUser;
    user["userStatus"] = userStatus;
    const functionExecutedAt = new Date().toUTCString();
    user["statusUpdatedAt"] = functionExecutedAt;
    users[userIndex] = user;
    await roomRefFS.update({ users });
    // if userStatus is disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
    if (userStatus !== "disconnected") return;
    setTimeout(async () => {
      const roomDataFS = await FBHelp.getRoomFromFS(roomRefFS);
      if (!MiscHelp.isNotFalsyOrEmpty(roomDataFS)) return;
      const { gameState, users: usersFS } = roomDataFS;
      const thisUserInUsersFS = FBHelp.getUserInUsers(usersFS, userId);
      if (!MiscHelp.isNotFalsyOrEmpty(thisUserInUsersFS)) return;
      const { user: userInUsersFS } = thisUserInUsersFS;
      if (userInUsersFS.statusUpdatedAt !== functionExecutedAt) return;
      if (userInUsersFS.userStatus !== "disconnected") return;
      if (usersFS.length <= 1) {
        await roomRefFS.delete();
        await roomRefRT.remove();
        return;
      }
      const userStatesFS = roomDataFS.gameState.userStates;
      const userStatesWithoutLeavingUser = userStatesFS.filter(
        (u) => u.userId !== userId
      );
      const { currentRat, activeTopic } = gameState;
      const topics = await FBHelp.getTopics();
      const isRat = currentRat === userId;
      const updatedGameState: typeof gameState = {
        ...gameState,
        userStates: userStatesWithoutLeavingUser,
      };
      await roomRefFS.update({
        users: FieldValue.arrayRemove(userInUsersFS),
        gameState: isRat
          ? FBHelp.resetRoundGameState(
              gameState,
              userStatesWithoutLeavingUser,
              activeTopic,
              topics
            )
          : updatedGameState,
      });
      await userRefRT.remove();
    }, TIMER);
  });
