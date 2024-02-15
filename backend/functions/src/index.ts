import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Helpers from "./helpers/Helpers";

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
    const roomData = roomSnapshot.data();
    if (roomData === undefined) return;
    const users = roomData.users;
    const userIndex = users.findIndex((user: any) => user.userId === userId);
    const user = users[userIndex];
    user[field] = value;
    user["lastOnline"] = new Date().toUTCString();
    users[userIndex] = user;
    await roomRef.update({ users });
  });
