import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { ArrayHelp } from "./helpers/ArrayHelp";
import { FBHelp } from "./helpers/FirebaseHelp";
import { MiscHelp } from "./helpers/MiscHelp";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("/")
  .onWrite(async (change, context) => {
    const { before, after } = change;
    const changedStatus = FBHelp.getChangedStatus(before, after);
    const { roomId, userId, userStatus } = changedStatus;
    const { roomRefFS, roomRefRT, userRefRT } = FBHelp.getRefs(roomId, userId);
    const roomData = await FBHelp.getRoomFromFS(roomRefFS);
    if (!MiscHelp.isNotFalsyOrEmpty(roomData)) return;
    const users = roomData.users;
    const user = ArrayHelp.getObj(users, "userId", userId);
    if (!MiscHelp.isNotFalsyOrEmpty(user)) return;
    user["userStatus"] = userStatus;
    user["statusUpdatedAt"] = new Date().toUTCString();
    const usersNew = ArrayHelp.filterOut(users, "userId", userId).push(user);
    await roomRefFS.update({ users: usersNew });
    // if userStatus in disconnected then set a timeout which will remove the user if it remains disconnected for 5 minutes
    if (userStatus !== "disconnected") return;
    setTimeout(async () => {
      const roomDataFS = await FBHelp.getRoomFromFS(roomRefFS);
      if (!MiscHelp.isNotFalsyOrEmpty(roomDataFS)) return;
      const usersFS = roomDataFS.users;
      const userFS = ArrayHelp.getObj(usersFS, "userId", userId);
      if (!MiscHelp.isNotFalsyOrEmpty(userFS)) return;
      if (userFS.userStatus !== "disconnected") return;
      if (usersFS.length === 1) {
        await roomRefFS.delete();
        await roomRefRT.remove();
      } else {
        await roomRefFS.update({
          users: FieldValue.arrayRemove(userFS),
        });
        await userRefRT.remove();
      }
    }, 300000);
  });
