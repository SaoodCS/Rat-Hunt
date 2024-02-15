import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
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
    if (userIndex === -1) return;
    const user = users[userIndex];
    user[field as "userStatus"] = value as IUser["userStatus"];
    user["statusUpdatedAt"] = new Date().toUTCString();
    users[userIndex] = user;
    await roomRef.update({ users });

    // set a timer for 5 minutes to check if the userStatus of the user is still "disconnected":
    // if it is, delete the user from the room
    setTimeout(async () => {
      const roomSnapshot = await roomRef.get();
      const roomData = roomSnapshot.data() as IRoom | undefined;
      if (roomData === undefined) return;
      const users = roomData.users as IUser[];
      const userIndex = users.findIndex((user) => user.userId === userId);
      if (userIndex === -1) return;
      const user = users[userIndex];
      if (user.userStatus === "disconnected") {
        const userRefRealtime = admin
          .database()
          .ref(`/rooms/${roomId}/${userId}`);
        const roomRefRealtime = admin.database().ref(`/rooms/${roomId}`);
        if (users.length === 1) {
          await roomRefRealtime.remove();
          await roomRef.delete();
        } else {
          await userRefRealtime.remove();
          await roomRef.update({
            users: FieldValue.arrayRemove(user),
          });
        }
      }
    }, 300000);
  });

// export const firestoreCleanup = functions.pubsub
//   .schedule("every 5 minutes")
//   .onRun(async () => {});
