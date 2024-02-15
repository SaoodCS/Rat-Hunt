import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Helpers, { IRoom, IUser } from "./helpers/Helpers";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("/")
  .onWrite(async (change, context) => {
    const newValue = change.after.val();
    const original = change.before.val();
    const { roomId, userId, field, value } = Helpers.getChangedValDetails(
      original,
      newValue
    );
    const roomRef = admin.firestore().collection("games").doc(`room-${roomId}`);
    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data() as IRoom | undefined;
    if (roomData === undefined) return;
    const users = roomData.users as IUser[];
    const userIndex = users.findIndex((user) => user.userId === userId);
    const user = users[userIndex];
    user[field as "userStatus"] = value as IUser["userStatus"];
    user["lastOnline"] = new Date().toUTCString();
    users[userIndex] = user;
    await roomRef.update({ users });
  });
