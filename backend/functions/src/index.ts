import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { FBHelp } from "./helpers/FirebaseHelp";
import { MiscHelp } from "./helpers/MiscHelp";
const thirtySeconds = 30000;

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
    const thisUser = FBHelp.getUser(users, userId);
    if (!MiscHelp.isNotFalsyOrEmpty(thisUser)) return;
    const { userIndex, user } = thisUser;
    user["userStatus"] = userStatus;
    user["statusUpdatedAt"] = new Date().toUTCString();
    users[userIndex] = user;
    await roomRefFS.update({ users });
    // if userStatus in disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
    if (userStatus !== "disconnected") return;
    setTimeout(async () => {
      const roomDataFS = await FBHelp.getRoomFromFS(roomRefFS);
      if (!MiscHelp.isNotFalsyOrEmpty(roomDataFS)) return;
      const usersFS = roomDataFS.users;
      const thisUserFS = FBHelp.getUser(usersFS, userId);
      if (!MiscHelp.isNotFalsyOrEmpty(thisUserFS)) return;
      const { user: userFS } = thisUserFS;
      if (userFS.userStatus !== "disconnected") return;
      if (usersFS.length <= 1) {
        await roomRefFS.delete();
        await roomRefRT.remove();
      } else {
        await roomRefFS.update({
          users: FieldValue.arrayRemove(userFS),
        });
        await userRefRT.remove();
      }
    }, thirtySeconds);
  });
