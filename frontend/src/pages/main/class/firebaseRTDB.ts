import * as firebase from 'firebase-admin';

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./serviceKey/fbServiceKey.json'); // Replace with your actual key path

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

// Get references to Firebase Realtime Database
const db = firebase.database();

// Define types for online and offline states
type OnlineState = {
   state: 'online';
   last_changed: typeof firebase.database.ServerValue.TIMESTAMP;
};

type OfflineState = {
   state: 'offline';
   last_changed: typeof firebase.database.ServerValue.TIMESTAMP;
};

// Function to set the user's status on initial load
export function setUserStatus(status: OnlineState | OfflineState, userId: string, roomId: string) {
   if (!userId || !roomId) {
      console.error('User ID or Room not available. status cannot be set.');
      return;
   }
   const userStatusRef = db.ref(`/rooms/${roomId}/${userId}`);
   userStatusRef.set(status);

   // Set user status offline on disconnect
   userStatusRef.onDisconnect().set({ state: 'offline', last_changed: firebase.database.ServerValue.TIMESTAMP });
}
export const firebaseRTDB = {
   setUserStatus,
};
