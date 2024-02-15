import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref, set } from 'firebase/database';
import { firebaseRTDB } from '../../../global/firebase/config/config';

// Function to set the user's status on initial load or update
export async function setUserStatus(userId: string, roomId: string): Promise<void> {
   if (!userId || !roomId) {
      console.error('User ID or Room not available. Status cannot be set.');
      return;
   }

   const userStatusRef: DatabaseReference = ref(firebaseRTDB, `/rooms/${roomId}/${userId}`);

   // Set user status to connected and log the TIMESTAMP
   const connectedStatus = {
      userStatus: 'connected',
   };
   await set(userStatusRef, connectedStatus);

   // Set user status to offline on disconnect
   await onDisconnect(userStatusRef).set({
      userStatus: 'disconnected',
   });
}
