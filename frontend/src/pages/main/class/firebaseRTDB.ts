/* eslint-disable @typescript-eslint/no-floating-promises */
import type { DatabaseReference } from 'firebase/database';
import { ref, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { firebaseRTDB } from '../../../global/firebase/config/config';

// Get references to Firebase Realtime Database
const db = firebaseRTDB;

// // Define types for online and offline states
// type OnlineState = {
//    userState: 'online';
//    lastOnline: typeof serverTimestamp;
// };

// type OfflineState = {
//    userState: 'offline';
//    lastOnline: typeof serverTimestamp
// };

// Function to set the user's status on initial load or update
export function setUserStatus(userId: string, roomId: string): void {
   if (!userId || !roomId) {
      console.error('User ID or Room not available. Status cannot be set.');
      return;
   }

   const userStatusRef: DatabaseReference = ref(db, `/rooms/${roomId}/${userId}`);

   // Set user status to connected and log the TIMESTAMP
   const connectedStatus = {
      userState: 'connected',
      lastOnline: serverTimestamp(),
   };
   set(userStatusRef, connectedStatus);

   // Set user status to offline on disconnect
   onDisconnect(userStatusRef).set({
      userState: 'disconnected',
      lastOnline: serverTimestamp(),
   });
}
