## Client / Server Architecture

1. **The Client Side**

   - Adds users and rooms to RTDB and Firestore and adds an onDisconnect event to RTDB.
   - Deletes users and rooms and the onDisconnect event from RTDB
   - Changes the userStatus to 'connected' or 'disconnected' in RTDB

2. This then triggers the onDataChange cloud function on the server-side which is triggered every time the RTDB is updated.

3. **The Server Side**
   - Checks what changes were made in the RTDB. Was it of type:
     - Room added with host user?
     - User added?
     - User deleted?
     - Room deleted? (when the last user is deleted from RTDB, this also deletes the room from RTDB as it's the only reference to the room left)
     - Status change?

---

### Server-Side onDataChange cloud function Cases

1. If a new room is created in RTDB, it does nothing as the client-side will add the room to Firestore too (with the host user, topic, and noOfRounds)
2. If a user is added to RTDB, it does nothing as the client-side will add the user to Firestore too
3. If a user is deleted from a room in RTDB, it deletes the user from the room in Firestore
4. If a room is deleted from RTDB, it deletes the room from Firestore
5. If a user's status is changed to 'connected' in RTDB, it changes the user's status to 'connected' in Firestore
6. If a user's status is changed to 'disconnected' in RTDB, it changes the user's status to 'disconnected' in Firestore and then waits 5 minutes to see if the user reconnects:
   1. If the user does not reconnect within 5 minutes, it:
      - Removes the onDisconnect event associated with the user from RTDB
      - Deletes the user from RTDB (which will also delete the room if it's the last user in the room)
      - This then triggers a new instance of onDataChange cloud function which will check if the user / room is deleted in RTDB and then delete them from Firestore if so
