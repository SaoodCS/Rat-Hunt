import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const onDataChange = functions.database
  .ref("/")
  .onWrite(async (change, context) => {
    console.log("hello")
    const newValue = change.after.val();
    const original = change.before.val();
    const pathOfChangedValue = context.resource;
     // add these to the firestore collection "test" and document "test":
     await admin.firestore().collection("test").doc("test").set({
        newValue,
        original,
        pathOfChangedValue
      });
    return null;
    
  });
