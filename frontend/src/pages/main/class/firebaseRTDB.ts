import type { DatabaseReference } from 'firebase/database';
import { onDisconnect, ref, set } from 'firebase/database';
import { firebaseRTDB } from '../../../global/firebase/config/config';

export default class RTDB {
   public static async setUserStatus(userId: string, roomId: string): Promise<void> {
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

   public static async deleteUser(userId: string, roomId: string): Promise<void> {
      if (!userId || !roomId) {
         console.error('User ID or Room not available. User cannot be deleted.');
         return;
      }

      const userStatusRef: DatabaseReference = ref(firebaseRTDB, `/rooms/${roomId}/${userId}`);
      await set(userStatusRef, null);
   }

   public static async deleteRoom(roomId: string): Promise<void> {
      if (!roomId) {
         console.error('Room not available. Room cannot be deleted.');
         return;
      }

      const roomRef: DatabaseReference = ref(firebaseRTDB, `/rooms/${roomId}`);
      await set(roomRef, null);
   }
}
