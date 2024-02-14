import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import Helpers from "./helpers/Helpers";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("/")
  .onWrite(async (change, context) => {
    console.log("hello");
    const newValue = change.after.val();
    const original = change.before.val();

    const { roomId, userId, field, value } = Helpers.getChangedValDetails(
      original,
      newValue
    );

    const roomRef = admin.firestore().collection("games").doc(`room-${roomId}`);
    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();
    const users = roomData?.users;
    const userIndex = users.findIndex((user: any) => user.userId === userId);
    const user = users[userIndex];
    await roomRef.update({
      users: FieldValue.arrayRemove(user),
    });
    const fieldToUpdate = field === "lastOnline" ? "lastOnline" : "userStatus";
    await roomRef.update({
      users: FieldValue.arrayUnion({
        ...user,
        [fieldToUpdate]: value,
      }),
    });
  });

